import { useEffect, useRef, type ReactNode } from "react";
import { damp } from "@/lib/motion";
import { allowsPointerMotion } from "@/motion/env";
import { addTick, TICK } from "@/motion/ticker";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Fraction of the pointer offset the element follows. */
  strength?: number;
}

/** Pulls its content toward the pointer while hovered, then springs back. */
export const Magnetic = ({ children, className, strength = 0.35 }: MagneticProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !allowsPointerMotion()) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let stop: (() => void) | null = null;

    const tick = (_time: number, delta: number) => {
      x = damp(x, targetX, 12, delta);
      y = damp(y, targetY, 12, delta);
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (targetX === 0 && targetY === 0 && Math.abs(x) < 0.05 && Math.abs(y) < 0.05) {
        element.style.transform = "";
        stop?.();
        stop = null;
      }
    };

    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      targetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
      targetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
      stop ??= addTick(tick, TICK.ui);
    };
    const leave = () => {
      targetX = 0;
      targetY = 0;
    };

    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      stop?.();
      element.style.transform = "";
    };
  }, [strength]);

  return (
    <span ref={ref} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </span>
  );
};
