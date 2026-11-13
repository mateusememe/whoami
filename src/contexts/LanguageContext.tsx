import React, { createContext, useEffect, useState } from "react";
import { translations, type Language } from "@/i18n/translations";
import { useLanguage } from "@/hooks/useLanguage";

export type { Language };
export { translations, useLanguage };

/** Values for `{placeholder}` tokens in a translation string, e.g. `{ name: "codecash" }`. */
export type TranslationParams = Record<string, string | number>;

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
  /**
   * Language named by the URL (`/pt/`, `/es/`). It is used for the first
   * render, which must match the prerendered page, and it wins over the
   * visitor's saved choice.
   */
  routeLanguage?: Language;
}

const STORAGE_KEY = "portfolio_lang";

function getInitialLanguage(defaultLanguage: Language): Language {
  if (typeof window === "undefined") return defaultLanguage;

  const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved && (saved === "pt" || saved === "en" || saved === "es")) {
    return saved;
  }

  return defaultLanguage;
}

function interpolate(template: string, params: TranslationParams): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    params[name] !== undefined ? String(params[name]) : match
  );
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = "en",
  routeLanguage,
}) => {
  // First render uses the URL's language or the default, so it matches the
  // prerendered HTML. Without a language in the URL, the saved choice is
  // applied right after mount.
  const [language, setLanguageState] = useState<Language>(routeLanguage ?? defaultLanguage);

  useEffect(() => {
    if (routeLanguage) return;
    const saved = getInitialLanguage(defaultLanguage);
    if (saved !== defaultLanguage) setLanguageState(saved);
  }, [defaultLanguage, routeLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : language;
  }, [language]);

  const t = (key: string, params?: TranslationParams): string => {
    const template = translations[key]?.[language] ?? key;
    return params ? interpolate(template, params) : template;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
