import { describe, it, expect } from "vitest";
import { CV_LABELS, CV_PROJECTS, CV_SECTIONS, buildCv, displayUrl, renderCvHtml, splitSentences } from "@/cv/cv";
import { experiences, profile, projects, talks } from "@/data/portfolio";
import { LANGUAGES } from "@/i18n/routes";
import { CV_FILES } from "@/seo/files";

const SITE = "https://example.test/whoami";

describe("splitSentences", () => {
  it("breaks after a full stop followed by a capital, and nowhere else", () => {
    expect(splitSentences("Built APIs with Node.js (Fastify). Cut sync time by 20%. Team of 12.")).toEqual([
      "Built APIs with Node.js (Fastify).",
      "Cut sync time by 20%.",
      "Team of 12.",
    ]);
    expect(splitSentences("Atendeu 1.000 usuários em 2.600 canteiros.")).toHaveLength(1);
    expect(splitSentences("Uses `doctor` and `check_environment`.")).toEqual(["Uses doctor and check_environment."]);
  });
});

describe("résumé", () => {
  it.each(LANGUAGES)("has every standard section, in order, named in %s", (language) => {
    const doc = buildCv(language, SITE);
    expect(doc.sections.map((section) => section.id)).toEqual([...CV_SECTIONS]);
    expect(doc.sections.map((section) => section.heading)).toEqual(CV_SECTIONS.map((id) => CV_LABELS[language][id]));
  });

  it.each(LANGUAGES)("lists every role with its company, dates and the whole description (%s)", (language) => {
    const doc = buildCv(language, SITE);
    const entries = doc.sections.find((section) => section.id === "experience")!.entries!;
    expect(entries).toHaveLength(experiences.length);
    entries.forEach((entry, index) => {
      const experience = experiences[index];
      expect(entry.title).toBe(experience.role[language]);
      expect(entry.at).toBe(experience.company);
      expect(entry.meta).toContain(experience.period[language]);
      // Every sentence is a bullet, and every technology is named somewhere in the entry.
      const bullets = entry.bullets!.join(" ");
      for (const sentence of splitSentences(experience.desc[language])) expect(entry.bullets).toContain(sentence);
      const squash = (value: string) => value.toLowerCase().replace(/[\s.-]/g, "");
      for (const tech of experience.tech) expect(squash(bullets)).toContain(squash(tech));
    });
  });

  it("keeps the same structure in the three languages", () => {
    const shape = (language: (typeof LANGUAGES)[number]) =>
      buildCv(language, SITE).sections.map((section) => [
        section.id,
        section.lines?.length ?? 0,
        (section.entries ?? []).map((entry) => entry.bullets?.length ?? 0),
      ]);
    expect(shape("pt")).toEqual(shape("en"));
    expect(shape("es")).toEqual(shape("en"));
  });

  it("puts contact details in the body as plain text, with no phone number", () => {
    const doc = buildCv("pt", SITE);
    const contact = doc.contact.map((item) => item.text);
    expect(contact).toEqual([
      `${profile.city}, ${profile.region}, Brasil`,
      "matt.mendon@gmail.com",
      "linkedin.com/in/mateus-men",
      "github.com/mateusememe",
      "example.test/whoami/pt",
    ]);
    expect(JSON.stringify(doc)).not.toMatch(/\+?\d{2}\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}/);
  });

  it("lists the chosen projects with a public address, and every talk once", () => {
    const doc = buildCv("en", SITE);
    const listed = doc.sections.find((section) => section.id === "projects")!.entries!;
    expect(listed.map((entry) => entry.title)).toEqual(CV_PROJECTS.map((id) => projects.find((p) => p.id === id)!.name));
    for (const entry of listed) expect(entry.meta).toMatch(/github\.com\/|example\.test\/whoami\/projects\//);
    const lines = doc.sections.find((section) => section.id === "talks")!.lines!.join("\n");
    for (const talk of talks) expect(lines.split(talk.title)).toHaveLength(2);
  });

  it.each(LANGUAGES)("prints as one column of plain text (%s)", (language) => {
    const doc = buildCv(language, SITE);
    const html = renderCvHtml(doc);
    expect(html).toContain(`<title>${doc.title.replace("&", "&amp;")}</title>`);
    expect(html).toMatch(/<html lang="(en|pt-BR|es)">/);
    expect(html).toContain("font-variant-ligatures: none");
    // Layouts and effects that scramble extracted text.
    for (const pattern of [/<table/, /<img/, /<svg/, /column-count/, /display:\s*(grid|flex)/, /letter-spacing/, /text-transform/]) {
      expect(html).not.toMatch(pattern);
    }
    expect(html.match(/<h2>/g)).toHaveLength(CV_SECTIONS.length);
    // Hyphenated words and URLs never break across lines.
    expect(html).toContain('<span class="whole">github.com/mateusememe</span>');
  });

  it("names one PDF per language", () => {
    expect(new Set(Object.values(CV_FILES)).size).toBe(3);
    for (const file of Object.values(CV_FILES)) expect(file).toMatch(/^cv\/mateus-mendonca-monteiro-[a-z]+-(en|pt|es)\.pdf$/);
    expect(displayUrl("https://www.linkedin.com/in/x/")).toBe("linkedin.com/in/x");
  });
});
