import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";

// The site has no published note yet; these tests run the notes machinery
// on a fixture: one published note and one draft.
vi.mock("@/content/notes", () => {
  const notes = [
    {
      slug: "vector-search-in-c",
      date: "2026-11-01",
      updated: "2026-11-10",
      title: { pt: "Busca vetorial em C", en: "Vector search in C", es: "Búsqueda vectorial en C" },
      summary: { pt: "Resumo em português.", en: "Summary in English.", es: "Resumen en español." },
      tags: ["C", "SIMD"],
    },
    {
      slug: "unfinished",
      date: "2026-11-15",
      draft: true,
      title: { pt: "Rascunho", en: "Draft", es: "Borrador" },
      summary: { pt: "R.", en: "D.", es: "B." },
      tags: [],
    },
  ];
  return { notes, publishedNotes: notes.filter((note) => !note.draft) };
});

vi.mock("@/content/notes/bodies", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/notes/bodies")>();
  return {
    ...actual,
    noteMarkdown: (slug: string, language: string) =>
      slug === "vector-search-in-c" ? `## Buckets (${language})\n\nKNN with \`int16_t\` vectors.\n\n- one\n- two\n` : undefined,
  };
});

const { HAS_NOTES, PAGES, parseRoute, pagePath } = await import("@/i18n/routes");
const { default: NotePage } = await import("@/pages/NotePage");
const { default: NotesPage } = await import("@/pages/NotesPage");
const { renderAtomFeed, FEED_FILES } = await import("@/seo/feed");
const { buildJsonLd } = await import("@/seo/jsonld");
const { renderHead } = await import("@/seo/head");
const { publishedNotes } = await import("@/content/notes");
const { renderWithProviders } = await import("@/test/render");

const SITE = "https://example.test/whoami";

describe("notes, with a published note", () => {
  it("route the list and the published note, never the draft", () => {
    expect(HAS_NOTES).toBe(true);
    expect(PAGES).toContainEqual({ kind: "notes" });
    expect(PAGES).toContainEqual({ kind: "note", id: "vector-search-in-c" });
    expect(parseRoute("/pt/notes/vector-search-in-c/").page).toEqual({ kind: "note", id: "vector-search-in-c" });
    expect(parseRoute("/notes/unfinished/").page).toBeNull();
    expect(pagePath("es", { kind: "notes" })).toBe("/es/notes/");
  });

  it("render the note body from Markdown in the page language", () => {
    renderWithProviders(
      <Routes>
        <Route path="/pt/notes/:id" element={<NotePage />} />
      </Routes>,
      "pt",
      "/pt/notes/vector-search-in-c/",
    );
    expect(screen.getByRole("heading", { level: 1, name: "Busca vetorial em C" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Buckets (pt)" })).toBeInTheDocument();
    expect(screen.getByText("int16_t").tagName).toBe("CODE");
    expect(screen.getByText(/atualizado em 10 Nov 2026/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Todas as notas/ })).toHaveAttribute("href", "/pt/notes/");
  });

  it("list the published notes with their date and summary", () => {
    renderWithProviders(<NotesPage />, "en", "/notes/");
    expect(screen.getByRole("link", { name: "Vector search in C" })).toHaveAttribute("href", "/notes/vector-search-in-c/");
    expect(screen.getByText("Summary in English.")).toBeInTheDocument();
    expect(screen.queryByText("Draft")).not.toBeInTheDocument();
  });

  it("publish an Atom feed per language and link it from the head", () => {
    const feed = renderAtomFeed("es", SITE, publishedNotes);
    expect(feed).toContain('<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="es">');
    expect(feed.match(/<entry>/g)).toHaveLength(1);
    expect(feed).toContain(`<id>${SITE}/es/notes/vector-search-in-c/</id>`);
    expect(feed).toContain("<updated>2026-11-10T00:00:00Z</updated>");
    expect(renderHead("es", SITE)).toContain(`type="application/atom+xml" href="${SITE}/${FEED_FILES.es}"`);
  });

  it("describe the note as a BlogPosting in a Blog", () => {
    const graph = buildJsonLd("en", SITE, { kind: "note", id: "vector-search-in-c" })["@graph"] as Array<Record<string, unknown>>;
    const posting = graph.find((node) => node["@type"] === "BlogPosting")!;
    expect(posting.headline).toBe("Vector search in C");
    expect(posting.datePublished).toBe("2026-11-01");
    expect(posting.dateModified).toBe("2026-11-10");
    expect(graph.find((node) => node["@type"] === "Blog")).toBeDefined();
  });
});
