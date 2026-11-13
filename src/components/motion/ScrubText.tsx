import type { CSSProperties, ElementType } from "react";
import { cn } from "@/lib/utils";

interface ScrubTextProps {
  text: string;
  className?: string;
  as?: ElementType;
}

/**
 * Paragraph whose words light up in reading order as an ancestor's `--scrub`
 * variable goes from 0 to 1 (see `.scrub-word` in index.css). Pure CSS: the
 * component only tags each word with its index. Without `--scrub` the text
 * is fully lit.
 */
export const ScrubText = ({ text, className, as: Element = "p" }: ScrubTextProps) => {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Element className={cn(className)} style={{ "--n": words.length } as CSSProperties}>
      {words.map((word, index) => (
        <span key={`${index}-${word}`} className="scrub-word" style={{ "--i": index } as CSSProperties}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Element>
  );
};
