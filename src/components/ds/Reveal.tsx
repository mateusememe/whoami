import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Fades content in the first time it enters the viewport.
 *
 * Renders visible, so prerendered HTML reads fine without JavaScript. After
 * mount, content that starts below the fold is hidden (off screen, so no
 * flicker) and revealed when it scrolls in. Without IntersectionObserver
 * (old browsers, jsdom) content stays visible.
 */
export const Reveal = ({ children, className }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setVisible(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-visible={visible} className={cn("reveal", className)}>
      {children}
    </div>
  );
};
