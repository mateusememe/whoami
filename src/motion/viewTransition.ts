import { prefersReducedMotion } from "@/motion/env";

interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransition;
};

/**
 * Runs a DOM update inside a View Transition when the browser supports it.
 * With `origin`, the new state grows as a circle from that point (theme
 * toggle); without it, the browser's default cross-fade applies.
 *
 * `update` must change the DOM synchronously (use flushSync for React state).
 */
export function runViewTransition(update: () => void, origin?: { x: number; y: number }): void {
  const doc = document as TransitionDocument;
  if (typeof doc.startViewTransition !== "function" || prefersReducedMotion()) {
    update();
    return;
  }

  const root = document.documentElement;
  if (origin) root.dataset.vt = "reveal";

  const transition = doc.startViewTransition(update);
  if (!origin) return;

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => undefined);
  transition.finished.finally(() => {
    delete root.dataset.vt;
  });
}
