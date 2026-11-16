import { startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { isHomePath, stripBase } from "@/i18n/routes";
import "./index.css";

const container = document.getElementById("root")!;

// The home page is prerendered at `/`, `/pt/` and `/es/` (scripts/prerender.ts):
// hydrate it there. Dev, the 404.html shell, and hosts that serve index.html
// for unknown paths render from scratch instead.
const path = stripBase(window.location.pathname.replace(/index\.html$/, ""), import.meta.env.BASE_URL);

if (container.firstElementChild && isHomePath(path)) {
  // Hydrating inside a transition lets React yield to the browser every few
  // milliseconds instead of blocking the main thread for the whole page. The
  // prerendered HTML is already on screen, so nothing waits for it.
  startTransition(() => {
    hydrateRoot(container, <App />);
  });
} else {
  container.replaceChildren();
  createRoot(container).render(<App />);
}
