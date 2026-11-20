import type { ComponentType } from "react";
import type { CommandPalettePanelProps } from "@/components/CommandPalettePanel";
import type { PageKind } from "@/i18n/routes";

/** Every page but the home page is its own chunk. */
export type LazyPageKind = Exclude<PageKind, "home">;

const PAGE_MODULES: Record<LazyPageKind, () => Promise<{ default: ComponentType }>> = {
  project: () => import("@/pages/ProjectPage"),
  talk: () => import("@/pages/TalkPage"),
  now: () => import("@/pages/NowPage"),
  uses: () => import("@/pages/UsesPage"),
  notes: () => import("@/pages/NotesPage"),
  note: () => import("@/pages/NotePage"),
};

/**
 * Lazily split parts of the app, loaded once and then held here so they can
 * render synchronously (needed to hydrate a prerendered page).
 */
export const lazyParts: {
  pages: Partial<Record<LazyPageKind, ComponentType>>;
  palettePanel: ComponentType<CommandPalettePanelProps> | null;
} = { pages: {}, palettePanel: null };

const pending: Partial<Record<LazyPageKind, Promise<void>>> = {};
let palettePanel: Promise<void> | null = null;

/**
 * A page chunk. main.tsx awaits it before hydrating a URL of that kind and
 * the prerender awaits every one before rendering; elsewhere it loads when
 * the browser is idle or when a link to the page is followed.
 */
export function loadPage(kind: PageKind): Promise<void> {
  if (kind === "home") return Promise.resolve();
  pending[kind] ??= PAGE_MODULES[kind]().then((module) => {
    lazyParts.pages[kind] = module.default;
  });
  return pending[kind];
}

/** Every page chunk (for the prerender and the tests). */
export function loadAllPages(): Promise<void> {
  return Promise.all((Object.keys(PAGE_MODULES) as LazyPageKind[]).map(loadPage)).then(() => undefined);
}

/** The command palette panel, loaded on first open (or when its button is hovered). */
export function loadCommandPalette(): Promise<void> {
  palettePanel ??= import("@/components/CommandPalettePanel").then((module) => {
    lazyParts.palettePanel = module.default;
  });
  return palettePanel;
}
