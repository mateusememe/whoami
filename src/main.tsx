import { startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { parseRoute, stripBase } from "@/i18n/routes";
import { loadPage } from "@/lib/lazy";
import "./index.css";

const container = document.getElementById("root")!;

// A tab opened before a deploy asks for chunks the deploy replaced. Reload
// once to get the new build, at most every 30 seconds so a real outage
// cannot loop.
window.addEventListener("vite:preloadError", (event) => {
  try {
    const key = "whoami:reloaded-for-deploy";
    const last = Number(sessionStorage.getItem(key) ?? 0);
    if (Date.now() - last < 30_000) return;
    sessionStorage.setItem(key, String(Date.now()));
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});

// Every page in src/i18n/routes.ts is prerendered (scripts/prerender.ts):
// hydrate it there. Dev, the 404.html shell, and hosts that serve index.html
// for unknown paths render from scratch instead.
const path = stripBase(window.location.pathname.replace(/index\.html$/, ""), import.meta.env.BASE_URL);

const { page } = parseRoute(path);

if (container.firstElementChild && page) {
  // Hydrating inside a transition lets React yield to the browser every few
  // milliseconds instead of blocking the main thread for the whole page. The
  // prerendered HTML is already on screen, so nothing waits for it.
  const hydrate = () =>
    startTransition(() => {
      hydrateRoot(container, <App />);
    });
  // Every page but the home page is a separate chunk: load it first so the first render matches the HTML.
  loadPage(page.kind).then(hydrate);
} else {
  container.replaceChildren();
  createRoot(container).render(<App />);
}
