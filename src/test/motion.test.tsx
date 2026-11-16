import { renderWithProviders } from "@/test/render";
import { NAV_ITEMS } from "@/data/navigation";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { Reveal } from "@/components/ds";
import Header from "@/components/Header";
import { Counter } from "@/components/motion/Counter";
import { Marquee } from "@/components/motion/Marquee";
import { ScrubText } from "@/components/motion/ScrubText";
import ContactFooter from "@/components/sections/ContactFooter";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { contributions, portfolioStats, projects, techGroups, techStack } from "@/data/portfolio";
import { measureProgress } from "@/motion/progress";
import { computeMorph } from "@/motion/sceneState";

const withLanguage = (ui: React.ReactNode, language: "pt" | "en" | "es" = "pt") =>
  renderWithProviders(ui, language);

describe("scroll progress", () => {
  const viewport = 800;

  it("view: 0 as the element enters at the bottom, 1 as it leaves at the top", () => {
    expect(measureProgress("view", 800, 400, viewport)).toBe(0);
    expect(measureProgress("view", 200, 400, viewport)).toBe(0.5);
    expect(measureProgress("view", -400, 400, viewport)).toBe(1);
  });

  it("contain: runs while a tall element is pinned across the viewport", () => {
    expect(measureProgress("contain", 100, 2400, viewport)).toBe(0);
    expect(measureProgress("contain", -800, 2400, viewport)).toBe(0.5);
    expect(measureProgress("contain", -1600, 2400, viewport)).toBe(1);
    expect(measureProgress("contain", -5000, 2400, viewport)).toBe(1);
  });

  it("exit: 0 at the top of the page, 1 once scrolled past", () => {
    expect(measureProgress("exit", 0, 900, viewport)).toBe(0);
    expect(measureProgress("exit", -450, 900, viewport)).toBe(0.5);
    expect(measureProgress("exit", -900, 900, viewport)).toBe(1);
  });
});

describe("scene director", () => {
  // hero, about, experience, education, skills (same formation), projects, contact
  const sections = [0, 1000, 3000, 5000, 6000, 8000, 11000].map((top, i) => ({
    top,
    formation: [0, 1, 2, 3, 3, 4, 5][i],
  }));
  const viewport = 1000;

  it("holds a formation while its section fills the screen", () => {
    expect(computeMorph(sections, 0, viewport)).toBe(0);
    expect(computeMorph(sections, 1600, viewport)).toBe(1);
    expect(computeMorph(sections, 9000, viewport)).toBe(4);
    expect(computeMorph(sections, 12000, viewport)).toBe(5);
  });

  it("blends while the next section's top crosses the viewport", () => {
    const mid = computeMorph(sections, 500, viewport);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });

  it("does not move between two sections that share a formation", () => {
    expect(computeMorph(sections, 5400, viewport)).toBe(3);
    expect(computeMorph(sections, 5600, viewport)).toBe(3);
  });

  it("never decreases on the way down", () => {
    let previous = 0;
    for (let y = 0; y <= 12000; y += 50) {
      const value = computeMorph(sections, y, viewport);
      expect(value).toBeGreaterThanOrEqual(previous - 1e-9);
      previous = value;
    }
  });
});

describe("motion components without IntersectionObserver (static HTML, jsdom)", () => {
  it("Reveal leaves content visible", () => {
    render(<Reveal variant="mask">Hello</Reveal>);
    const element = screen.getByText("Hello");
    expect(element).toHaveClass("reveal", "reveal-mask");
    expect(element).not.toHaveAttribute("data-visible");
  });

  it("Marquee renders its content once", () => {
    render(
      <Marquee>
        <span>Distributed Systems</span>
      </Marquee>,
    );
    expect(screen.getAllByText("Distributed Systems")).toHaveLength(1);
  });

  it("Counter shows the final value", () => {
    render(<Counter value={34} />);
    expect(screen.getByText("34")).toBeInTheDocument();
  });

  it("ScrubText keeps the sentence intact and indexes each word", () => {
    const { container } = render(<ScrubText text="I build backend services" />);
    const paragraph = container.querySelector("p") as HTMLElement;
    expect(paragraph.textContent).toBe("I build backend services");
    const words = paragraph.querySelectorAll<HTMLElement>(".scrub-word");
    expect(words).toHaveLength(4);
    expect(words[2].style.getPropertyValue("--i")).toBe("2");
    expect(paragraph.style.getPropertyValue("--n")).toBe("4");
  });
});

describe("Hero", () => {
  it("exposes the name once to assistive tech and splits it for display", () => {
    withLanguage(<HeroSection />, "en");
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAccessibleName("Mateus Mendonça Monteiro");
    expect(heading.querySelectorAll(".hero-line")).toHaveLength(3);
    expect(heading.querySelectorAll(".hero-char")).toHaveLength("MateusMendonçaMonteiro".length);
    expect(heading.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("splits the subtitle into separate facts", () => {
    withLanguage(<HeroSection />, "en");
    expect(screen.getByText("MSc Researcher @UNESP")).toBeInTheDocument();
    expect(screen.getByText("@Itaú Unibanco")).toBeInTheDocument();
  });
});

describe("Header mobile menu", () => {
  it("opens as a dialog with the section links and closes on Escape", () => {
    vi.useFakeTimers();
    withLanguage(<Header />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Abrir menu"));

    const dialog = screen.getByRole("dialog", { name: "Navegação principal" });
    expect(dialog.querySelectorAll("a[href^='#']")).toHaveLength(NAV_ITEMS.length);
    expect(screen.getByLabelText("Fechar menu")).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(window, { key: "Escape" });
    act(() => vi.advanceTimersByTime(400));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe("Projects", () => {
  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);

  it("shows the derived project and star counts", () => {
    withLanguage(<ProjectsSection />, "en");
    expect(
      screen.getByText(
        `${portfolioStats.repos} projects and ${portfolioStats.stars} GitHub stars. Each cover in the gallery runs the project's algorithm.`,
      ),
    ).toBeInTheDocument();
  });

  it("puts featured projects in the gallery and lists the rest as rows", () => {
    withLanguage(<ProjectsSection />, "en");
    expect(screen.getAllByRole("article")).toHaveLength(featured.length);
    expect(screen.getAllByRole("tab")).toHaveLength(featured.length);
    // Each card opens its own page; its GitHub icon links the repository.
    for (const project of featured) {
      expect(screen.getByRole("link", { name: `Open the ${project.name} page` })).toHaveAttribute(
        "href",
        `/projects/${project.id}/`,
      );
    }
    // Rows are named by their visible text (WCAG 2.5.3), which starts with the project name.
    for (const project of others) {
      const row = screen.getByRole("link", { name: new RegExp(`^${project.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) });
      expect(row).toHaveAttribute("href", project.githubUrl);
    }
  });

  it("marks a private project instead of linking to it", () => {
    withLanguage(<ProjectsSection />, "en");
    const privateProjects = projects.filter((project) => !project.githubUrl);
    expect(privateProjects.length).toBeGreaterThan(0);
    expect(screen.getAllByText("Private repository")).toHaveLength(privateProjects.length);
    for (const project of privateProjects) {
      expect(screen.queryByRole("link", { name: `View ${project.name} repository on GitHub` })).not.toBeInTheDocument();
    }
  });

  it("lists merged contributions with a localized date", () => {
    withLanguage(<ProjectsSection />, "pt");
    expect(screen.getByText("Contribuições open source")).toBeInTheDocument();
    for (const item of contributions) expect(screen.getByText(item.repo)).toBeInTheDocument();
    expect(screen.getByText("Aceito em Out 2026")).toBeInTheDocument();
  });
});

describe("Contact", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("copies the email and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    withLanguage(<ContactFooter />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copiar e-mail" }));
    });

    expect(writeText).toHaveBeenCalledWith("matt.mendon@gmail.com");
    expect(screen.getByText("Copiado")).toBeInTheDocument();
  });

  it("lists every channel except email as a row", () => {
    withLanguage(<ContactFooter />);
    const list = screen.getByRole("list", { name: "Contatos e Redes" });
    expect(list.querySelectorAll("a")).toHaveLength(7);
    expect(screen.getByRole("link", { name: "matt.mendon@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:matt.mendon@gmail.com",
    );
  });
});

describe("portfolio data", () => {
  it("derives the flat stack from the groups without duplicates", () => {
    expect(techStack).toEqual(techGroups.flatMap((group) => group.items));
    expect(new Set(techStack).size).toBe(techStack.length);
  });

  it("derives headline numbers from the lists", () => {
    expect(portfolioStats.stars).toBe(projects.reduce((sum, project) => sum + (project.stars ?? 0), 0));
    expect(portfolioStats.firstYear).toBeLessThan(portfolioStats.lastYear);
    expect(portfolioStats.companies).toBeLessThanOrEqual(portfolioStats.roles);
  });
});
