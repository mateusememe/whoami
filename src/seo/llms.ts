/**
 * Agent-readable views of the portfolio, following https://llmstxt.org:
 *
 *   llms.txt        index: H1, blockquote summary, link lists, ## Optional
 *   index.md        the home page as Markdown (English)
 *   index.pt.md     same, Portuguese
 *   index.es.md     same, Spanish
 *   llms-full.txt   the three profiles in one file
 *
 * Everything renders from src/data/portfolio.ts and src/i18n/translations.ts,
 * so these files cannot drift from the page. scripts/generate-llms.ts writes
 * them to public/ before dev and build.
 */
import { education, experiences, projects, socialLinks, techStack, topSkills } from "@/data/portfolio";
import { translations, type Language } from "@/i18n/translations";
import { SITE_NAME, SOURCE_REPO_URL, siteHref } from "@/seo/site";

export const PROFILE_FILES: Record<Language, string> = {
  en: "index.md",
  pt: "index.pt.md",
  es: "index.es.md",
};

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

/** Labels that exist only in the Markdown output. */
const LABELS: Record<Language, { website: string; otherLanguages: string; stack: string; stars: string }> = {
  en: { website: "Website", otherLanguages: "Other languages", stack: "Stack", stars: "stars" },
  pt: { website: "Site", otherLanguages: "Outros idiomas", stack: "Stack", stars: "estrelas" },
  es: { website: "Sitio", otherLanguages: "Otros idiomas", stack: "Stack", stars: "estrellas" },
};

const LANGUAGES: Language[] = ["en", "pt", "es"];

function tr(language: Language, key: string): string {
  return translations[key]?.[language] ?? key;
}

/** Single-line text for list items and link notes. */
function inline(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function summary(language: Language): string {
  return `${tr(language, "hero.title")}. ${tr(language, "hero.summary")}`;
}

function contactLines(): string[] {
  return socialLinks.map((link) => `- [${link.label}](${link.href}): ${link.displayText ?? link.label}`);
}

export function renderProfileMarkdown(language: Language, siteUrl: string): string {
  const label = LABELS[language];
  const others = LANGUAGES.filter((other) => other !== language)
    .map((other) => `[${LANGUAGE_NAMES[other]}](${siteHref(siteUrl, PROFILE_FILES[other])})`)
    .join(" · ");

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${summary(language)}`,
    "",
    tr(language, "hero.subtitle"),
    "",
    `- ${label.website}: ${siteHref(siteUrl)}`,
    `- ${label.otherLanguages}: ${others}`,
    "",
    `## ${tr(language, "about.title")}`,
    "",
    tr(language, "about.text"),
    "",
    `## ${tr(language, "exp.title")}`,
  ];

  for (const exp of experiences) {
    lines.push(
      "",
      `### ${exp.role[language]} — ${exp.company}`,
      "",
      exp.period[language],
      "",
      exp.desc[language],
      "",
      `${label.stack}: ${exp.tech.join(", ")}`,
    );
  }

  lines.push("", `## ${tr(language, "edu.title")}`, "");
  for (const item of education) {
    lines.push(`- **${item.school}** — ${tr(language, item.degreeKey)} (${item.period[language]})`);
  }

  lines.push(
    "",
    `## ${tr(language, "skills.title")}`,
    "",
    `**${tr(language, "skills.scholarship")}** — ${tr(language, "skills.scholarshipIssuer")}. ${tr(language, "skills.scholarshipDesc")}`,
    "",
    `**${tr(language, "skills.topSkills")}:** ${topSkills.map((skill) => skill[language]).join(", ")}`,
    "",
    `**${tr(language, "skills.stack")}:** ${techStack.join(", ")}`,
    "",
    `## ${tr(language, "projects.title")}`,
    "",
  );

  for (const project of projects) {
    const url = project.githubUrl ?? project.liveUrl;
    const name = url ? `[${project.name}](${url})` : project.name;
    const stars = typeof project.stars === "number" ? ` (${project.stars} ${label.stars})` : "";
    const stack = project.tech?.length ? ` ${label.stack}: ${project.tech.join(", ")}.` : "";
    lines.push(`- ${name}${stars}: ${inline(project.desc[language])}${stack}`);
  }

  lines.push("", `## ${tr(language, "contact.title")}`, "", tr(language, "contact.cta"), "", ...contactLines(), "");
  return lines.join("\n");
}

export function renderLlmsTxt(siteUrl: string): string {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${summary("en")}`,
    "",
    "Portfolio and résumé of a backend software engineer: experience, education, skills, open-source projects and contact channels. The website is a single-page React app with the same content in Portuguese, English and Spanish. The Markdown files below carry that content as plain text, one file per language, rendered at build time from the same data source as the page.",
    "",
    "## Profile",
    "",
    `- [Profile (English)](${siteHref(siteUrl, PROFILE_FILES.en)}): About, experience, education, skills, projects and contact`,
    `- [Perfil (Português)](${siteHref(siteUrl, PROFILE_FILES.pt)}): Same content in Brazilian Portuguese`,
    `- [Perfil (Español)](${siteHref(siteUrl, PROFILE_FILES.es)}): Same content in Spanish`,
    `- [Full context](${siteHref(siteUrl, "llms-full.txt")}): All profiles in one file`,
    "",
    "## Projects",
    "",
  ];

  for (const project of projects) {
    const url = project.githubUrl ?? project.liveUrl;
    if (url) lines.push(`- [${project.name}](${url}): ${inline(project.desc.en)}`);
  }

  lines.push(
    "",
    "## Contact",
    "",
    ...contactLines(),
    "",
    "## Optional",
    "",
    `- [Website](${siteHref(siteUrl)}): Interactive version of the profile with a WebGL background`,
    `- [Source code](${SOURCE_REPO_URL}): React, TypeScript, Vite, Tailwind CSS and three.js`,
    `- [Sitemap](${siteHref(siteUrl, "sitemap.xml")}): XML sitemap`,
    "",
  );
  return lines.join("\n");
}

export function renderLlmsFull(siteUrl: string): string {
  const header = [
    `# ${SITE_NAME} — full context`,
    "",
    `> ${summary("en")}`,
    "",
    `The profile in English, Portuguese and Spanish, in that order. Index: ${siteHref(siteUrl, "llms.txt")}`,
    "",
  ].join("\n");
  const profiles = LANGUAGES.map((language) => renderProfileMarkdown(language, siteUrl).trimEnd());
  return [header, ...profiles].join("\n---\n\n") + "\n";
}

/** File name → content, for everything written to public/. */
export function renderAgentFiles(siteUrl: string): Record<string, string> {
  const files: Record<string, string> = {
    "llms.txt": renderLlmsTxt(siteUrl),
    "llms-full.txt": renderLlmsFull(siteUrl),
  };
  for (const language of LANGUAGES) {
    files[PROFILE_FILES[language]] = renderProfileMarkdown(language, siteUrl);
  }
  return files;
}
