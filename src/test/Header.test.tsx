import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import Header from "@/components/Header";
import { LanguageProvider } from "@/contexts/LanguageContext";

describe("Header component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders brand logo and navigation links in Portuguese", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <Header />
      </LanguageProvider>
    );

    expect(screen.getByText("MM")).toBeInTheDocument();
    expect(screen.getByText("Sobre")).toBeInTheDocument();
    expect(screen.getByText("Experiência")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Contato")).toBeInTheDocument();
  });

  it("switches language when clicking flag buttons", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <Header />
      </LanguageProvider>
    );

    const usFlagBtn = screen.getByLabelText("Mudar para English");
    fireEvent.click(usFlagBtn);

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("toggles theme when clicking theme button", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <Header />
      </LanguageProvider>
    );

    // Initial state is dark
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const themeBtn = screen.getByLabelText("Ativar modo claro");
    fireEvent.click(themeBtn);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("portfolio_theme")).toBe("light");
  });
});
