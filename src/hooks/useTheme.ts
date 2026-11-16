import { useCallback, useEffect, useReducer, useState } from "react";
import { flushSync } from "react-dom";
import { runViewTransition } from "@/motion/viewTransition";

const THEME_STORAGE_KEY = "portfolio_theme";

function readSavedTheme(): boolean {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) !== "light";
  } catch {
    return true;
  }
}

/** Applies the theme everywhere it lives outside React: <html> class, storage, favicon. */
function applyTheme(dark: boolean): void {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // ignore storage errors
  }

  const favicon = document.querySelector<HTMLLinkElement>("link[rel='icon'][type='image/svg+xml']");
  if (favicon) {
    const base = import.meta.env.BASE_URL || "/";
    favicon.href = `${base.endsWith("/") ? base : `${base}/`}favicon-${dark ? "dark" : "light"}.svg`;
  }
}

/** Theme shared by every component that calls useTheme (header, command palette). */
let current: boolean | null = null;
const listeners = new Set<() => void>();

function setShared(next: boolean): void {
  current = next;
  listeners.forEach((listener) => listener());
}

/**
 * Dark/light theme. Dark is the default.
 *
 * The preference is unknown until mounted: the first render matches the
 * prerendered HTML (dark), then the saved choice is read. index.html sets
 * the class before first paint, so there is no flash.
 *
 * `toggle(origin)` swaps the theme inside a View Transition that grows from
 * `origin` (the button), where the browser supports it.
 */
export function useTheme(): { dark: boolean; toggle: (origin?: { x: number; y: number }) => void } {
  const [mounted, setMounted] = useState(false);
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  const dark = mounted ? (current ?? true) : true;

  useEffect(() => {
    // The first instance to mount reads the saved choice; later ones share it.
    if (listeners.size === 0) {
      current = readSavedTheme();
      applyTheme(current);
    }
    listeners.add(rerender);
    setMounted(true);
    return () => {
      listeners.delete(rerender);
    };
  }, []);

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next = !(current ?? true);
    runViewTransition(() => {
      applyTheme(next);
      flushSync(() => setShared(next));
    }, origin);
  }, []);

  return { dark, toggle };
}
