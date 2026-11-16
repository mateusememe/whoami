import { projects } from "@/data/portfolio";
import type { Language } from "@/i18n/translations";

/**
 * URL scheme. Each language has its own URLs, so search engines can index
 * all three and link them with hreflang. English is the default, without a
 * prefix:
 *
 *   home      /            /pt/            /es/
 *   project   /projects/x/ /pt/projects/x/ /es/projects/x/
 *
 * Paths here are relative to the deployment base (`/whoami/`).
 */
export const LANGUAGE_PATHS: Record<Language, string> = { en: "/", pt: "/pt/", es: "/es/" };

/** `lang` attribute and hreflang value per language. */
export const HTML_LANG: Record<Language, string> = { en: "en", pt: "pt-BR", es: "es" };

export const LANGUAGES: Language[] = ["en", "pt", "es"];

/** A page of the site, independent of language. */
export type Page = { kind: "home" } | { kind: "project"; id: string };

export const HOME: Page = { kind: "home" };

/** Projects with their own page: the featured ones (content in src/data/projectPages.ts). */
export const PROJECT_PAGE_IDS: string[] = projects.filter((project) => project.featured).map((project) => project.id);

/** Every prerendered page, in sitemap order. */
export const PAGES: Page[] = [HOME, ...PROJECT_PAGE_IDS.map((id): Page => ({ kind: "project", id }))];

const trim = (path: string) => path.replace(/\/+$/, "") || "/";

/** URL of a page in a language, with a trailing slash. */
export function pagePath(language: Language, page: Page): string {
  const prefix = LANGUAGE_PATHS[language];
  return page.kind === "home" ? prefix : `${prefix}projects/${page.id}/`;
}

export interface Route {
  /** Language named by the path, or null at the unprefixed (English) URLs. */
  language: Language | null;
  /** The page, or null when the path matches none. */
  page: Page | null;
}

export function parseRoute(path: string): Route {
  const segments = trim(path).split("/").filter(Boolean);
  const first = segments[0] as Language | undefined;
  const language = first && first !== "en" && LANGUAGES.includes(first) ? first : null;
  const rest = language ? segments.slice(1) : segments;

  if (rest.length === 0) return { language, page: HOME };
  if (rest.length === 2 && rest[0] === "projects" && PROJECT_PAGE_IDS.includes(rest[1])) {
    return { language, page: { kind: "project", id: rest[1] } };
  }
  return { language, page: null };
}

/**
 * Language named by a path. `/pt/` and `/pt/projects/x/` give "pt"; the
 * unprefixed URLs and unknown paths give null, meaning "no explicit
 * language": the default or the visitor's saved choice applies.
 */
export function languageFromPath(path: string): Language | null {
  const route = parseRoute(path);
  return route.page ? route.language : null;
}

/** True for the paths that render the home page. */
export function isHomePath(path: string): boolean {
  return parseRoute(path).page?.kind === "home";
}

/** True for every path that is prerendered at build time (and hydrated). */
export function isPrerenderedPath(path: string): boolean {
  return parseRoute(path).page !== null;
}

export function samePage(a: Page | null, b: Page | null): boolean {
  if (!a || !b || a.kind !== b.kind) return false;
  return a.kind === "home" || (b.kind === "project" && a.id === b.id);
}

/** Removes the deployment base (`/whoami/`) from a full pathname. */
export function stripBase(pathname: string, base: string): string {
  const prefix = trim(base);
  if (prefix === "/") return pathname || "/";
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : pathname;
}
