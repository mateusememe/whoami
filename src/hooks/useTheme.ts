import { useCallback, useEffect, useState } from "react";
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

/**
 * Dark/light theme. Dark is the default.
 *
 * The preference is null until mounted: the first render matches the
 * prerendered HTML (dark), then the saved choice is read. index.html sets
 * the class before first paint, so there is no flash.
 *
 * `toggle(origin)` swaps the theme inside a View Transition that grows from
 * `origin` (the button), where the browser supports it.
 */
export function useTheme(): { dark: boolean; toggle: (origin?: { x: number; y: number }) => void } {
  const [preference, setPreference] = useState<boolean | null>(null);
  const dark = preference ?? true;

  useEffect(() => {
    const saved = readSavedTheme();
    applyTheme(saved);
    setPreference(saved);
  }, []);

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next = !dark;
      runViewTransition(() => {
        applyTheme(next);
        flushSync(() => setPreference(next));
      }, origin);
    },
    [dark],
  );

  return { dark, toggle };
}
