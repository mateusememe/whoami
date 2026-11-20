import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import CommandPalette from "@/components/CommandPalette";
import TalksSection from "@/components/sections/TalksSection";
import ProjectPage from "@/pages/ProjectPage";
import TalkPage from "@/pages/TalkPage";
import NowPage from "@/pages/NowPage";
import UsesPage from "@/pages/UsesPage";
import { contributions, experiences, projects, publications, talkUrl, talks, testimonials } from "@/data/portfolio";
import EducationSection from "@/components/sections/EducationSection";
import { Testimonials } from "@/components/Testimonials";
import { projectPages } from "@/data/projectPages";
import { talkPages } from "@/data/talkPages";
import { uses } from "@/data/uses";
import { MSC_PROJECT_ID } from "@/data/now";
import { PROJECT_PAGE_IDS, TALK_PAGE_IDS } from "@/i18n/routes";
import { buildJsonLd } from "@/seo/jsonld";
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

  it("puts play, step, restart, speed and timeline controls under the cover", () => {
    renderProject("8-puzzle");
    const pause = screen.getByRole("button", { name: "Pause the animation" });
    fireEvent.click(pause);
    expect(screen.getByRole("button", { name: "Play the animation" })).toHaveAttribute("aria-pressed", "true");
    for (const name of ["Back 0.5 s", "Forward 0.5 s", "Restart"]) expect(screen.getByRole("button", { name })).toBeInTheDocument();
    const speed = screen.getByRole("button", { name: /Speed/ });
    fireEvent.click(speed);
    expect(speed).toHaveTextContent("2×");
    expect(screen.getByRole("slider", { name: "Animation timeline" })).toHaveAttribute("max", "30");
  });

  it("links the neighbouring projects in the page language", () => {
    renderProject(PROJECT_PAGE_IDS[0], "pt");
    const nav = screen.getByRole("navigation", { name: "Outros projetos" });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([`/pt/projects/${PROJECT_PAGE_IDS.at(-1)}/`, `/pt/projects/${PROJECT_PAGE_IDS[1]}/`]);
  });

  it("marks a private project and points a workshop project at its talk", () => {
    renderProject("lime-stability");
    expect(screen.getByText("Private repository")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Repository/ })).not.toBeInTheDocument();

    renderProject("megabrain-context-protocol");
    expect(screen.getByText("Presented at")).toBeInTheDocument();
    expect(screen.getByText("MCP: MegaBrain Context Protocol")).toBeInTheDocument();
  });

  it("links the thesis page to its publication", () => {
    renderProject("find-the-fight");
    expect(screen.getByText("Published in")).toBeInTheDocument();
    expect(screen.getByText(publications[0].title).closest("a")).toHaveAttribute("href", publications[0].url);
  });

  it("renders the 404 content for an id without a page", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderProject("kruskal-algorithm");
    expect(screen.getByText("404")).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});

const renderTalk = (id: string, language: "en" | "pt" | "es" = "en") =>
  renderWithProviders(
    <Routes>
      <Route path="/talks/:id" element={<TalkPage />} />
      <Route path="/:lang/talks/:id" element={<TalkPage />} />
    </Routes>,
    language,
    language === "en" ? `/talks/${id}/` : `/${language}/talks/${id}/`,
  );

describe("Talk page", () => {
  it("shows the talk with its facts, topics, prerequisites and material", () => {
    const talk = talks.find((item) => item.id === "react-infoeste-2022")!;
    renderTalk(talk.id, "pt");
    expect(screen.getByRole("heading", { level: 1, name: talk.title })).toHaveAttribute("lang", "pt-BR");
    expect(screen.getByText("27 Out 2022")).toBeInTheDocument();
    expect(screen.getByText("8 horas")).toBeInTheDocument();
    expect(screen.getByText(talk.coSpeakers!.join(", "))).toBeInTheDocument();
    for (const topic of talkPages[talk.id].topics.pt) expect(screen.getByText(topic)).toBeInTheDocument();
    expect(screen.getByText(talkPages[talk.id].prerequisites!.pt)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Página do evento/ })).toHaveAttribute("href", talk.links.event);
  });

  it("links the code, the slides and the project page, and marks an English title", () => {
    const talk = talks.find((item) => item.id === "mcp-devfest-2026")!;
    renderTalk(talk.id);
    expect(screen.getByRole("heading", { level: 1, name: talk.title })).toHaveAttribute("lang", "en");
    expect(screen.getByRole("link", { name: /Code/ })).toHaveAttribute("href", talk.links.repo);
    expect(screen.getByRole("link", { name: /Slides/ })).toHaveAttribute("href", talk.links.slides);
    expect(screen.getByRole("link", { name: /megabrain-context-protocol/ })).toHaveAttribute(
      "href",
      "/projects/megabrain-context-protocol/",
    );
  });

  it("links the neighbouring talks and renders 404 content for an unknown id", () => {
    renderTalk(TALK_PAGE_IDS[0], "es");
    const hrefs = within(screen.getByRole("navigation", { name: "Otras charlas" }))
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([`/es/talks/${TALK_PAGE_IDS.at(-1)}/`, `/es/talks/${TALK_PAGE_IDS[1]}/`]);
  });

  it("has content for every talk, with 2 or 4 topics in each language", () => {
    expect(Object.keys(talkPages).sort()).toEqual([...TALK_PAGE_IDS].sort());
    for (const content of Object.values(talkPages)) {
      for (const language of ["pt", "en", "es"] as const) {
        expect([2, 4]).toContain(content.topics[language].length);
        expect(content.topics[language].length).toBe(content.topics.en.length);
      }
    }
  });

  it("describes the talk as an event in JSON-LD, with its length and material", () => {
    // JSON-LD read back as untyped JSON.
    type Node = Record<string, unknown> & { "@id"?: string; mainEntity?: { "@id": string }; itemListElement?: unknown[] };
    const graph = buildJsonLd("en", "https://example.test/whoami", { kind: "talk", id: "node-infoeste-2022" })["@graph"] as Node[];
    const event = graph.find((node) => node["@type"] === "EducationEvent")!;
    expect(event.url).toBe("https://example.test/whoami/talks/node-infoeste-2022/");
    expect(event.duration).toBe("PT8H");
    expect(event.sameAs).toBe(talks.find((item) => item.id === "node-infoeste-2022")!.links.event);
    const page = graph.find((node) => node["@type"] === "WebPage")!;
    expect(page.mainEntity?.["@id"]).toBe(event["@id"]);
    expect(graph.find((node) => node["@type"] === "BreadcrumbList")!.itemListElement).toHaveLength(3);
  });
});

describe("Now page", () => {
  it("is built from the data: role, degree and research, newest projects, latest talk and contribution", () => {
    renderWithProviders(<NowPage />, "en", "/now/");
    expect(screen.getByRole("heading", { level: 1, name: "Now" })).toBeInTheDocument();
    const role = experiences.find((item) => item.period.en.endsWith("Present"))!;
    expect(screen.getByRole("heading", { level: 2, name: `${role.role.en} · ${role.company}` })).toBeInTheDocument();
    expect(screen.getByText(`since ${role.period.en.split(" – ")[0]}`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: projects.find((p) => p.id === MSC_PROJECT_ID)!.name })).toHaveAttribute(
      "href",
      `/projects/${MSC_PROJECT_ID}/`,
    );
    expect(screen.getByRole("link", { name: talks[0].title })).toHaveAttribute("href", `/talks/${talks[0].id}/`);
    const latest = [...contributions].sort((a, b) => b.merged.localeCompare(a.merged))[0];
    expect(screen.getByRole("link", { name: latest.repo })).toHaveAttribute("href", latest.url);
  });
});

describe("Uses page", () => {
  it("lists every tool by group, in the page language", () => {
    renderWithProviders(<UsesPage />, "es", "/es/uses/");
    expect(screen.getByRole("heading", { level: 1, name: "Herramientas" })).toBeInTheDocument();
    for (const group of uses) {
      expect(screen.getByRole("heading", { level: 2, name: group.title.es })).toBeInTheDocument();
      for (const item of group.items) expect(screen.getByText(item.note.es)).toBeInTheDocument();
    }
  });
});

describe("Talks", () => {
  it("lists every talk with its event, date and open material", () => {
    renderWithProviders(<TalksSection />, "en");
    expect(screen.getByRole("heading", { level: 2, name: /Talks & workshops/ })).toBeInTheDocument();
    for (const talk of talks) {
      expect(within(screen.getByRole("heading", { level: 3, name: talk.title })).getByRole("link")).toHaveAttribute(
        "href",
        `/talks/${talk.id}/`,
      );
      const links = screen.getByRole("list", { name: `Material for ${talk.title}` });
      if (talk.links.repo) expect(within(links).getByRole("link", { name: /Code/ })).toHaveAttribute("href", talk.links.repo);
      if (talk.links.slides) expect(within(links).getByRole("link", { name: /Slides/ })).toHaveAttribute("href", talk.links.slides);
      if (talk.links.event) expect(within(links).getByRole("link", { name: /Event page/ })).toHaveAttribute("href", talk.links.event);
    }
    expect(screen.getByRole("heading", { level: 3, name: "O Incrível mundo mágico da web" })).toBeInTheDocument();
    expect(screen.getByText(`${talks.length} workshops from 2022 to 2026, with the material open where it exists.`)).toBeInTheDocument();
    // The online workshop shows "Online" where the others show the city.
    expect(screen.getByText(/Unoeste · Online/)).toBeInTheDocument();
    expect(screen.getByText(/with Leonardo Aniceto das Neves/)).toBeInTheDocument();
    // Month when it is on record, the year alone when it is not.
    expect(screen.getAllByText("Oct").length).toBeGreaterThan(0);
    expect(screen.getByText("2023")).toBeInTheDocument();
  });
});

describe("Publications", () => {
  it("lists each publication in Education with its reference and project", () => {
    renderWithProviders(<EducationSection />, "pt");
    const item = publications[0];
    expect(screen.getByRole("heading", { level: 3, name: "Publicações" })).toBeInTheDocument();
    expect(screen.getByText(item.title)).toBeInTheDocument();
    // ABNT reference with the proceedings address and the access date.
    const reference = screen.getByText(/In: ENEPE/);
    expect(reference).toHaveTextContent(`${item.authors.join("; ")} ${item.title}`);
    expect(reference).toHaveTextContent(`Anais [...]: ${item.section}`);
    expect(reference).toHaveTextContent(`p. ${item.pages}. Disponível em: unoeste.br/…/Computação.pdf. Acesso em: 16 nov. 2026.`);
    expect(screen.getByRole("link", { name: "unoeste.br/…/Computação.pdf" })).toHaveAttribute("href", item.url);
    expect(screen.getByRole("link", { name: /Anais \(PDF\)/ })).toHaveAttribute("href", item.url);
    expect(screen.getByRole("link", { name: /Projeto/ })).toHaveAttribute("href", `/pt/projects/${item.projectId}/`);
  });
});

describe("Publication registries", () => {
  it("link the work in ORCID or Scholar when it is there, and publish it as sameAs", () => {
    // None is registered yet; try one on a copy of the data and put it back.
    expect(publications[0].sameAs).toBeUndefined();
    const entry = { label: "ORCID", url: "https://orcid.org/0009-0009-6468-8493/work/1" };
    publications[0].sameAs = [entry];
    try {
      renderWithProviders(<EducationSection />, "en");
      expect(screen.getByRole("link", { name: /ORCID/ })).toHaveAttribute("href", entry.url);
      const graph = JSON.stringify(buildJsonLd("en", "https://example.test/whoami"));
      expect(graph).toContain(`"sameAs":["${entry.url}"]`);
    } finally {
      delete publications[0].sameAs;
    }
  });
});

describe("Talk data", () => {
  it("lists talks newest first, each with at least one link", () => {
    const dates = talks.map((talk) => talk.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    for (const talk of talks) {
      expect(talk.date).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/);
      expect(talkUrl(talk), talk.id).toMatch(/^https:\/\//);
    }
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

  it("lists sections, project pages, talks, actions and links, with arrow-key navigation", async () => {
    renderWithProviders(<CommandPalette />, "pt");
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    const dialog = await screen.findByRole("dialog", { name: "Paleta de comandos" });
    for (const group of ["Seções", "Projetos", "Palestras", "Ações", "Links"]) {
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

describe("Testimonials", () => {
  const fixture = [
    {
      id: "manager",
      name: "Ana Souza",
      role: { pt: "Gerente de Engenharia", en: "Engineering Manager", es: "Gerente de Ingeniería" },
      company: "LuizaLabs",
      relation: { pt: "Gerenciou Mateus", en: "Managed Mateus", es: "Gestionó a Mateus" },
      quote: "Entrega com cuidado e explica as decisões.",
      quoteLanguage: "pt" as const,
      translations: { en: "Delivers with care and explains the decisions." },
      url: "https://www.linkedin.com/in/example/details/recommendations/",
      date: "2026-03",
    },
  ];

  it("render nothing while the list is empty, which is the case today", () => {
    const { container } = renderWithProviders(<Testimonials items={[]} />, "en");
    expect(container).toBeEmptyDOMElement();
    expect(testimonials).toEqual([]);
  });

  it("show a translation marked as such, with its language, and the source", () => {
    renderWithProviders(<Testimonials items={fixture} />, "en");
    const quote = screen.getByText(/Delivers with care/);
    expect(quote).toHaveAttribute("lang", "en");
    expect(screen.getByText("Translated")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View on LinkedIn/ })).toHaveAttribute("href", fixture[0].url);
  });

  it("fall back to the original words and language when there is no translation", () => {
    renderWithProviders(<Testimonials items={fixture} />, "es");
    expect(screen.getByText(/Entrega com cuidado/)).toHaveAttribute("lang", "pt-BR");
    expect(screen.queryByText("Traducción")).not.toBeInTheDocument();
  });
});
