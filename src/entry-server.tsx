import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders, AppRoutes } from "@/App";

/**
 * Build-time render of a route to HTML. scripts/prerender.ts injects the
 * result into dist/index.html so crawlers and agents get content without
 * running JavaScript; main.tsx then hydrates it.
 *
 * The first render must not depend on the browser (localStorage, matchMedia,
 * WebGL): components read those in effects after hydration.
 */
export function render(path = "/"): string {
  const base = import.meta.env.BASE_URL;
  const location = `${base.replace(/\/$/, "")}${path}`;
  return renderToString(
    <AppProviders>
      <StaticRouter location={location} basename={base}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>,
  );
}
