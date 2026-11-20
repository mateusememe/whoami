import { useEffect, useId, useRef, useState, type MutableRefObject } from "react";
import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { usePageText } from "@/i18n/pageText";
import { prefersReducedMotion } from "@/motion/env";
import type { CoverClock } from "@/components/covers/ProjectCover";

/** Seconds the timeline spans; past the end, playback starts over. */
export const TIMELINE = 30;
/** Seconds one step moves. */
export const STEP = 0.5;
const SPEEDS = [0.5, 1, 2];

const button =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-base hover:border-signal/50 hover:text-signal";

/**
 * Controls for a project cover on its page. Every sketch is a pure
 * function of time, so pausing, stepping and scrubbing show exactly the
 * state of the algorithm at that moment. Starts paused with reduced motion.
 * The time readout and the slider follow playback through refs, not state.
 */
export const CoverControls = ({ clock }: { clock: MutableRefObject<CoverClock> }) => {
  const t = usePageText();
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const rangeRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLOutputElement>(null);
  const rangeId = useId();

  useEffect(() => {
    const current = clock.current;
    current.onFrame = (time) => {
      if (time > TIMELINE) {
        current.t = time % TIMELINE;
        time = current.t;
      }
      const text = `${time.toFixed(1).padStart(4, "0")} s`;
      if (rangeRef.current) {
        rangeRef.current.value = String(time);
        rangeRef.current.setAttribute("aria-valuetext", text);
      }
      if (timeRef.current) timeRef.current.textContent = text;
    };
    if (prefersReducedMotion()) {
      current.playing = false;
      current.t = 3.4;
      setPlaying(false);
      current.sync?.();
    }
    return () => {
      current.onFrame = undefined;
    };
  }, [clock]);

  const update = (change: Partial<CoverClock>) => {
    Object.assign(clock.current, change);
    if (change.playing !== undefined) setPlaying(change.playing);
    if (change.speed !== undefined) setSpeed(change.speed);
    clock.current.sync?.();
  };

  const step = (direction: 1 | -1) => update({ playing: false, t: Math.max(0, clock.current.t + direction * STEP) });

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
      <button type="button" onClick={() => update({ playing: !playing })} aria-pressed={!playing} className={button}>
        {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        <span className="sr-only">{t(playing ? "cover.pause" : "cover.play")}</span>
      </button>
      <button type="button" onClick={() => step(-1)} className={button}>
        <StepBack size={15} aria-hidden="true" />
        <span className="sr-only">{t("cover.back", { step: STEP })}</span>
      </button>
      <button type="button" onClick={() => step(1)} className={button}>
        <StepForward size={15} aria-hidden="true" />
        <span className="sr-only">{t("cover.forward", { step: STEP })}</span>
      </button>
      <button type="button" onClick={() => update({ t: 0 })} className={button}>
        <RotateCcw size={15} aria-hidden="true" />
        <span className="sr-only">{t("cover.restart")}</span>
      </button>
      <button
        type="button"
        onClick={() => update({ speed: SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length] })}
        className="flex h-10 min-w-12 items-center justify-center rounded-full border border-border px-3 font-mono text-xs tabular-nums text-foreground transition-colors duration-base hover:border-signal/50 hover:text-signal"
      >
        <span className="sr-only">{t("cover.speed")} </span>
        {speed}×
      </button>
      <label htmlFor={rangeId} className="sr-only">
        {t("cover.timeline")}
      </label>
      <input
        ref={rangeRef}
        id={rangeId}
        type="range"
        min={0}
        max={TIMELINE}
        step={0.1}
        defaultValue={0}
        onChange={(event) => update({ playing: false, t: Number(event.target.value) })}
        className="cover-range h-10 min-w-[8rem] flex-1 cursor-pointer"
      />
      <output ref={timeRef} htmlFor={rangeId} className="w-14 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
        00.0 s
      </output>
    </div>
  );
};
