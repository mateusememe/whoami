import { projects, talks } from "@/data/portfolio";
import type { Language } from "@/i18n/translations";

/**
 * URL scheme. Each language has its own URLs, so search engines can index
 * all three and link them with hreflang. English is the default, without a
 * prefix:
 *
 *   home      /            /pt/            /es/
 *   project   /projects/x/ /pt/projects/x/ /es/projects/x/
 *   talk      /talks/x/    /pt/talks/x/    /es/talks/x/
 *
 * A new kind of page is a member of `Page`, an entry in ID_PAGES or
 * SINGLE_PAGES, a loader in src/lib/lazy.ts and a route in App.tsx.
 *
 * Paths here are relative to the deployment base (`/whoami/`).
 */
export const LANGUAGE_PATHS: Record<Language, string> = { en: "/", pt: "/pt/", es: "/es/" };

/** `lang` attribute and hreflang value per language. */
export const HTML_LANG: Record<Language, string> = { en: "en", pt: "pt-BR", es: "es" };

export const LANGUAGES: Language[] = ["en", "pt", "es"];

/**
 * A page of the site, independent of language. Pages with an `id` exist once
 * per item (one per featured project, one per talk); the others once per
 * language.
 */
export type Page = { kind: "home" } | { kind: "project"; id: string } | { kind: "talk"; id: string };

export type PageKind = Page["kind"];
type IdPage = Extract<Page, { id: string }>;
type SinglePage = Exclude<Page, IdPage | { kind: "home" }>;

export const HOME: Page = { kind: "home" };

/** Projects with their own page: the featured ones (content in src/data/projectPages.ts). */
export const PROJECT_PAGE_IDS: string[] = projects.filter((project) => project.featured).map((project) => project.id);

/** Every talk has a page (content in src/data/talkPages.ts). */
export const TALK_PAGE_IDS: string[] = talks.map((talk) => talk.id);

/** Pages with an id: the URL segment before the id, and the ids that have a page. */
const ID_PAGES: { [K in IdPage["kind"]]: { segment: string; ids: string[] } } = {
  project: { segment: "projects", ids: PROJECT_PAGE_IDS },
  talk: { segment: "talks", ids: TALK_PAGE_IDS },
};

/** Pages without an id: their URL segment. */
const SINGLE_PAGES: { [K in SinglePage["kind"]]: string } = {};

const idKinds = Object.keys(ID_PAGES) as IdPage["kind"][];
const singleKinds = Object.keys(SINGLE_PAGES) as SinglePage["kind"][];

/** Every prerendered page, in sitemap order. */
export const PAGES: Page[] = [
  HOME,
  ...idKinds.flatMap((kind) => ID_PAGES[kind].ids.map((id): Page => ({ kind, id }))),
  ...singleKinds.map((kind) => ({ kind }) as Page),
];

const trim = (path: string) => path.replace(/\/+$/, "") || "/";

/** URL of a page in a language, with a trailing slash. */
export function pagePath(language: Language, page: Page): string {
  const prefix = LANGUAGE_PATHS[language];
  if (page.kind === "home") return prefix;
  if ("id" in page) return `${prefix}${ID_PAGES[page.kind].segment}/${page.id}/`;
  return `${prefix}${SINGLE_PAGES[(page as { kind: SinglePage["kind"] }).kind]}/`;
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
  if (rest.length === 1) {
    const kind = singleKinds.find((item) => SINGLE_PAGES[item] === rest[0]);
    if (kind) return { language, page: { kind } as Page };
  }
  if (rest.length === 2) {
    const kind = idKinds.find((item) => ID_PAGES[item].segment === rest[0] && ID_PAGES[item].ids.includes(rest[1]));
    if (kind) return { language, page: { kind, id: rest[1] } };
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
  return !("id" in a) || ("id" in b && a.id === b.id);
}

/** Removes the deployment base (`/whoami/`) from a full pathname. */
export function stripBase(pathname: string, base: string): string {
  const prefix = trim(base);
  if (prefix === "/") return pathname || "/";
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : pathname;
}
