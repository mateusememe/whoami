/* eslint-disable @typescript-eslint/no-explicit-any -- JSON-LD and JSON Resume are read back as untyped JSON here */
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";
import { contributions, education, experiences, profile, projects, socialLinks } from "@/data/portfolio";
import { HTML_LANG, LANGUAGE_PATHS, LANGUAGES, isHomePath, languageFromPath, stripBase } from "@/i18n/routes";
import { PROFILE_FILES, RESUME_FILES } from "@/seo/files";
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

  it("points og:image and twitter:image at a 1200x630 PNG that exists", () => {
    const image = siteHref(DEFAULT_SITE_URL, "og-image.png");
    expect(metaOf(doc, "og:image")).toBe(image);
    expect(metaOf(doc, "twitter:image")).toBe(image);
    const png = readFileSync(resolve("public/og-image.png"));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    expect(metaOf(doc, "og:image:width")).toBe("1200");
    expect(metaOf(doc, "og:image:height")).toBe("630");
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

  it("describes the site, the page, the person and the projects", () => {
    expect(graph.map((node) => node["@type"])).toEqual(["WebSite", "ProfilePage", "Person", "ItemList"]);
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

  it("lists the three language URLs with hreflang alternates", () => {
    expect(xml.match(/<loc>/g)).toHaveLength(3);
    for (const language of LANGUAGES) expect(xml).toContain(`<loc>${siteHref(DEFAULT_SITE_URL, LANGUAGE_PATHS[language])}</loc>`);
    expect(xml.match(/hreflang="x-default"/g)).toHaveLength(3);
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
    expect(resume.projects).toHaveLength(projects.length);
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
