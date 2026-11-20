import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders, AppRoutes } from "@/App";
import { languageFromPath } from "@/i18n/routes";
import { loadAllPages } from "@/lib/lazy";

/** Loads the lazily split pages, so render() can produce them synchronously. Await once before rendering. */
export const prepare = () => loadAllPages();

/**
 * Build-time render of a route to HTML. scripts/prerender.ts injects the
 * result into the built page so crawlers and agents get content without
 * running JavaScript; main.tsx then hydrates it.
 *
 * `path` is relative to the app base: `/`, `/pt/` or `/es/`. The language
 * comes from the path, exactly as it does in the browser.
 *
 * The first render must not depend on the browser (localStorage, matchMedia,
 * WebGL): components read those in effects after hydration.
 */
export function render(path = "/"): string {
  const base = import.meta.env.BASE_URL;
  const location = `${base.replace(/\/$/, "")}${path}`;
  return renderToString(
    <AppProviders routeLanguage={languageFromPath(path)}>
      <StaticRouter location={location} basename={base}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>,
  );
}
