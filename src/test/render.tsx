import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { Language } from "@/i18n/translations";

/** Renders inside the providers every page component expects: a router and the language context. */
export function renderWithProviders(ui: ReactNode, language: Language = "pt", path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider defaultLanguage={language}>{ui}</LanguageProvider>
    </MemoryRouter>,
  );
}
