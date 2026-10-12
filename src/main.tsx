import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// dist/index.html ships the home page prerendered (scripts/prerender.ts):
// hydrate it. Dev, the 404.html shell, and hosts that serve index.html for
// unknown paths render from scratch instead.
const base = import.meta.env.BASE_URL;
const isHome = [base, base.replace(/\/$/, ""), `${base}index.html`].includes(window.location.pathname);

if (container.firstElementChild && isHome) {
  hydrateRoot(container, <App />);
} else {
  container.replaceChildren();
  createRoot(container).render(<App />);
}
