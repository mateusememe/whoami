import { useEffect, type RefObject } from "react";
import { trackProgress, type ProgressOptions } from "@/motion/progress";

/**
 * Writes the element's scroll progress to a CSS variable (default
 * `--progress`). Pass a stable `onChange` (useCallback) or none.
 */
export function useProgress(ref: RefObject<HTMLElement>, options: ProgressOptions = {}): void {
  const { mode, cssVar, onChange } = options;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return trackProgress(element, { mode, cssVar, onChange });
  }, [ref, mode, cssVar, onChange]);
}
