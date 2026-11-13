import { prefersReducedMotion } from "@/webgl/core/capabilities";

/** True on devices with a real hover-capable pointer (mouse, trackpad). */
export function canHover(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/** Pointer-driven decoration (cursor, tilt, magnets) runs only here. */
export function allowsPointerMotion(): boolean {
  return canHover() && !prefersReducedMotion();
}

export { prefersReducedMotion };
