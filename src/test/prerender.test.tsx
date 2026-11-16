import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "@testing-library/react";
import React from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import App from "@/App";
import { prepare, render } from "@/entry-server";

// Rendered once with empty storage, like the build. Each test then hydrates
// it under different client state; the first client render must match.
// prepare() loads the lazily split project page, as the prerender script does.
await prepare();
const serverHtml = render("/");

describe("hydration", () => {
  let root: Root | undefined;

  afterEach(() => {
    act(() => root?.unmount());
    root = undefined;
    localStorage.clear();
    document.body.innerHTML = "";
    window.history.replaceState(null, "", "/");
  });

  const hydrate = (html = serverHtml) => {
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const recoverable = vi.fn();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    act(() => {
      root = hydrateRoot(container, <App />, { onRecoverableError: recoverable });
    });
    const mismatches = consoleError.mock.calls.filter((args) =>
      args.some((arg) => /hydrat|did not match|server HTML|server rendered/i.test(String(arg))),
    );
    consoleError.mockRestore();
    return { container, recoverable, mismatches };
  };

  it("hydrates the prerendered markup without mismatches", () => {
    const { recoverable, mismatches } = hydrate();
    expect(recoverable).not.toHaveBeenCalled();
    expect(mismatches).toEqual([]);
  });

  it("hydrates cleanly for a returning visitor, then applies saved language and theme", () => {
    localStorage.setItem("portfolio_lang", "pt");
    localStorage.setItem("portfolio_theme", "light");

    const { container, recoverable, mismatches } = hydrate();
    expect(recoverable).not.toHaveBeenCalled();
    expect(mismatches).toEqual([]);
    expect(container.textContent).toContain("Sobre Mim");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("portfolio_theme")).toBe("light");
  });

  it("moves a returning visitor to the URL of the saved language", () => {
    localStorage.setItem("portfolio_lang", "es");
    hydrate();
    expect(window.location.pathname).toBe("/es/");
  });

  it("hydrates a project page in Spanish without mismatches", () => {
    window.history.replaceState(null, "", "/es/projects/8-puzzle/");

    const { container, recoverable, mismatches } = hydrate(render("/es/projects/8-puzzle/"));
    expect(recoverable).not.toHaveBeenCalled();
    expect(mismatches).toEqual([]);
    expect(container.querySelector("h1")?.textContent).toBe("8-puzzle");
    expect(container.textContent).toContain("Detalles");
    expect(window.location.pathname).toBe("/es/projects/8-puzzle/");
  });

  it("hydrates the Portuguese page at /pt/, and the URL wins over a saved language", () => {
    window.history.replaceState(null, "", "/pt/");
    localStorage.setItem("portfolio_lang", "en");

    const { container, recoverable, mismatches } = hydrate(render("/pt/"));
    expect(recoverable).not.toHaveBeenCalled();
    expect(mismatches).toEqual([]);
    expect(container.textContent).toContain("Sobre Mim");
    expect(window.location.pathname).toBe("/pt/");
    expect(document.documentElement.lang).toBe("pt-BR");
  });
});
