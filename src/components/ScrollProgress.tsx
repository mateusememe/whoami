import { useEffect, useRef } from "react";
import { scrollState } from "@/motion/scroll";
import { addTick, TICK } from "@/motion/ticker";

/**
 * Hairline reading-progress bar along the top edge. Writes the transform
 * directly each frame, so scrolling never re-renders React.
 */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = -1;
    return addTick(() => {
      const bar = barRef.current;
      if (!bar || Math.abs(scrollState.progress - last) < 0.0005) return;
      last = scrollState.progress;
      bar.style.transform = `scaleX(${last.toFixed(4)})`;
    }, TICK.ui);
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px]">
      <div ref={barRef} className="h-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
    </div>
  );
};

export default ScrollProgress;
