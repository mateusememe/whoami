import { useEffect, useRef } from "react";
import { allowsPointerMotion } from "@/motion/env";

interface ScrambleProps {
  text: string;
  className?: string;
}

const GLYPHS = "01<>/\\[]{}=+*#_";

/**
 * Text that decodes itself when its nearest link or button is hovered:
 * characters flicker through glyphs and settle left to right. The real text
 * is always in the DOM; only `textContent` flickers during the effect.
 */
export const Scramble = ({ text, className }: ScrambleProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !allowsPointerMotion()) return;
    const host = element.closest<HTMLElement>("a, button, [data-scramble-host]") ?? element;

    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      const start = performance.now();
      const total = 260 + text.length * 22;
      const step = (now: number) => {
        const settled = Math.floor(((now - start) / total) * text.length);
        if (settled >= text.length) {
          element.textContent = text;
          return;
        }
        let out = text.slice(0, settled);
        for (let i = settled; i < text.length; i++) {
          out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        element.textContent = out;
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    host.addEventListener("pointerenter", run);
    return () => {
      host.removeEventListener("pointerenter", run);
      cancelAnimationFrame(frame);
      element.textContent = text;
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
};
