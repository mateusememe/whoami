import { useEffect, useRef } from "react";
import { damp } from "@/lib/motion";
import { allowsPointerMotion } from "@/motion/env";
import { addTick, TICK } from "@/motion/ticker";

const INTERACTIVE = "a, button, [role='button'], [role='tab'], input, summary, label";

/**
 * Trailing ring that follows the pointer. The native cursor stays visible;
 * this is a second, softer signal. It grows over interactive elements and
 * shows a label over elements with `data-cursor-label`.
 *
 * Mouse and trackpad only; hidden for touch and reduced motion.
 */
export const Cursor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const label = labelRef.current;
    if (!element || !label || !allowsPointerMotion()) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let seen = false;

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!seen) {
        seen = true;
        x = targetX;
        y = targetY;
        element.dataset.visible = "true";
      }
    };

    const over = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
      if (labelled) {
        label.textContent = labelled.dataset.cursorLabel ?? "";
        element.dataset.state = "label";
      } else {
        element.dataset.state = target?.closest(INTERACTIVE) ? "link" : "default";
      }
    };

    const leaveWindow = () => {
      seen = false;
      element.dataset.visible = "false";
    };

    const stop = addTick((_time, delta) => {
      x = damp(x, targetX, 16, delta);
      y = damp(y, targetY, 16, delta);
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }, TICK.ui);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leaveWindow);
    return () => {
      stop();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leaveWindow);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="cursor" data-state="default">
      <div className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
};
