import { observe, supportsObserver } from "@/motion/observe";
import { scrollState } from "@/motion/scroll";
import { addTick, TICK } from "@/motion/ticker";

/**
 * How an element's scroll progress (0..1) is measured:
 *   view     0 when its top enters the viewport bottom, 1 when its bottom leaves the top
 *   contain  0 when its top reaches the viewport top, 1 when its bottom reaches the
 *            viewport bottom (tall, pinned scenes)
 *   exit     0 while its top is at the viewport top, 1 once it has scrolled fully past
 */
export type ProgressMode = "view" | "contain" | "exit";

export interface ProgressOptions {
  mode?: ProgressMode;
  /** CSS custom property written on the element. Pass null to skip. */
  cssVar?: string | null;
  onChange?: (progress: number, element: HTMLElement) => void;
}

interface Tracker {
  element: HTMLElement;
  mode: ProgressMode;
  cssVar: string | null;
  onChange?: (progress: number, element: HTMLElement) => void;
  near: boolean;
  value: number;
}

const trackers = new Set<Tracker>();
let stopTick: (() => void) | null = null;
let resizeObserver: ResizeObserver | null = null;
let dirty = true;
let lastY = Number.NaN;
let lastWidth = 0;
let lastHeight = 0;

export function measureProgress(mode: ProgressMode, top: number, height: number, viewport: number): number {
  let progress: number;
  switch (mode) {
    case "contain":
      progress = height > viewport ? -top / (height - viewport) : top <= 0 ? 1 : 0;
      break;
    case "exit":
      progress = height > 0 ? -top / height : 0;
      break;
    default:
      progress = (viewport - top) / (viewport + height);
  }
  return Math.min(Math.max(progress, 0), 1);
}

function apply(tracker: Tracker, viewport: number): void {
  const rect = tracker.element.getBoundingClientRect();
  const progress = measureProgress(tracker.mode, rect.top, rect.height, viewport);
  if (Math.abs(progress - tracker.value) < 0.0004) return;
  tracker.value = progress;
  if (tracker.cssVar) tracker.element.style.setProperty(tracker.cssVar, progress.toFixed(4));
  tracker.onChange?.(progress, tracker.element);
}

function tick(): void {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (!dirty && scrollState.y === lastY && width === lastWidth && height === lastHeight) return;
  dirty = false;
  lastY = scrollState.y;
  lastWidth = width;
  lastHeight = height;
  for (const tracker of trackers) if (tracker.near) apply(tracker, height);
}

/** Marks every tracker for re-measurement on the next frame (layout changed without scrolling). */
export function invalidateProgress(): void {
  dirty = true;
}

/**
 * Tracks an element's scroll progress and writes it to a CSS variable, so
 * styles can react without React re-rendering. Returns a stop function.
 */
export function trackProgress(element: HTMLElement, options: ProgressOptions = {}): () => void {
  const tracker: Tracker = {
    element,
    mode: options.mode ?? "view",
    cssVar: options.cssVar === undefined ? "--progress" : options.cssVar,
    onChange: options.onChange,
    near: true,
    value: Number.NaN,
  };
  trackers.add(tracker);
  dirty = true;

  // Measure only while the element is near the viewport; once more when it
  // leaves, so the value settles at exactly 0 or 1.
  const unobserve = supportsObserver()
    ? observe(
        element,
        (entry) => {
          tracker.near = entry.isIntersecting;
          apply(tracker, window.innerHeight);
        },
        { rootMargin: "30% 0px 30% 0px" },
      )
    : () => undefined;

  if (!stopTick) {
    stopTick = addTick(tick, TICK.progress);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(invalidateProgress);
      resizeObserver.observe(document.body);
    }
  }

  return () => {
    unobserve();
    trackers.delete(tracker);
    if (trackers.size === 0) {
      stopTick?.();
      stopTick = null;
      resizeObserver?.disconnect();
      resizeObserver = null;
    }
  };
}
