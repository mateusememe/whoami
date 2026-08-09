import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useLanguage } from "@/hooks/useLanguage";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider defaultLanguage="pt">{children}</LanguageProvider>
);

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "pt-BR";
  });

  it("provides default Portuguese translations", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe("pt");
    expect(result.current.t("nav.about")).toBe("Sobre");
    expect(result.current.t("hero.title")).toBe("Backend Software Engineer");
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  it("switches to English and persists in localStorage", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage("en");
    });

    expect(result.current.language).toBe("en");
    expect(result.current.t("nav.about")).toBe("About");
    expect(localStorage.getItem("portfolio_lang")).toBe("en");
    expect(document.documentElement.lang).toBe("en");
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

  it("returns fallback key if translation is missing", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.t("non.existent.key")).toBe("non.existent.key");
  });
});
