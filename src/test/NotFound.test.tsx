import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { LanguageProvider } from "@/contexts/LanguageContext";

describe("NotFound Page", () => {
  it("renders 404 header and return link in Portuguese", () => {
    render(
      <MemoryRouter>
        <LanguageProvider defaultLanguage="pt">
          <NotFound />
        </LanguageProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Página não encontrada")).toBeInTheDocument();
    expect(screen.getByText("Voltar para o início")).toBeInTheDocument();
  });
});
