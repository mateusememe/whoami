import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/motion/env";
import { observe, supportsObserver } from "@/motion/observe";

interface CounterProps {
  value: number;
  className?: string;
  /** Milliseconds. */
  duration?: number;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts up to `value` the first time it scrolls into view. Renders the
 * final value, so static HTML and reduced-motion users get the real number.
 */
export const Counter = ({ value, className, duration = 1600 }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !supportsObserver() || prefersReducedMotion()) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    let frame = 0;
    const unobserve = observe(
      element,
      (entry) => {
        if (!entry.isIntersecting) return;
        unobserve();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          element.textContent = String(Math.round(value * easeOutExpo(t)));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    return () => {
      unobserve();
      cancelAnimationFrame(frame);
      element.textContent = String(value);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
};
