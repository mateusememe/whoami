import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analyticsEnabled, trackPage } from "@/lib/analytics";

/**
 * Counts a page view on load and on every client-side navigation, once the
 * browser is idle so it never competes with the page. Nothing happens
 * when analytics are off (src/lib/analytics.ts).
 */
export function usePageViews(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!analyticsEnabled) return;
    const path = `${import.meta.env.BASE_URL.replace(/\/$/, "")}${pathname}`;
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => trackPage(path), { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(() => trackPage(path), 1500);
    return () => window.clearTimeout(timer);
  }, [pathname]);
}
