import { useEffect, useState } from "react";
import { prefersReducedMotion, REDUCED_MOTION_QUERY } from "@/webgl/core/capabilities";

/** Live `prefers-reduced-motion: reduce` state. Carousels use it to stop autoplay. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}
