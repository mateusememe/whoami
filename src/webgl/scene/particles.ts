/**
 * Pure buffers for the particle field. No three.js: typed arrays only, so
 * this is unit tested in jsdom.
 *
 * Each particle has a resting position in a wide box (the hero "haze") and
 * four random seeds. The vertex shader derives every other formation
 * (terrain, globe, tunnel, galaxy) from the seeds, so they cost no memory.
 */
import { createRng, range } from "@/webgl/core/random";

export interface ParticleBuffers {
  /** xyz haze position per particle. */
  positions: Float32Array;
  /** Four uniform random values (0..1) per particle. */
  seeds: Float32Array;
  count: number;
}

export interface HazeBounds {
  width: number;
  height: number;
  near: number;
  far: number;
}

export const HAZE_BOUNDS: HazeBounds = { width: 46, height: 26, near: -9, far: 16 };

export function buildParticles(count: number, bounds: HazeBounds = HAZE_BOUNDS, seed = 41): ParticleBuffers {
  const rng = createRng(seed);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = range(rng, -bounds.width / 2, bounds.width / 2);
    positions[i * 3 + 1] = range(rng, -bounds.height / 2, bounds.height / 2);
    // Negative z is away from the camera; `near` may sit in front of the focal plane.
    positions[i * 3 + 2] = -range(rng, bounds.near, bounds.far);
    for (let k = 0; k < 4; k++) seeds[i * 4 + k] = rng();
  }

  return { positions, seeds, count };
}

export interface PortraitBuffers {
  /** Per particle: x, y in -0.5..0.5 (y up) and a relief z. */
  positions: Float32Array;
  /** Per particle: tone (0 dark .. 1 bright) and mask (0 hidden .. 1 shown). */
  tones: Float32Array;
  /** Grid cells per side. */
  resolution: number;
}

/** Largest square grid that fits in `count` particles. */
export function portraitResolution(count: number): number {
  return Math.max(1, Math.floor(Math.sqrt(count)));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/** Soft elliptical vignette so the portrait has no square frame. */
function vignette(x: number, y: number): number {
  const d = Math.hypot(x / 0.47, (y - 0.03) / 0.5);
  return 1 - smoothstep(0.74, 1, d);
}

/**
 * Turns a square RGBA image into a dot-matrix portrait: one particle per
 * grid cell, with its tone taken from the pixel's luminance. Particles left
 * over after the grid is full get mask 0 and stay invisible in this
 * formation.
 *
 * `pixels` is `resolution * resolution * 4` bytes, row-major from the top.
 */
export function buildPortrait(pixels: ArrayLike<number>, resolution: number, count: number): PortraitBuffers {
  const positions = new Float32Array(count * 3);
  const tones = new Float32Array(count * 2);
  const cells = Math.min(resolution * resolution, count);

  for (let k = 0; k < cells; k++) {
    const column = k % resolution;
    const row = Math.floor(k / resolution);
    const x = (column + 0.5) / resolution - 0.5;
    const y = 0.5 - (row + 0.5) / resolution;

    const offset = k * 4;
    const luminance =
      (0.2126 * pixels[offset] + 0.7152 * pixels[offset + 1] + 0.0722 * pixels[offset + 2]) / 255;

    positions[k * 3] = x;
    positions[k * 3 + 1] = y;
    positions[k * 3 + 2] = luminance - 0.45;
    // Lift the midtones: a studio photo on a dark page needs its shadows opened up.
    tones[k * 2] = smoothstep(0.04, 0.72, Math.pow(luminance, 0.82));
    tones[k * 2 + 1] = vignette(x, y);
  }

  return { positions, tones, resolution };
}

/** Stand-in used until the photo has loaded: a soft radial gradient. */
export function buildPlaceholderPortrait(count: number): PortraitBuffers {
  const resolution = portraitResolution(count);
  const pixels = new Uint8ClampedArray(resolution * resolution * 4);
  for (let row = 0; row < resolution; row++) {
    for (let column = 0; column < resolution; column++) {
      const x = (column + 0.5) / resolution - 0.5;
      const y = (row + 0.5) / resolution - 0.5;
      const value = Math.round(255 * Math.max(0, 0.75 - Math.hypot(x, y) * 1.6));
      pixels.set([value, value, value, 255], (row * resolution + column) * 4);
    }
  }
  return buildPortrait(pixels, resolution, count);
}

/**
 * How visible the service mesh is for a formation value: full in the hero,
 * gone while other formations hold the stage, back for the contact finale.
 */
export function meshPresence(morph: number): number {
  return Math.max(1 - smoothstep(0.08, 0.85, morph), 0.85 * smoothstep(5.3, 6, morph));
}
