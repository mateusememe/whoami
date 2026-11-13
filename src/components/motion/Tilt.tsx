import { useEffect, useRef, type ReactNode } from "react";
import { damp } from "@/lib/motion";
import { allowsPointerMotion } from "@/motion/env";
import { addTick, TICK } from "@/motion/ticker";
import { cn } from "@/lib/utils";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
}

/**
 * 3D card tilt. Rotates toward the pointer in perspective and moves a glare
 * highlight (`.tilt-glare` child) with it. Writes CSS variables only.
 */
export const Tilt = ({ children, className, max = 9 }: TiltProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !allowsPointerMotion()) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let glare = 0;
    let hovering = false;
    let stop: (() => void) | null = null;

    const tick = (_time: number, delta: number) => {
      x = damp(x, targetX, 7, delta);
      y = damp(y, targetY, 7, delta);
      glare = damp(glare, hovering ? 1 : 0, 6, delta);
      element.style.setProperty("--tilt-x", `${(-y * max).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(x * max).toFixed(2)}deg`);
      element.style.setProperty("--glare-x", `${(50 + x * 45).toFixed(1)}%`);
      element.style.setProperty("--glare-y", `${(50 + y * 45).toFixed(1)}%`);
      element.style.setProperty("--glare-o", glare.toFixed(3));
      if (!hovering && Math.abs(x) < 0.002 && Math.abs(y) < 0.002 && glare < 0.01) {
        stop?.();
        stop = null;
      }
    };

    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      hovering = true;
      stop ??= addTick(tick, TICK.ui);
    };
    const leave = () => {
      targetX = 0;
      targetY = 0;
      hovering = false;
    };

    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      stop?.();
    };
  }, [max]);

  return (
    <div ref={ref} className={cn("tilt will-change-transform", className)}>
      {children}
    </div>
  );
};
