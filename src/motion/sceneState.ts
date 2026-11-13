/**
 * Bridge between the DOM and the WebGL engine. The DOM side (useSceneDirector)
 * writes; the engine reads once per frame. A plain object, so neither side
 * imports the other and nothing re-renders.
 */
export interface PortraitFrame {
  /** Center in normalized device coordinates (-1..1, y up). */
  x: number;
  y: number;
  /** Side length as a fraction of the viewport height. */
  size: number;
}

export const sceneState = {
  /**
   * Which formation the particle field shows, as a float: 0 hero haze,
   * 1 portrait, 2 terrain, 3 globe, 4 tunnel, 5 galaxy. Fractions blend.
   */
  morph: 0,
  portrait: { x: 0.45, y: 0, size: 0.75 } as PortraitFrame,
};

export interface SceneSection {
  /** Document-space top edge in px. */
  top: number;
  /** Formation index for this section. */
  formation: number;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * Formation value for a scroll position. Each section holds its formation
 * while it fills the screen; the blend to the next one happens while that
 * section's top edge crosses the middle of the viewport.
 */
export function computeMorph(sections: SceneSection[], scrollY: number, viewport: number): number {
  if (sections.length === 0) return 0;
  const center = scrollY + viewport / 2;
  let morph = sections[0].formation;
  for (let i = 1; i < sections.length; i++) {
    const boundary = sections[i].top;
    const blend = smoothstep(boundary - viewport * 0.45, boundary + viewport * 0.3, center);
    morph += (sections[i].formation - sections[i - 1].formation) * blend;
  }
  return morph;
}
