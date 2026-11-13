/**
 * One requestAnimationFrame loop for all DOM motion (smooth scroll, scroll
 * progress, cursor, tilt, magnets). Callbacks run in priority order, lowest
 * first, so the scroll position is updated before anything reads it.
 *
 * The loop runs only while at least one callback is registered.
 */
export type TickFn = (time: number, delta: number) => void;

interface Entry {
  fn: TickFn;
  priority: number;
}

let entries: Entry[] = [];
let rafId = 0;
let last = 0;

function frame(now: number): void {
  rafId = requestAnimationFrame(frame);
  const delta = Math.min((now - last) / 1000, 0.1);
  last = now;
  // `entries` is replaced (never mutated) on add/remove, so this snapshot is stable.
  const current = entries;
  for (let i = 0; i < current.length; i++) current[i].fn(now / 1000, delta);
}

/** Registers a per-frame callback. Returns a function that removes it. */
export function addTick(fn: TickFn, priority = 0): () => void {
  if (typeof requestAnimationFrame === "undefined") return () => undefined;

  const entry: Entry = { fn, priority };
  entries = [...entries, entry].sort((a, b) => a.priority - b.priority);
  if (!rafId) {
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  return () => {
    entries = entries.filter((e) => e !== entry);
    if (entries.length === 0 && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

/** Priorities used across the motion layer. */
export const TICK = {
  scroll: 0,
  progress: 10,
  scene: 20,
  ui: 30,
} as const;
