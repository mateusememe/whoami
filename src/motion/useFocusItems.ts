import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/motion/env";
import { trackProgress } from "@/motion/progress";

/**
 * Reading focus for a list: each direct child gets a `--focus` variable that
 * is 1 while the item sits near the middle of the viewport and falls toward
 * 0 as it moves away. CSS (`.focus-item`) turns it into opacity.
 */
export function useFocusItems(ref: RefObject<HTMLElement>): void {
  useEffect(() => {
    const list = ref.current;
    if (!list || prefersReducedMotion()) return;

    const stops = Array.from(list.children).map((child) =>
      trackProgress(child as HTMLElement, {
        mode: "view",
        cssVar: null,
        onChange: (progress, element) => {
          const focus = Math.min(Math.max(1.35 - Math.abs(progress - 0.5) * 3.1, 0), 1);
          element.style.setProperty("--focus", focus.toFixed(3));
        },
      }),
    );
    return () => stops.forEach((stop) => stop());
  }, [ref]);
}
