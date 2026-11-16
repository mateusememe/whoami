import type { ComponentType } from "react";
import type { CommandPalettePanelProps } from "@/components/CommandPalettePanel";

/**
 * Lazily split parts of the app, loaded once and then held here so they can
 * render synchronously (needed to hydrate a prerendered project page).
 */
export const lazyParts: {
  projectPage: ComponentType | null;
  palettePanel: ComponentType<CommandPalettePanelProps> | null;
} = { projectPage: null, palettePanel: null };

let projectPage: Promise<void> | null = null;
let palettePanel: Promise<void> | null = null;

/**
 * The project page chunk. main.tsx awaits it before hydrating a project URL
 * and the prerender awaits it before rendering; on the home page it loads
 * when the browser is idle or when a project card is opened.
 */
export function loadProjectPage(): Promise<void> {
  projectPage ??= import("@/pages/ProjectPage").then((module) => {
    lazyParts.projectPage = module.default;
  });
  return projectPage;
}

/** The command palette panel, loaded on first open (or when its button is hovered). */
export function loadCommandPalette(): Promise<void> {
  palettePanel ??= import("@/components/CommandPalettePanel").then((module) => {
    lazyParts.palettePanel = module.default;
  });
  return palettePanel;
}
