import { useEffect, useRef } from "react";
import { readScrollProgress } from "@/lib/motion";

/**
 * Hairline reading-progress bar. Writes the transform directly so scrolling
 * never re-renders React.
 */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${readScrollProgress()})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px">
      <div ref={barRef} className="h-full origin-left bg-signal/80" style={{ transform: "scaleX(0)" }} />
    </div>
  );
};

export default ScrollProgress;
