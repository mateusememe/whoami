import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";
import { education, experiences, projects, socialLinks } from "@/data/portfolio";
import { PROFILE_FILES, renderAgentFiles, renderLlmsFull, renderLlmsTxt, renderProfileMarkdown } from "@/seo/llms";
import { DEFAULT_SITE_URL, siteHref } from "@/seo/site";

const SITE = "https://example.test/whoami";

const links = (markdown: string) => [...markdown.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => m[2]);

describe("siteHref", () => {
  it("joins paths with exactly one slash", () => {
    expect(siteHref("https://a.test/x/", "/b.md")).toBe("https://a.test/x/b.md");
    expect(siteHref("https://a.test/x")).toBe("https://a.test/x/");
  });
});

describe("llms.txt", () => {
  const text = renderLlmsTxt(SITE);
  const lines = text.split("\n");

  it("follows the llmstxt.org section order", () => {
    expect(lines[0]).toBe("# Mateus Mendonça Monteiro");
    expect(lines[2].startsWith("> ")).toBe(true);
    // Detail paragraph before the first H2, no other headings in between.
    const firstH2 = lines.findIndex((line) => line.startsWith("## "));
    expect(lines.slice(1, firstH2).some((line) => line.startsWith("#"))).toBe(false);
    expect(lines.slice(3, firstH2).some((line) => line.trim().length > 0)).toBe(true);
  });

  it("ends with an Optional section", () => {
    const h2 = lines.filter((line) => line.startsWith("## "));
    expect(h2.at(-1)).toBe("## Optional");
  });

  it("uses list items of the form - [name](url): notes", () => {
    const items = lines.filter((line) => line.startsWith("- "));
    expect(items.length).toBeGreaterThan(10);
    for (const item of items) expect(item).toMatch(/^- \[[^\]]+\]\([^)]+\)(: .+)?$/);
  });

  it("only links to absolute URLs", () => {
    for (const href of links(text)) expect(href).toMatch(/^(https?:|mailto:)/);
  });

  it("links every profile file, project and contact channel", () => {
    const hrefs = links(text);
    for (const file of Object.values(PROFILE_FILES)) expect(hrefs).toContain(siteHref(SITE, file));
    for (const project of projects) expect(hrefs).toContain(project.githubUrl ?? project.liveUrl);
    for (const link of socialLinks) expect(hrefs).toContain(link.href);
  });
});

describe("Markdown profiles", () => {
  it.each(["en", "pt", "es"] as const)("include every role, school and project (%s)", (language) => {
    const markdown = renderProfileMarkdown(language, SITE);
    for (const exp of experiences) {
      expect(markdown).toContain(`### ${exp.role[language]} — ${exp.company}`);
      expect(markdown).toContain(exp.period[language]);
    }
    for (const item of education) expect(markdown).toContain(item.period[language]);
    for (const project of projects) expect(markdown).toContain(project.name);
  });

  it("localizes headings", () => {
    expect(renderProfileMarkdown("pt", SITE)).toContain("## Experiência");
    expect(renderProfileMarkdown("es", SITE)).toContain("## Experiencia");
    expect(renderProfileMarkdown("en", SITE)).toContain("## Experience");
  });

  it("links the other two languages", () => {
    const hrefs = links(renderProfileMarkdown("en", SITE));
    expect(hrefs).toContain(siteHref(SITE, PROFILE_FILES.pt));
    expect(hrefs).toContain(siteHref(SITE, PROFILE_FILES.es));
    expect(hrefs).not.toContain(siteHref(SITE, PROFILE_FILES.en));
  });

  it("llms-full.txt holds the three profiles", () => {
    const full = renderLlmsFull(SITE);
    expect(full.match(/^## (About Me|Sobre Mim|Sobre Mí)$/gm)).toHaveLength(3);
  });
});

describe("generated files in public/", () => {
  it("match the current portfolio data (run `npm run dev` or `npm run build` to refresh)", () => {
    for (const [name, content] of Object.entries(renderAgentFiles(DEFAULT_SITE_URL))) {
      expect(readFileSync(resolve("public", name), "utf8"), name).toBe(content);
    }
  });
});
