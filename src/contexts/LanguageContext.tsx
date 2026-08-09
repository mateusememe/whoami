import React, { createContext, useEffect, useState } from "react";
import { translations, type Language } from "@/i18n/translations";
import { useLanguage } from "@/hooks/useLanguage";

export type { Language };
export { translations, useLanguage };

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
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

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = "pt",
}) => {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage(defaultLanguage));

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

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
