import { useEffect, useRef, type MutableRefObject } from "react";
import { prefersReducedMotion } from "@/motion/env";
import { observe, supportsObserver } from "@/motion/observe";
import { addTick, TICK } from "@/motion/ticker";
import { cn } from "@/lib/utils";

/**
 * An outside clock for the cover, so a page can pause it, change its speed
 * and move through it (src/components/covers/CoverControls.tsx). The cover
 * reads and advances it every frame; nothing here is React state.
 */
export interface CoverClock {
  /** Seconds into the animation. */
  t: number;
  playing: boolean;
  speed: number;
  /** Set by the cover: applies a change to `playing`, `speed` or `t` right away. */
  sync?: () => void;
  /** Called with the time after each drawn frame. */
  onFrame?: (t: number) => void;
}

interface ProjectCoverProps {
  /** Project id; picks the sketch. */
  id: string;
  className?: string;
  /** Drive the animation from this clock instead of running it freely. */
  clock?: MutableRefObject<CoverClock>;
}

/**
 * Animated cover for a project card. The canvas and the sketch code are
 * created only when the card first scrolls into view, and the animation
 * runs only while it is visible. With reduced motion it draws one still
 * frame. Static HTML gets the empty, styled box.
 */
export const ProjectCover = ({ id, className, clock }: ProjectCoverProps) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supportsObserver()) return;

    let disposed = false;
    let visible = false;
    let stopTick: (() => void) | null = null;
    let draw: ((seconds: number) => void) | null = null;
    let refreshColors: (() => void) | null = null;
    let startedAt = 0;
    let last = 0;
    const external = clock?.current;

    const play = () => {
      if (!draw || !visible) return;
      if (external) {
        if (!external.playing) {
          stopTick?.();
          stopTick = null;
          last = 0;
          draw(external.t);
          external.onFrame?.(external.t);
          return;
        }
        stopTick ??= addTick((time) => {
          if (last) external.t += (time - last) * external.speed;
          last = time;
          draw?.(external.t);
          external.onFrame?.(external.t);
        }, TICK.ui);
        return;
      }
      if (prefersReducedMotion()) {
        draw(3.4);
        return;
      }
      stopTick ??= addTick((time) => {
        if (!startedAt) startedAt = time;
        draw?.(time - startedAt);
      }, TICK.ui);
    };

    const load = async () => {
      const { sketches, readSketchColors } = await import("@/components/covers/sketches");
      const sketch = sketches[id];
      if (disposed || !sketch) return;

      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);
      const context = canvas.getContext("2d");
      if (!context) return;

      let colors = readSketchColors();
      refreshColors = () => {
        colors = readSketchColors();
        play();
      };

      draw = (seconds) => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const width = host.clientWidth;
        const height = host.clientHeight;
        if (width === 0 || height === 0) return;
        if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
          canvas.width = Math.round(width * ratio);
          canvas.height = Math.round(height * ratio);
        }
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);
        sketch({ ctx: context, w: width, h: height, t: seconds, colors });
      };
      play();
    };

    if (external) external.sync = play;

    let requested = false;
    const unobserve = observe(
      host,
      (entry) => {
        visible = entry.isIntersecting;
        if (!visible) {
          stopTick?.();
          stopTick = null;
          last = 0;
          return;
        }
        if (!requested) {
          requested = true;
          void load();
        } else {
          play();
        }
      },
      { rootMargin: "15% 15% 15% 15%" },
    );

    // Redraw with the new palette when the theme flips.
    const themeObserver = new MutationObserver(() => refreshColors?.());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      disposed = true;
      unobserve();
      themeObserver.disconnect();
      stopTick?.();
      if (external) external.sync = undefined;
      host.querySelector("canvas")?.remove();
    };
  }, [id, clock]);

  return <div ref={hostRef} className={cn("cover", className)} />;
};
