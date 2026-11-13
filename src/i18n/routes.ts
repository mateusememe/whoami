import type { Language } from "@/i18n/translations";

/**
 * Each language has its own URL, so search engines can index all three and
 * link them with hreflang. English is the default at the root.
 */
export const LANGUAGE_PATHS: Record<Language, string> = { en: "/", pt: "/pt/", es: "/es/" };

/** `lang` attribute and hreflang value per language. */
export const HTML_LANG: Record<Language, string> = { en: "en", pt: "pt-BR", es: "es" };

export const LANGUAGES: Language[] = ["en", "pt", "es"];

const trim = (path: string) => path.replace(/\/+$/, "") || "/";

/**
 * Language named by a path (relative to the app base). `/pt` and `/pt/`
 * give "pt"; the root and any other path give null, meaning "no explicit
 * language": the default or the visitor's saved choice applies.
 */
export function languageFromPath(path: string): Language | null {
  const normalized = trim(path);
  for (const language of LANGUAGES) {
    if (language !== "en" && trim(LANGUAGE_PATHS[language]) === normalized) return language;
  }
  return null;
}

/** True for the paths that render the home page (and are prerendered). */
export function isHomePath(path: string): boolean {
  return trim(path) === "/" || languageFromPath(path) !== null;
}

/** Removes the deployment base (`/whoami/`) from a full pathname. */
export function stripBase(pathname: string, base: string): string {
  const prefix = trim(base);
  if (prefix === "/") return pathname || "/";
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : pathname;
}
