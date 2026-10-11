import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useLanguage } from "@/hooks/useLanguage";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider defaultLanguage="en">{children}</LanguageProvider>
);

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
  });

  it("provides default English translations", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe("en");
    expect(result.current.t("nav.about")).toBe("About");
    expect(result.current.t("hero.title")).toBe("Backend Software Engineer");
    expect(document.documentElement.lang).toBe("en");
  });

  it("switches to Portuguese and persists in localStorage", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage("pt");
    });

    expect(result.current.language).toBe("pt");
    expect(result.current.t("nav.about")).toBe("Sobre");
    expect(localStorage.getItem("portfolio_lang")).toBe("pt");
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  it("switches to Spanish and persists in localStorage", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage("es");
    });

    expect(result.current.language).toBe("es");
    expect(result.current.t("nav.contact")).toBe("Contacto");
    expect(localStorage.getItem("portfolio_lang")).toBe("es");
    expect(document.documentElement.lang).toBe("es");
  });

  it("fills {placeholder} tokens from params", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.t("a11y.goToProject", { n: 2, name: "codecash" })).toBe("Go to project 2: codecash");

    act(() => {
      result.current.setLanguage("pt");
    });

    expect(result.current.t("a11y.switchLanguage", { lang: "English" })).toBe("Mudar para English");
  });

  it("leaves tokens without a matching param untouched", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.t("a11y.viewRepo", {})).toBe("View {name} repository on GitHub");
    expect(result.current.t("a11y.viewRepo")).toBe("View {name} repository on GitHub");
  });

  it("returns fallback key if translation is missing", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.t("non.existent.key")).toBe("non.existent.key");
  });
});
