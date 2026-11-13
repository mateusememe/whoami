import { MathUtils, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { damp } from "@/lib/motion";
import { scrollState } from "@/motion/scroll";
import { sceneState } from "@/motion/sceneState";
import { REDUCED_MOTION_QUERY, type QualitySettings } from "@/webgl/core/capabilities";
import { PerformanceGovernor } from "@/webgl/core/governor";
import { InputTracker } from "@/webgl/core/input";
import { readPalette, watchPalette } from "@/webgl/core/palette";
import { MeshScene } from "@/webgl/scene/MeshScene";
import { ParticleField } from "@/webgl/scene/ParticleField";
import { buildPortrait, meshPresence, portraitResolution } from "@/webgl/scene/particles";

export interface EngineOptions {
  canvas: HTMLCanvasElement;
  quality: QualitySettings;
  reducedMotion: boolean;
  /** Photo sampled into the particle portrait. */
  portraitUrl?: string;
  /** Fires after the first frame reaches the canvas. */
  onFirstFrame?: () => void;
}

const FOV = 50;
const BASE_DISTANCE = 15;
const PORTRAIT_ASPECT = 0.8;
const HALF_FOV_TAN = Math.tan(MathUtils.degToRad(FOV) / 2);
/** Square crop of the photo used for the portrait: center (0..1) and size as a fraction of the short side. */
const PORTRAIT_CROP = { x: 0.5, y: 0.42, size: 0.7 };

/**
 * Owns the renderer, camera and frame loop. Framework agnostic: React only
 * constructs it and calls `dispose()`.
 *
 * Two render modes:
 *   - animated: requestAnimationFrame loop, paused while the tab is hidden
 *   - static (prefers-reduced-motion): one frame per resize or theme change
 *
 * Two layers share the canvas: the service mesh (MeshScene) and the morphing
 * particle field (ParticleField). The DOM tells the engine which formation
 * to show through `sceneState`.
 */
export class Engine {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 140);
  private readonly content: MeshScene;
  private readonly field: ParticleField;
  private readonly input = new InputTracker();
  private readonly governor: PerformanceGovernor;
  private readonly cleanups: Array<() => void> = [];
  private readonly onFirstFrame?: () => void;
  private readonly bufferSize = new Vector2();
  private readonly maxPointSize: number;

  private reducedMotion: boolean;
  private distance = BASE_DISTANCE;
  private rafId = 0;
  private running = false;
  private disposed = false;
  private firstFrame = true;
  private lastTime = 0;
  private elapsed = 0;
  private delta = 0;
  private morph = 0;
  private travel = 0;

  constructor({ canvas, quality, reducedMotion, portraitUrl, onFirstFrame }: EngineOptions) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    this.onFirstFrame = onFirstFrame;

    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: quality.antialias,
      powerPreference: "low-power",
    });
    this.renderer.setClearColor(0x000000, 0);

    const pixelRatio = Math.min(window.devicePixelRatio || 1, quality.maxPixelRatio);
    this.renderer.setPixelRatio(pixelRatio);
    this.governor = new PerformanceGovernor({ initialPixelRatio: pixelRatio });

    const gl = this.renderer.getContext();
    const sizeRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as Float32Array | null;
    this.maxPointSize = sizeRange ? sizeRange[1] : 64;

    const palette = readPalette();
    this.content = new MeshScene(quality, palette);
    this.field = new ParticleField(quality.particles, palette);
    this.scene.add(this.content.root, this.field.points);
    this.morph = sceneState.morph;
    this.resize();

    this.on(window, "resize", this.resize);
    this.on(document, "visibilitychange", this.handleVisibility);
    this.on(canvas, "webglcontextlost", this.stop);
    this.on(canvas, "webglcontextrestored", this.start);
    this.cleanups.push(
      watchPalette((next) => {
        this.content.setPalette(next);
        this.field.setPalette(next);
        this.invalidate();
      }),
    );

    const motionQuery = window.matchMedia?.(REDUCED_MOTION_QUERY);
    if (motionQuery?.addEventListener) {
      this.on(motionQuery, "change", (event) => this.setReducedMotion((event as MediaQueryListEvent).matches));
    }

    if (portraitUrl) this.loadPortrait(portraitUrl, quality.particles);
  }

  /** True while the animated loop is in use (false in the static, reduced-motion mode). */
  get animated(): boolean {
    return !this.reducedMotion;
  }

  start = (): void => {
    if (this.disposed || this.running || document.hidden) return;
    if (this.reducedMotion) {
      this.invalidate();
      return;
    }
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  };

  stop = (): void => {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  };

  /** Schedules a single frame. No-op while the animated loop is running. */
  invalidate = (): void => {
    if (this.disposed || this.running || this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0;
      this.delta = 0;
      this.render();
    });
  };

  setReducedMotion(reduced: boolean): void {
    if (reduced === this.reducedMotion) return;
    this.stop();
    this.reducedMotion = reduced;
    this.start();
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
    this.cleanups.forEach((cleanup) => cleanup());
    this.input.dispose();
    this.content.dispose();
    this.field.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  private tick = (now: number): void => {
    this.rafId = requestAnimationFrame(this.tick);
    this.delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.elapsed += this.delta;
    this.input.update(this.delta);
    this.render();

    const pixelRatio = this.governor.sample(this.delta);
    if (pixelRatio !== null) this.renderer.setPixelRatio(pixelRatio);
  };

  private render(): void {
    const still = this.reducedMotion;
    const delta = this.delta;
    const scroll = still ? 0 : this.input.scroll;
    const pointerX = still ? 0 : this.input.pointer.x;
    const pointerY = still ? 0 : this.input.pointer.y;

    // Formation follows the page; damped so fast scrolling still flows.
    this.morph = still ? 0 : damp(this.morph, sceneState.morph, 3.4, delta);
    // Scrolling moves the camera through the tunnel.
    this.travel += delta * (0.014 + Math.min(Math.abs(scrollState.velocity), 4000) * 0.00003);

    // Camera rig: pointer parallax around a fixed focal plane at z = 0.
    this.camera.position.set(pointerX * 1.2, -pointerY * 0.8, this.distance);
    this.camera.lookAt(0, 0, 0);

    const halfHeight = this.distance * HALF_FOV_TAN;
    const halfWidth = halfHeight * this.camera.aspect;
    const projectionScale = this.projectionScale();

    // On wide screens the hero copy sits on the left, so the mesh starts on the
    // right and returns to the center for the contact finale.
    const wide = this.camera.aspect >= 1.15;
    this.content.setOffset(wide ? halfWidth * 0.34 * (1 - Math.min(this.morph, 1)) : 0);
    this.content.setView(projectionScale, this.distance - 7, this.distance + 9);
    this.content.update({ time: still ? 0 : this.elapsed, scroll, presence: meshPresence(this.morph) });

    const { portrait } = sceneState;
    this.field.setView({
      halfWidth,
      halfHeight,
      projectionScale,
      focus: this.distance,
      maxPointSize: Math.min(this.maxPointSize, 90 * this.renderer.getPixelRatio()),
    });
    this.field.update({
      time: still ? 0 : this.elapsed,
      morph: this.morph,
      travel: this.travel,
      pointerX: pointerX * halfWidth,
      pointerY: -pointerY * halfHeight,
      pointerStrength: still ? 0 : this.input.pointerPresence,
      frameX: portrait.x * halfWidth,
      frameY: portrait.y * halfHeight,
      frameSize: portrait.size * halfHeight * 2,
    });

    this.renderer.render(this.scene, this.camera);

    if (this.firstFrame) {
      this.firstFrame = false;
      this.onFirstFrame?.();
    }
  }

  private resize = (): void => {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    // Portrait: turn the layout upright. Near-square: pull the camera back so it fits.
    const portrait = this.camera.aspect < PORTRAIT_ASPECT;
    this.content.setPortrait(portrait);
    this.distance = BASE_DISTANCE * (portrait ? 1.15 : MathUtils.clamp(1.1 / this.camera.aspect, 1, 1.5));
    this.invalidate();
  };

  /** Drawing-buffer pixels per world unit at distance 1. Points size from this. */
  private projectionScale(): number {
    const bufferHeight = this.renderer.getDrawingBufferSize(this.bufferSize).y;
    return bufferHeight / (2 * HALF_FOV_TAN);
  }

  /** Samples the photo into a dot grid, one cell per particle. */
  private loadPortrait(url: string, particles: number): void {
    const resolution = portraitResolution(particles);
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (this.disposed) return;
      const canvas = document.createElement("canvas");
      canvas.width = resolution;
      canvas.height = resolution;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      // Crop a square around the head and shoulders (the face carries the
      // likeness, and a tighter crop spends more dots on it), then let the
      // canvas downsample to the grid.
      const full = Math.min(image.naturalWidth, image.naturalHeight);
      const side = full * PORTRAIT_CROP.size;
      const left = image.naturalWidth * PORTRAIT_CROP.x - side / 2;
      const top = image.naturalHeight * PORTRAIT_CROP.y - side / 2;
      context.drawImage(
        image,
        Math.max(0, Math.min(left, image.naturalWidth - side)),
        Math.max(0, Math.min(top, image.naturalHeight - side)),
        side,
        side,
        0,
        0,
        resolution,
        resolution,
      );
      const { data } = context.getImageData(0, 0, resolution, resolution);
      this.field.setPortrait(buildPortrait(data, resolution, particles));
      this.invalidate();
    };
    image.src = url;
  }

  private handleVisibility = (): void => {
    if (document.hidden) {
      this.stop();
    } else {
      this.governor.reset();
      this.start();
    }
  };

  private on(target: EventTarget, type: string, handler: (event: Event) => void): void {
    target.addEventListener(type, handler);
    this.cleanups.push(() => target.removeEventListener(type, handler));
  }
}
