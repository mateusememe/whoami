/* eslint-disable @typescript-eslint/no-explicit-any -- JSON-LD and JSON Resume are read back as untyped JSON here */
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";
import { contributions, education, experiences, profile, projects, publications, socialLinks, talks } from "@/data/portfolio";
import {
  HTML_LANG,
  LANGUAGE_PATHS,
  LANGUAGES,
  PAGES,
  PROJECT_PAGE_IDS,
  isHomePath,
  isPrerenderedPath,
  languageFromPath,
  pagePath,
  parseRoute,
  stripBase,
} from "@/i18n/routes";
import { projectPages } from "@/data/projectPages";
import { OG_IMAGE_FILES, PROFILE_FILES, RESUME_FILES } from "@/seo/files";
import { HEAD_END, HEAD_START, renderHead, replaceHead } from "@/seo/head";
import { buildJsonLd } from "@/seo/jsonld";
import { renderAgentFiles } from "@/seo/llms";
import { buildResume } from "@/seo/resume";
import { renderSitemap } from "@/seo/sitemap";
import { DEFAULT_SITE_URL, parsePeriod, siteHref } from "@/seo/site";

const parse = (head: string) => new DOMParser().parseFromString(`<html><head>${head}</head></html>`, "text/html");
const metaOf = (doc: Document, key: string) =>
  doc.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute("content");

describe("language routes", () => {
  it("reads the language from the path", () => {
    expect(languageFromPath("/")).toBeNull();
    expect(languageFromPath("/pt")).toBe("pt");
    expect(languageFromPath("/pt/")).toBe("pt");
    expect(languageFromPath("/es/")).toBe("es");
    expect(languageFromPath("/nope")).toBeNull();
  });

  it("knows which paths are the home page", () => {
    expect(isHomePath("/")).toBe(true);
    expect(isHomePath("/es")).toBe(true);
    expect(isHomePath("/does-not-exist")).toBe(false);
  });

  it("gives every featured project a page in each language", () => {
    expect(PROJECT_PAGE_IDS).toEqual(projects.filter((project) => project.featured).map((project) => project.id));
    for (const id of PROJECT_PAGE_IDS) {
      const content = projectPages[id];
      expect(content, id).toBeDefined();
      for (const language of LANGUAGES) {
        // Same number of highlights in each language, and 2 or 4 of them (no lists of three).
        expect(content.highlights[language]).toHaveLength(content.highlights.en.length);
        expect([2, 4]).toContain(content.highlights[language].length);
        expect(content.cover[language].length).toBeGreaterThan(20);
      }
    }
    expect(Object.keys(projectPages).sort()).toEqual([...PROJECT_PAGE_IDS].sort());
    expect(pagePath("en", { kind: "project", id: "8-puzzle" })).toBe("/projects/8-puzzle/");
    expect(pagePath("pt", { kind: "project", id: "8-puzzle" })).toBe("/pt/projects/8-puzzle/");
    expect(parseRoute("/es/projects/8-puzzle")).toEqual({ language: "es", page: { kind: "project", id: "8-puzzle" } });
    expect(parseRoute("/projects/8-puzzle/")).toEqual({ language: null, page: { kind: "project", id: "8-puzzle" } });
    expect(languageFromPath("/pt/projects/8-puzzle/")).toBe("pt");
  });

  it("knows which paths are prerendered", () => {
    expect(isPrerenderedPath("/pt/projects/codecash/")).toBe(true);
    // Listed projects without a page, unknown ids and unknown prefixes are not.
    expect(isPrerenderedPath("/projects/kruskal-algorithm/")).toBe(false);
    expect(isPrerenderedPath("/projects/nope/")).toBe(false);
    expect(isPrerenderedPath("/en/")).toBe(false);
    expect(PAGES).toHaveLength(1 + PROJECT_PAGE_IDS.length);
  });

  it("maps every page to one URL per language and back", () => {
    const paths = new Set<string>();
    for (const page of PAGES) {
      for (const language of LANGUAGES) {
        const path = pagePath(language, page);
        expect(path).toMatch(/\/$/);
        expect(parseRoute(path)).toEqual({ language: language === "en" ? null : language, page });
        paths.add(path);
      }
    }
    expect(paths.size).toBe(PAGES.length * LANGUAGES.length);
  });

  it("strips the deployment base", () => {
    expect(stripBase("/whoami/pt/", "/whoami/")).toBe("/pt/");
    expect(stripBase("/whoami/", "/whoami/")).toBe("/");
    expect(stripBase("/whoami", "/whoami/")).toBe("/");
    expect(stripBase("/pt/", "/")).toBe("/pt/");
  });
});

describe("generated <head>", () => {
  const doc = parse(renderHead("en", DEFAULT_SITE_URL));
  const home = siteHref(DEFAULT_SITE_URL);

  it("uses absolute canonical and Open Graph URLs", () => {
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(home);
    expect(metaOf(doc, "og:url")).toBe(home);
  });

  it("links the three language URLs and an x-default", () => {
    const alternates = Object.fromEntries(
      [...doc.querySelectorAll("link[rel='alternate'][hreflang]")].map((link) => [
        link.getAttribute("hreflang"),
        link.getAttribute("href"),
      ]),
    );
    expect(alternates).toEqual({
      en: home,
      "pt-BR": siteHref(DEFAULT_SITE_URL, "pt/"),
      es: siteHref(DEFAULT_SITE_URL, "es/"),
      "x-default": home,
    });
  });

  it.each(LANGUAGES)("points og:image and twitter:image at the %s 1200x630 PNG, which exists", (language) => {
    const localized = parse(renderHead(language, DEFAULT_SITE_URL));
    const image = siteHref(DEFAULT_SITE_URL, OG_IMAGE_FILES[language]);
    expect(metaOf(localized, "og:image")).toBe(image);
    expect(metaOf(localized, "twitter:image")).toBe(image);
    const png = readFileSync(resolve("public", OG_IMAGE_FILES[language]));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    expect(metaOf(localized, "og:image:width")).toBe("1200");
    expect(metaOf(localized, "og:image:height")).toBe("630");
  });

  it("describes a project page with its own title, canonical URL and alternates", () => {
    const project = projects.find((item) => item.id === PROJECT_PAGE_IDS[0])!;
    const page = { kind: "project", id: project.id } as const;
    const head = parse(renderHead("pt", DEFAULT_SITE_URL, page));
    const url = siteHref(DEFAULT_SITE_URL, `pt/projects/${project.id}/`);
    expect(head.title).toContain(project.name);
    expect(head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(url);
    expect(metaOf(head, "og:url")).toBe(url);
    expect(metaOf(head, "og:type")).toBe("website");
    expect(metaOf(head, "profile:username")).toBeUndefined();
    expect(metaOf(head, "description")!.length).toBeLessThanOrEqual(160);
    expect(head.querySelector('link[hreflang="en"]')?.getAttribute("href")).toBe(
      siteHref(DEFAULT_SITE_URL, `projects/${project.id}/`),
    );
    const ld = JSON.parse(head.querySelector('script[type="application/ld+json"]')!.textContent!);
    const types = ld["@graph"].map((node: any) => node["@type"]);
    expect(types).toEqual(["WebSite", "Person", "WebPage", "SoftwareSourceCode", "BreadcrumbList"]);
    const code = ld["@graph"][3];
    expect(code.codeRepository).toBe(project.githubUrl);
    // The thesis page links its paper.
    const thesis = JSON.parse(
      parse(renderHead("en", DEFAULT_SITE_URL, { kind: "project", id: "find-the-fight" })).querySelector(
        'script[type="application/ld+json"]',
      )!.textContent!,
    )["@graph"][3];
    expect(thesis.subjectOf["@type"]).toBe("ScholarlyArticle");
    expect(thesis.subjectOf.about["@id"]).toBe(thesis["@id"]);
    expect(code.dateCreated).toBe(String(project.year));
    expect(ld["@graph"][4].itemListElement).toHaveLength(3);
  });

  it("advertises llms.txt, the Markdown profile and the JSON Resume", () => {
    expect(doc.querySelector('link[rel="describedby"]')?.getAttribute("href")).toBe(siteHref(DEFAULT_SITE_URL, "llms.txt"));
    expect(doc.querySelector('link[rel="alternate"][type="text/markdown"]')?.getAttribute("href")).toBe(
      siteHref(DEFAULT_SITE_URL, PROFILE_FILES.en),
    );
    expect(doc.querySelector('link[rel="alternate"][type="application/json"]')?.getAttribute("href")).toBe(
      siteHref(DEFAULT_SITE_URL, RESUME_FILES.en),
    );
  });

  it("links every public profile with rel=me", () => {
    const me = [...doc.querySelectorAll('link[rel="me"]')].map((link) => link.getAttribute("href"));
    expect(me).toEqual(socialLinks.filter((link) => !link.href.startsWith("mailto:")).map((link) => link.href));
  });

  it.each(LANGUAGES)("localizes title, description, canonical and locale (%s)", (language) => {
    const localized = parse(renderHead(language, DEFAULT_SITE_URL));
    const page = siteHref(DEFAULT_SITE_URL, LANGUAGE_PATHS[language]);
    expect(localized.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(page);
    expect(metaOf(localized, "og:url")).toBe(page);
    expect(metaOf(localized, "og:locale")).toBe({ en: "en_US", pt: "pt_BR", es: "es_ES" }[language]);
    expect(metaOf(localized, "description")).toContain("Itaú Unibanco");
    expect(metaOf(localized, "description")).not.toContain("{company}");
    expect(localized.querySelector('link[type="text/markdown"]')?.getAttribute("href")).toBe(
      siteHref(DEFAULT_SITE_URL, PROFILE_FILES[language]),
    );
  });

  it("gives each language its own title", () => {
    const titles = LANGUAGES.map((language) => parse(renderHead(language, DEFAULT_SITE_URL)).title);
    expect(new Set(titles).size).toBe(3);
  });
});

describe("index.html", () => {
  const html = readFileSync(resolve("index.html"), "utf8");

  it("carries the generated English block (run `npm run generate` to refresh)", () => {
    expect(html).toContain(HEAD_START);
    expect(html).toContain(HEAD_END);
    expect(replaceHead(html, renderHead("en", DEFAULT_SITE_URL))).toBe(html);
  });

  it("applies the saved theme before first paint", () => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const inline = [...doc.querySelectorAll("head script:not([type])")].map((script) => script.textContent ?? "");
    expect(inline.some((code) => code.includes("portfolio_theme") && code.includes('classList.add("dark")'))).toBe(true);
  });
});

describe("JSON-LD", () => {
  const graph = buildJsonLd("en", DEFAULT_SITE_URL)["@graph"] as Array<Record<string, unknown>>;
  const byType = (type: string) => graph.find((node) => node["@type"] === type) as Record<string, any>;
  const person = byType("Person");

  it("describes the site, the page, the person, the projects and the publications", () => {
    expect(graph.map((node) => node["@type"])).toEqual([
      "WebSite",
      "ProfilePage",
      "Person",
      "ItemList",
      ...publications.map(() => "ScholarlyArticle"),
    ]);
    const article = byType("ScholarlyArticle");
    expect(article.headline).toBe(publications[0].title);
    expect(article.author[0]["@id"]).toBe(person["@id"]);
    expect(article.author).toHaveLength(publications[0].authors.length);
    expect(byType("ProfilePage").mainEntity["@id"]).toBe(person["@id"]);
    expect(byType("ProfilePage").dateModified).toBe(profile.updatedAt);
  });

  it("matches the site URL and the current employer", () => {
    expect(person.url).toBe(siteHref(DEFAULT_SITE_URL));
    const current = experiences.find((exp) => exp.period.en.endsWith("Present"));
    expect(person.worksFor.name).toBe(current?.company);
    expect(person.address.addressLocality).toBe(profile.city);
  });

  it("lists every public profile in sameAs and the email from socialLinks", () => {
    const profiles = socialLinks.filter((link) => !link.href.startsWith("mailto:")).map((link) => link.href);
    expect([...person.sameAs].sort()).toEqual([...profiles].sort());
    expect(person.email).toBe(socialLinks.find((link) => link.href.startsWith("mailto:"))?.href);
  });

  it("separates the degree in progress from the finished one", () => {
    expect(person.affiliation).toHaveLength(education.filter((item) => item.current).length);
    expect(person.alumniOf).toHaveLength(education.filter((item) => !item.current).length);
  });

  it("lists the talks as events the person performed in", () => {
    expect(person.performerIn).toHaveLength(talks.length);
    for (const event of person.performerIn) {
      expect(event["@type"]).toBe("Event");
      expect(event.startDate).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/);
      expect(event.performer[0]["@id"]).toBe(person["@id"]);
    }
    const online = person.performerIn.filter((event: any) => event.eventAttendanceMode.endsWith("OnlineEventAttendanceMode"));
    expect(online).toHaveLength(talks.filter((talk) => talk.online).length);
    for (const event of online) expect(event.location["@type"]).toBe("VirtualLocation");
  });

  it("lists every project as source code, with a repository only when it is public", () => {
    const list = byType("ItemList");
    expect(list.numberOfItems).toBe(projects.length);
    list.itemListElement.forEach((entry: any, index: number) => {
      expect(entry.position).toBe(index + 1);
      expect(entry.item["@type"]).toBe("SoftwareSourceCode");
      expect(entry.item.codeRepository).toBe(projects[index].githubUrl);
    });
  });

  it("is localized per page", () => {
    const pt = buildJsonLd("pt", DEFAULT_SITE_URL)["@graph"] as Array<Record<string, any>>;
    expect(pt[1].inLanguage).toBe(HTML_LANG.pt);
    expect(pt[1].url).toBe(siteHref(DEFAULT_SITE_URL, "pt/"));
  });
});

describe("sitemap", () => {
  const xml = renderSitemap(DEFAULT_SITE_URL);

  it("lists every page in the three languages with hreflang alternates", () => {
    const count = PAGES.length * LANGUAGES.length;
    expect(xml.match(/<loc>/g)).toHaveLength(count);
    for (const page of PAGES) {
      for (const language of LANGUAGES) {
        expect(xml).toContain(`<loc>${siteHref(DEFAULT_SITE_URL, pagePath(language, page))}</loc>`);
      }
    }
    expect(xml.match(/hreflang="x-default"/g)).toHaveLength(count);
    expect(xml.match(/<lastmod>/g)).toHaveLength(count);
    expect(xml).toContain(`<lastmod>${profile.updatedAt}</lastmod>`);
  });

  it("matches public/sitemap.xml (run `npm run generate` to refresh)", () => {
    expect(readFileSync(resolve("public/sitemap.xml"), "utf8")).toBe(xml);
  });
});

describe("JSON Resume", () => {
  const resume = buildResume("en", DEFAULT_SITE_URL) as Record<string, any>;

  it("parses periods into ISO months", () => {
    expect(parsePeriod("May 2026 – Present")).toEqual({ startDate: "2026-05" });
    expect(parsePeriod("Jan 2025 – Apr 2026")).toEqual({ startDate: "2025-01", endDate: "2026-04" });
    expect(() => parsePeriod("someday")).toThrow();
  });

  it("carries every role, degree and project", () => {
    expect(resume.work).toHaveLength(experiences.length);
    expect(resume.work[0]).toMatchObject({ name: experiences[0].company, startDate: "2026-05" });
    expect(resume.work[0].endDate).toBeUndefined();
    expect(resume.education).toHaveLength(education.length);
    expect(resume.education[0]).toMatchObject({ studyType: "Master's", area: "Computer Science" });
    expect(resume.projects).toHaveLength(projects.length + talks.length);
    const featured = resume.projects.find((item: any) => item.name === projects.find((p) => p.featured)?.name);
    expect(featured.highlights.length).toBeGreaterThan(0);
    expect(resume.projects.filter((item: any) => item.type === "workshop")).toHaveLength(talks.length);
    expect(resume.publications).toHaveLength(publications.length);
    expect(resume.publications[0]).toMatchObject({ name: publications[0].title, releaseDate: String(publications[0].year) });
  });

  it("splits degree names in every language", () => {
    for (const language of LANGUAGES) {
      const localized = buildResume(language, DEFAULT_SITE_URL) as Record<string, any>;
      for (const item of localized.education) expect(item.area).not.toBe(item.studyType);
    }
  });
});

describe("privacy", () => {
  it("publishes no phone number in any generated file", () => {
    const outputs = [
      ...Object.values(renderAgentFiles(DEFAULT_SITE_URL)),
      ...LANGUAGES.map((language) => renderHead(language, DEFAULT_SITE_URL)),
    ];
    for (const output of outputs) {
      expect(output).not.toMatch(/\+55|\(\d{2}\)\s?\d{4,5}|\b\d{5}-\d{4}\b|"telephone"|"phone"/);
    }
    expect(contributions.length).toBeGreaterThan(0);
  });
});
