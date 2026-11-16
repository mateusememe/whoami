import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import ProjectPage from "@/pages/ProjectPage";
import { projects } from "@/data/portfolio";
import { projectPages } from "@/data/projectPages";
import { PROJECT_PAGE_IDS } from "@/i18n/routes";
import { renderWithProviders } from "@/test/render";

const renderProject = (id: string, language: "en" | "pt" = "en") =>
  renderWithProviders(
    <Routes>
      <Route path="/projects/:id" element={<ProjectPage />} />
      <Route path="/pt/projects/:id" element={<ProjectPage />} />
    </Routes>,
    language,
    language === "pt" ? `/pt/projects/${id}/` : `/projects/${id}/`,
  );

describe("Project page", () => {
  it("shows the project with its facts, details, stack and repository", () => {
    const project = projects.find((item) => item.id === "rinha-backend-2026-c")!;
    renderProject(project.id);

    expect(screen.getByRole("heading", { level: 1, name: project.name })).toBeInTheDocument();
    expect(screen.getByText(String(project.year))).toBeInTheDocument();
    for (const line of projectPages[project.id].highlights.en) expect(screen.getByText(line.replace(/`/g, ""))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Repository/ })).toHaveAttribute("href", project.githubUrl);
    expect(screen.getByRole("navigation", { name: "You are here" })).toHaveTextContent(project.id);
  });

  it("links the neighbouring projects in the page language", () => {
    renderProject(PROJECT_PAGE_IDS[0], "pt");
    const nav = screen.getByRole("navigation", { name: "Outros projetos" });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([`/pt/projects/${PROJECT_PAGE_IDS.at(-1)}/`, `/pt/projects/${PROJECT_PAGE_IDS[1]}/`]);
  });

  it("marks a private project", () => {
    renderProject("lime-stability");
    expect(screen.getByText("Private repository")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Repository/ })).not.toBeInTheDocument();
  });

  it("renders the 404 content for an id without a page", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderProject("kruskal-algorithm");
    expect(screen.getByText("404")).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
