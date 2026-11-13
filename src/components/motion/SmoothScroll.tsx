import { useEffect } from "react";
import { allowsPointerMotion } from "@/motion/env";
import { startScroll } from "@/motion/scroll";

/**
 * Starts per-frame scroll sampling for the page. On mouse/trackpad devices
 * it also enables Lenis inertial scrolling; touch devices keep native
 * scrolling, which is already smooth there.
 */
export const SmoothScroll = () => {
  useEffect(() => startScroll({ smooth: allowsPointerMotion() }), []);
  return null;
};
