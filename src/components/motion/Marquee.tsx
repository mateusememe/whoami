import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion } from "@/motion/env";
import { observe, supportsObserver } from "@/motion/observe";
import { scrollState } from "@/motion/scroll";
import { addTick, TICK } from "@/motion/ticker";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop at rest. */
  duration?: number;
  reverse?: boolean;
}

/**
 * Endless horizontal band. Scrolling the page speeds it up, and it eases
 * back to its resting speed.
 *
 * The content renders once. The second, aria-hidden copy that closes the loop
 * is added only when the band first comes into view, so static HTML and
 * assistive tech see each item a single time.
 */
export const Marquee = ({ children, className, duration = 38, reverse = false }: MarqueeProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [looping, setLooping] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !supportsObserver() || prefersReducedMotion()) return;
    const unobserve = observe(
      root,
      (entry) => {
        if (!entry.isIntersecting) return;
        setLooping(true);
        unobserve();
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    return unobserve;
  }, []);

  // Scroll velocity → playback rate of the CSS animation.
  useEffect(() => {
    const track = trackRef.current;
    if (!looping || !track || typeof track.getAnimations !== "function") return;
    let rate = 1;
    return addTick(() => {
      const target = 1 + Math.min(Math.abs(scrollState.velocity) / 450, 5);
      rate += (target - rate) * 0.08;
      for (const animation of track.getAnimations()) animation.playbackRate = rate;
    }, TICK.ui);
  }, [looping]);

  return (
    <div ref={rootRef} className={cn("marquee", className)}>
      <div
        ref={trackRef}
        className="marquee-track"
        data-loop={looping}
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-direction": reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      >
        <div className="marquee-group">{children}</div>
        {looping && (
          <div className="marquee-group" aria-hidden="true">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
