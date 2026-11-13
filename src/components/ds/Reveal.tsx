import { useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { observe, supportsObserver } from "@/motion/observe";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "fade" | "scale" | "mask" | "line" | "clip" | "stagger";

interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "style"> {
  children?: ReactNode;
  className?: string;
  as?: ElementType;
  /**
   * up       fade and rise (default)
   * fade     opacity only
   * scale    fade and grow
   * mask     the wrapper clips, its first child rises into view (headings)
   * line     scaleX from the left (hairlines)
   * clip     wipes in from the top (images)
   * stagger  direct children enter one after another
   */
  variant?: RevealVariant;
  /** Delay in ms. */
  delay?: number;
  style?: CSSProperties;
}

/**
 * Animates content in the first time it enters the viewport.
 *
 * Renders visible, so prerendered HTML reads fine without JavaScript. After
 * mount, content that starts below the fold is hidden (off screen, so no
 * flicker) and revealed when it scrolls in. The visible flag is written to
 * the DOM directly: no state, so nothing re-renders.
 */
export const Reveal = ({
  children,
  className,
  as: Element = "div",
  variant = "up",
  delay,
  style,
  ...rest
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !supportsObserver()) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.95) return;

    element.dataset.visible = "false";
    const unobserve = observe(
      element,
      (entry) => {
        if (!entry.isIntersecting) return;
        element.dataset.visible = "true";
        unobserve();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    return unobserve;
  }, []);

  return (
    <Element
      ref={ref}
      className={cn("reveal", `reveal-${variant}`, className)}
      style={delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style}
      {...rest}
    >
      {children}
    </Element>
  );
};
