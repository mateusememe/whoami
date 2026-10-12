/**
 * Device capability probing and quality tiers.
 *
 * This module must stay free of `three` imports: it ships in the main bundle
 * and decides whether the WebGL chunk is downloaded at all.
 */

export type QualityTier = "low" | "medium" | "high";

export interface DeviceProfile {
  width: number;
  cores: number;
  /** GB, from navigator.deviceMemory (Chromium only). */
  memory?: number;
  coarsePointer: boolean;
}

export interface QualitySettings {
  tier: QualityTier;
  maxPixelRatio: number;
  clusters: number;
  nodesPerCluster: number;
  glyphs: number;
  antialias: boolean;
}

export const QUALITY_PRESETS: Record<QualityTier, Omit<QualitySettings, "tier">> = {
  low: { maxPixelRatio: 1, clusters: 5, nodesPerCluster: 9, glyphs: 220, antialias: false },
  medium: { maxPixelRatio: 1.5, clusters: 6, nodesPerCluster: 13, glyphs: 480, antialias: true },
  high: { maxPixelRatio: 2, clusters: 7, nodesPerCluster: 18, glyphs: 900, antialias: true },
};

export function pickQualityTier(profile: DeviceProfile): QualityTier {
  if (profile.cores <= 4 || (profile.memory !== undefined && profile.memory <= 2)) return "low";
  if (profile.coarsePointer || profile.width < 768 || (profile.memory !== undefined && profile.memory <= 4)) {
    return "medium";
  }
  return "high";
}

export function readDeviceProfile(): DeviceProfile {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    width: window.innerWidth,
    cores: nav.hardwareConcurrency || 4,
    memory: nav.deviceMemory,
    coarsePointer: matchesMedia("(pointer: coarse)"),
  };
}

export function getQualitySettings(profile: DeviceProfile = readDeviceProfile()): QualitySettings {
  const tier = pickQualityTier(profile);
  return { tier, ...QUALITY_PRESETS[tier] };
}

/** three.js r163+ renders through WebGL 2 only, so that is what we probe for. */
export function supportsWebGL2(): boolean {
  if (typeof window === "undefined" || typeof window.WebGL2RenderingContext === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl || typeof gl.getParameter !== "function") return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return matchesMedia(REDUCED_MOTION_QUERY);
}

function matchesMedia(query: string): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}
