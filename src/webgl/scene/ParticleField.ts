import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  NormalBlending,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import type { ScenePalette } from "@/webgl/core/palette";
import { buildParticles, buildPlaceholderPortrait, type PortraitBuffers } from "@/webgl/scene/particles";
import { dustFragment, dustVertex } from "@/webgl/scene/shaders";

export interface FieldView {
  /** Half extents of the visible area at the focal plane, world units. */
  halfWidth: number;
  halfHeight: number;
  /** Drawing-buffer pixels per world unit at distance 1. */
  projectionScale: number;
  /** Camera distance to the focal plane. */
  focus: number;
  maxPointSize: number;
}

export interface FieldFrame {
  time: number;
  /** Formation value, 0..5 (see dustVertex). */
  morph: number;
  /** Distance travelled through the tunnel, in loops. */
  travel: number;
  /** Pointer on the focal plane (world units) and its strength 0..1. */
  pointerX: number;
  pointerY: number;
  pointerStrength: number;
  /** Portrait center (world units) and side length. */
  frameX: number;
  frameY: number;
  frameSize: number;
}

/** World-unit size of a haze particle. */
const PARTICLE_SIZE = 0.05;
/** Lens aperture: higher blurs out-of-focus particles more. */
const APERTURE = 0.0105;
// Above 1 on light: soft dots saturate into solid ink, which a pale page needs.
const OPACITY = { dark: 0.95, light: 1.6 };

/**
 * The morphing particle field. One draw call; every formation and the
 * transition between them runs in the vertex shader.
 */
export class ParticleField {
  readonly points: Points;

  private readonly geometry = new BufferGeometry();
  private readonly material: ShaderMaterial;
  private readonly portrait: BufferAttribute;
  private readonly tone: BufferAttribute;
  private readonly count: number;
  private resolution: number;

  constructor(count: number, palette: ScenePalette) {
    this.count = count;
    const particles = buildParticles(count);
    const placeholder = buildPlaceholderPortrait(count);
    this.resolution = placeholder.resolution;

    this.portrait = new BufferAttribute(placeholder.positions, 3);
    this.tone = new BufferAttribute(placeholder.tones, 2);
    this.geometry.setAttribute("position", new BufferAttribute(particles.positions, 3));
    this.geometry.setAttribute("aSeed", new BufferAttribute(particles.seeds, 4));
    this.geometry.setAttribute("aPortrait", this.portrait);
    this.geometry.setAttribute("aTone", this.tone);

    this.material = new ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uTravel: { value: 0 },
        uSize: { value: PARTICLE_SIZE },
        uDot: { value: 0.07 },
        uProjScale: { value: 1 },
        uFocus: { value: 15 },
        uAperture: { value: APERTURE },
        uMaxSize: { value: 64 },
        uDark: { value: 1 },
        uView: { value: new Vector2(10, 7) },
        uFrame: { value: new Vector3(4, 0, 8) },
        uPointer: { value: new Vector3() },
        uColor: { value: new Vector3() },
        uSignal: { value: new Vector3() },
        uOpacity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    this.points = new Points(this.geometry, this.material);
    // Positions are computed in the shader, so CPU-side bounds are meaningless.
    this.points.frustumCulled = false;
    this.points.renderOrder = 1;
    this.setPalette(palette);
  }

  /** Replaces the placeholder with the sampled photo. */
  setPortrait(data: PortraitBuffers): void {
    if (data.positions.length !== this.count * 3) return;
    (this.portrait.array as Float32Array).set(data.positions);
    (this.tone.array as Float32Array).set(data.tones);
    this.portrait.needsUpdate = true;
    this.tone.needsUpdate = true;
    this.resolution = data.resolution;
  }

  setPalette(palette: ScenePalette): void {
    const { uniforms } = this.material;
    uniforms.uColor.value.fromArray(palette.foreground);
    uniforms.uSignal.value.fromArray(palette.signal);
    uniforms.uDark.value = palette.isDark ? 1 : 0;
    uniforms.uOpacity.value = palette.isDark ? OPACITY.dark : OPACITY.light;

    // Additive light on dark; ink on light.
    const blending = palette.isDark ? AdditiveBlending : NormalBlending;
    if (this.material.blending !== blending) {
      this.material.blending = blending;
      this.material.needsUpdate = true;
    }
  }

  setView(view: FieldView): void {
    const { uniforms } = this.material;
    uniforms.uView.value.set(view.halfWidth, view.halfHeight);
    uniforms.uProjScale.value = view.projectionScale;
    uniforms.uFocus.value = view.focus;
    uniforms.uMaxSize.value = view.maxPointSize;
  }

  update(frame: FieldFrame): void {
    const { uniforms } = this.material;
    uniforms.uTime.value = frame.time;
    uniforms.uMorph.value = Math.min(Math.max(frame.morph, 0), 5);
    uniforms.uTravel.value = frame.travel;
    uniforms.uPointer.value.set(frame.pointerX, frame.pointerY, frame.pointerStrength);
    uniforms.uFrame.value.set(frame.frameX, frame.frameY, frame.frameSize);
    // A dot slightly larger than its grid cell, so bright areas read as solid.
    uniforms.uDot.value = (frame.frameSize / this.resolution) * 1.3;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
