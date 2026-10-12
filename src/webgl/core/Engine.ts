import { MathUtils, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { REDUCED_MOTION_QUERY, type QualitySettings } from "@/webgl/core/capabilities";
import { PerformanceGovernor } from "@/webgl/core/governor";
import { InputTracker } from "@/webgl/core/input";
import { readPalette, watchPalette } from "@/webgl/core/palette";
import { MeshScene } from "@/webgl/scene/MeshScene";

export interface EngineOptions {
  canvas: HTMLCanvasElement;
  quality: QualitySettings;
  reducedMotion: boolean;
  /** Fires after the first frame reaches the canvas. */
  onFirstFrame?: () => void;
}

const FOV = 50;
const BASE_DISTANCE = 15;
const PORTRAIT_ASPECT = 0.8;

/**
 * Owns the renderer, camera and frame loop. Framework agnostic: React only
 * constructs it and calls `dispose()`.
 *
 * Two render modes:
 *   - animated: requestAnimationFrame loop, paused while the tab is hidden
 *   - static (prefers-reduced-motion): one frame per resize or theme change
 */
export class Engine {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 120);
  private readonly content: MeshScene;
  private readonly input = new InputTracker();
  private readonly governor: PerformanceGovernor;
  private readonly cleanups: Array<() => void> = [];
  private readonly onFirstFrame?: () => void;
  private readonly bufferSize = new Vector2();

  private reducedMotion: boolean;
  private distance = BASE_DISTANCE;
  private rafId = 0;
  private running = false;
  private disposed = false;
  private firstFrame = true;
  private lastTime = 0;
  private elapsed = 0;

  constructor({ canvas, quality, reducedMotion, onFirstFrame }: EngineOptions) {
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

    this.content = new MeshScene(quality, readPalette());
    this.scene.add(this.content.root);
    this.resize();

    this.on(window, "resize", this.resize);
    this.on(document, "visibilitychange", this.handleVisibility);
    this.on(canvas, "webglcontextlost", this.stop);
    this.on(canvas, "webglcontextrestored", this.start);
    this.cleanups.push(
      watchPalette((palette) => {
        this.content.setPalette(palette);
        this.invalidate();
      }),
    );

    const motionQuery = window.matchMedia?.(REDUCED_MOTION_QUERY);
    if (motionQuery?.addEventListener) {
      this.on(motionQuery, "change", (event) => this.setReducedMotion((event as MediaQueryListEvent).matches));
    }
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
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  private tick = (now: number): void => {
    this.rafId = requestAnimationFrame(this.tick);
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.elapsed += delta;
    this.input.update(delta);
    this.render();

    const pixelRatio = this.governor.sample(delta);
    if (pixelRatio !== null) this.renderer.setPixelRatio(pixelRatio);
  };

  private render(): void {
    const still = this.reducedMotion;
    const scroll = still ? 0 : this.input.scroll;
    const pointerX = still ? 0 : this.input.pointer.x;
    const pointerY = still ? 0 : this.input.pointer.y;

    // Camera rig: pointer parallax, a slow descent and a dolly-in mid page.
    const cameraDistance = this.distance - Math.sin(scroll * Math.PI) * 3.5;
    this.camera.position.set(pointerX * 1.4, -pointerY * 0.9 - scroll * 1.5, cameraDistance);
    this.camera.lookAt(0, -scroll * 1.2, 0);
    this.content.setView(this.projectionScale(), cameraDistance - 7, cameraDistance + 9);

    this.content.update({ time: still ? 0 : this.elapsed, scroll });
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
    return bufferHeight / (2 * Math.tan(MathUtils.degToRad(FOV) / 2));
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
