/**
 * Motion math shared by the DOM (scroll progress bar) and the WebGL engine.
 */

/**
 * Frame-rate independent exponential smoothing. `lambda` is the decay rate
 * per second: higher values converge faster.
 */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return target + (current - target) * Math.exp(-lambda * delta);
}

/** Page scroll position normalized to 0..1. */
export function scrollProgress(scrollY: number, scrollHeight: number, viewportHeight: number): number {
  const max = scrollHeight - viewportHeight;
  if (max <= 0) return 0;
  return Math.min(Math.max(scrollY / max, 0), 1);
}

export function readScrollProgress(): number {
  return scrollProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight);
}
