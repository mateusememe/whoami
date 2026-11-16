import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import CommandPalette from "@/components/CommandPalette";
import ProjectPage from "@/pages/ProjectPage";
import { projects } from "@/data/portfolio";
import { projectPages } from "@/data/projectPages";
import { PROJECT_PAGE_IDS } from "@/i18n/routes";
import { filterCommands } from "@/lib/commands";
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

describe("Command palette", () => {
  afterEach(() => vi.restoreAllMocks());

  it("filters without accents and ranks label prefixes first", () => {
    const items = [{ label: "Experiência" }, { label: "Educação" }, { label: "Projetos", keywords: "educacao" }];
    expect(filterCommands(items, "educacao").map((item) => item.label)).toEqual(["Educação", "Projetos"]);
    expect(filterCommands(items, "")).toHaveLength(3);
    expect(filterCommands(items, "zzz")).toEqual([]);
  });

  it("opens with Ctrl+K, runs the active command with Enter and closes with Escape", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderWithProviders(<CommandPalette />, "en");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    // The panel is a lazy chunk: it appears once loaded.
    const dialog = await screen.findByRole("dialog", { name: "Command palette" });
    const input = within(dialog).getByRole("combobox");
    // Focus moves in an effect after the panel mounts.
    await waitFor(() => expect(document.activeElement).toBe(input));

    fireEvent.change(input, { target: { value: "copy email" } });
    const options = within(dialog).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);

    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter" });
    });
    expect(writeText).toHaveBeenCalledWith("matt.mendon@gmail.com");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Email copied");

    fireEvent.keyDown(window, { key: "/" });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("lists sections, project pages, actions and links, with arrow-key navigation", async () => {
    renderWithProviders(<CommandPalette />, "pt");
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    const dialog = await screen.findByRole("dialog", { name: "Paleta de comandos" });
    for (const group of ["Seções", "Projetos", "Ações", "Links"]) {
      expect(within(dialog).getByRole("group", { name: group })).toBeInTheDocument();
    }
    const input = within(dialog).getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const options = within(dialog).getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options.at(-1)).toHaveAttribute("aria-selected", "true");
  });
});
