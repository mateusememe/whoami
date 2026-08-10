import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactFooter from "@/components/sections/ContactFooter";
import ProfileCarousel from "@/components/ProfileCarousel";

describe("Portfolio Sections", () => {
  it("renders HeroSection with name, title, and profile carousel", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <HeroSection />
      </LanguageProvider>
    );

    expect(screen.getByText("Mateus Mendonça Monteiro")).toBeInTheDocument();
    expect(screen.getByText("Backend Software Engineer")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /carrossel de fotos/i })).toBeInTheDocument();
  });

  it("renders ProfileCarousel and cycles through photos with buttons", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <ProfileCarousel />
      </LanguageProvider>
    );

    expect(screen.getByText("Perfil")).toBeInTheDocument();

    const nextBtn = screen.getByLabelText("Próxima foto");
    fireEvent.click(nextBtn);

    expect(screen.getByText("Instrutor & Palestras")).toBeInTheDocument();
  });

  it("renders AboutSection", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <AboutSection />
      </LanguageProvider>
    );

    expect(screen.getByText("Sobre Mim")).toBeInTheDocument();
  });

  it("renders ExperienceSection with company names", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <ExperienceSection />
      </LanguageProvider>
    );

    expect(screen.getByText("Itaú Unibanco")).toBeInTheDocument();
    expect(screen.getByText("LuizaLabs")).toBeInTheDocument();
    expect(screen.getByText("ANBIMA")).toBeInTheDocument();
  });

  it("renders EducationSection with institutions", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <EducationSection />
      </LanguageProvider>
    );

    expect(screen.getByText("UNESP")).toBeInTheDocument();
    expect(screen.getByText("Universidade do Oeste Paulista")).toBeInTheDocument();
  });

  it("renders SkillsSection with top skills and tech stack", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <SkillsSection />
      </LanguageProvider>
    );

    expect(screen.getByText("Conquistas & Skills")).toBeInTheDocument();
    expect(screen.getByText("Data Mesh")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
  });

  it("renders ProjectsSection with the 3 main projects", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <ProjectsSection />
      </LanguageProvider>
    );

    expect(screen.getByText("Projetos")).toBeInTheDocument();
    expect(screen.getByText("transaction.ledger")).toBeInTheDocument();
    expect(screen.getByText("codecash")).toBeInTheDocument();
    expect(screen.getByText("text.search.engine")).toBeInTheDocument();
    expect(screen.getByText("Ver no GitHub")).toBeInTheDocument();
  });

  it("renders ContactFooter with contact options and copyright", () => {
    render(
      <LanguageProvider defaultLanguage="pt">
        <ContactFooter />
      </LanguageProvider>
    );

    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(screen.getByText("matt.mendon@gmail.com")).toBeInTheDocument();
  });
});
