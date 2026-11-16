import Lenis from "lenis";
import { damp } from "@/lib/motion";
import { addTick, TICK } from "@/motion/ticker";
import { prefersReducedMotion } from "@/motion/env";

/**
 * Page scroll, sampled once per frame. Everything scroll-linked reads this
 * instead of listening to scroll events.
 */
export const scrollState = {
  /** Scroll offset in px. */
  y: 0,
  /** Smoothed velocity in px/s. Signed: positive scrolls down. */
  velocity: 0,
  direction: 1 as 1 | -1,
  /** 0..1 over the whole document. */
  progress: 0,
};

let lenis: Lenis | null = null;
let stopTick: (() => void) | null = null;
let users = 0;

function update(_time: number, delta: number): void {
  lenis?.raf(performance.now());

  const y = window.scrollY;
  const raw = delta > 0 ? (y - scrollState.y) / delta : 0;
  scrollState.velocity = damp(scrollState.velocity, raw, 9, delta);
  if (Math.abs(raw) > 4) scrollState.direction = raw > 0 ? 1 : -1;
  scrollState.y = y;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollState.progress = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
}

export interface ScrollOptions {
  /** Inertial wheel scrolling (Lenis). Off on touch devices and for reduced motion. */
  smooth: boolean;
}

/** Starts scroll sampling (and Lenis when `smooth`). Returns a stop function. */
export function startScroll({ smooth }: ScrollOptions): () => void {
  users += 1;
  if (users === 1) {
    scrollState.y = window.scrollY;
    if (smooth) {
      lenis = new Lenis({
        lerp: 0.105,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        anchors: true,
      });
    }
    stopTick = addTick(update, TICK.scroll);
  }

  return () => {
    users -= 1;
    if (users > 0) return;
    stopTick?.();
    stopTick = null;
    lenis?.destroy();
    lenis = null;
  };
}

export type ScrollTarget = number | HTMLElement;

/** Scrolls to an element or offset, with Lenis when active and natively otherwise. */
export function scrollToTarget(target: ScrollTarget, options: { immediate?: boolean; offset?: number } = {}): void {
  const immediate = options.immediate ?? prefersReducedMotion();
  const offset = options.offset ?? 0;

  if (lenis) {
    // After a route change the page height differs from what Lenis measured;
    // refresh it, or the target is clamped to the old page's limit.
    lenis.resize();
    lenis.scrollTo(target, { offset, immediate, force: true });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  // "instant", not "auto": the root has `scroll-behavior: smooth`, which "auto" would follow.
  window.scrollTo({ top: top + offset, behavior: immediate ? "instant" : "smooth" });
}

/** Pauses or resumes smooth scrolling (used while the mobile menu is open). */
export function setScrollLocked(locked: boolean): void {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
