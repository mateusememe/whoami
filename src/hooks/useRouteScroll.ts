import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { parseRoute, samePage } from "@/i18n/routes";
import { scrollToTarget } from "@/motion/scroll";
import { invalidateSceneLayout } from "@/motion/useSceneDirector";

/** Layout effect in the browser; nothing on the server (the prerender has no scroll). */
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Scroll offset per history entry, for the back and forward buttons. */
const positions = new Map<string, number>();

/**
 * Retries of the last scroll action. They outlive the effect on purpose: a
 * language redirect (a REPLACE right after arriving) must not cancel them.
 */
let retries: number[] = [];
function retry(fn: () => void, delays: number[]): void {
  retries.forEach((timer) => window.clearTimeout(timer));
  fn();
  retries = delays.map((ms) => window.setTimeout(fn, ms));
}

/**
 * Scroll position across client-side navigation:
 *
 *   back / forward       the position the entry had when the visitor left it
 *   link with a hash     the section (it may sit further down once effects run)
 *   link to a new page   the top
 *   same page, new URL   unchanged (switching language replaces the URL; an
 *                        in-page anchor is scrolled by the browser or Lenis)
 */
export function useRouteScroll(): void {
  const location = useLocation();
  const navigationType = useNavigationType();
  const keyRef = useRef(location.key);
  const pageRef = useRef(parseRoute(location.pathname).page);
  const mountedRef = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    let frame = 0;
    const save = () => {
      frame = 0;
      positions.set(keyRef.current, window.scrollY);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(save);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Layout effect: runs in the same commit as the new page, before paint and
  // before a View Transition takes its "after" snapshot.
  useBrowserLayoutEffect(() => {
    const previousPage = pageRef.current;
    const page = parseRoute(location.pathname).page;
    const first = !mountedRef.current;
    mountedRef.current = true;
    keyRef.current = location.key;
    pageRef.current = page;
    invalidateSceneLayout();

    if (!first && navigationType === "POP" && positions.has(location.key)) {
      const y = positions.get(location.key) ?? 0;
      // Pinned sections size themselves in effects; retry until the page is tall enough.
      retry(() => scrollToTarget(y, { immediate: true }), [60, 260, 600]);
    } else if (!first && navigationType !== "PUSH" && samePage(previousPage, page)) {
      // Language switch or in-page anchor: leave the scroll position alone.
    } else if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      retry(() => {
        const element = document.getElementById(id);
        if (element) scrollToTarget(element, { immediate: true });
      }, [120, 400]);
    } else if (!samePage(previousPage, page)) {
      retry(() => scrollToTarget(0, { immediate: true }), []);
    }
  }, [location.key, location.pathname, location.hash, navigationType]);
}
