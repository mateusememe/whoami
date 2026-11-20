/**
 * Agent-readable views of the portfolio, following https://llmstxt.org:
 *
 *   llms.txt            index: H1, blockquote summary, key facts, link lists, ## Optional
 *   index.md            the home page as Markdown (English)
 *   index.pt.md         same, Portuguese
 *   index.es.md         same, Spanish
 *   llms-full.txt       the three profiles in one file
 *   resume.json (+ .pt, .es)   JSON Resume, see src/seo/resume.ts
 *
 * Everything renders from src/data/portfolio.ts and src/i18n/translations.ts,
 * so these files cannot drift from the page. scripts/generate-llms.ts writes
 * them to public/ before dev and build.
 */
import {
  certifications,
  contributions,
  education,
  experiences,
  profile,
  projects,
  publicationReference,
  publications,
  socialLinks,
  spokenLanguages,
  talkUrl,
  talks,
  techStack,
  topSkills,
} from "@/data/portfolio";
import { LANGUAGE_PATHS, PROJECT_PAGE_IDS, pagePath } from "@/i18n/routes";
import { translations, type Language } from "@/i18n/translations";
import { CV_FILES, PROFILE_FILES, RESUME_FILES } from "@/seo/files";
import { FEED_FILES, renderAtomFeed } from "@/seo/feed";
import { publishedNotes } from "@/content/notes";
import { currentRole } from "@/seo/jsonld";
import { buildResume } from "@/seo/resume";
import { SITE_NAME, SOURCE_REPO_URL, siteHref } from "@/seo/site";

export { PROFILE_FILES, RESUME_FILES };

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

/** Labels that exist only in the Markdown output. */
const LABELS: Record<
  Language,
  {
    website: string;
    otherLanguages: string;
    stack: string;
    stars: string;
    location: string;
    updated: string;
    resume: string;
    cv: string;
    source: string;
    page: string;
  }
> = {
  en: {
    source: "Source",
    page: "Project page",
    website: "Website",
    otherLanguages: "Other languages",
    stack: "Stack",
    stars: "stars",
    location: "Location",
    updated: "Last updated",
    resume: "Structured data (JSON Resume)",
    cv: "Résumé (PDF)",
  },
  pt: {
    source: "Código",
    page: "Página do projeto",
    website: "Site",
    otherLanguages: "Outros idiomas",
    stack: "Stack",
    stars: "estrelas",
    location: "Local",
    updated: "Atualizado em",
    resume: "Dados estruturados (JSON Resume)",
    cv: "Currículo (PDF)",
  },
  es: {
    source: "Código",
    page: "Página del proyecto",
    website: "Sitio",
    otherLanguages: "Otros idiomas",
    stack: "Stack",
    stars: "estrellas",
    location: "Ubicación",
    updated: "Actualizado el",
    resume: "Datos estructurados (JSON Resume)",
    cv: "Currículum (PDF)",
  },
};

const COUNTRY: Record<Language, string> = { en: "Brazil", pt: "Brasil", es: "Brasil" };

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

/** URL of a project's own page, for featured projects. */
function projectPage(siteUrl: string, language: Language, id: string): string | undefined {
  return PROJECT_PAGE_IDS.includes(id) ? siteHref(siteUrl, pagePath(language, { kind: "project", id })) : undefined;
}

/** ABNT reference, with the address of the proceedings when they are online. */
function citation(item: (typeof publications)[number]): string {
  return publicationReference(item).full;
}

function talkLine(language: Language, talk: (typeof talks)[number], siteUrl: string): string {
  const links = [
    `[${tr(language, "talk.page")}](${siteHref(siteUrl, pagePath(language, { kind: "talk", id: talk.id }))})`,
    talk.links.repo ? `[${tr(language, "talks.repo")}](${talk.links.repo})` : "",
    talk.links.slides ? `[${tr(language, "talks.slides")}](${talk.links.slides})` : "",
    talk.links.notebook ? `[${tr(language, "talks.notebook")}](${talk.links.notebook})` : "",
    talk.links.event ? `[${tr(language, "talks.event")}](${talk.links.event})` : "",
  ].filter(Boolean);
  const people = talk.coSpeakers?.length ? ` ${tr(language, "talks.with").replace("{names}", talk.coSpeakers.join(", "))}.` : "";
  return `- **${talk.title}** — ${tr(language, `talks.${talk.kind}`)}, ${talk.event[language]}, ${talk.date} (${talk.organizer}, ${talk.online ? tr(language, "talks.online").toLowerCase() : talk.city}). ${inline(talk.desc[language])}${people} ${links.join(" · ")}`.trimEnd();
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
    `- ${label.location}: ${profile.city}, ${COUNTRY[language]}`,
    `- ${label.website}: ${siteHref(siteUrl, LANGUAGE_PATHS[language])}`,
    `- ${label.otherLanguages}: ${others}`,
    `- ${label.resume}: ${siteHref(siteUrl, RESUME_FILES[language])}`,
    `- ${label.cv}: ${siteHref(siteUrl, CV_FILES[language])}`,
    `- ${label.updated}: ${profile.updatedAt}`,
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
      `${exp.period[language]} · ${exp.location}`,
      "",
      exp.desc[language],
      "",
      `${label.stack}: ${exp.tech.join(", ")}`,
    );
  }

  lines.push("", `## ${tr(language, "edu.title")}`, "");
  for (const item of education) {
    const status = item.current ? `, ${tr(language, "edu.inProgress").toLowerCase()}` : "";
    lines.push(`- **${item.fullName ?? item.school}** — ${tr(language, item.degreeKey)} (${item.period[language]}${status})`);
  }
  lines.push(
    "",
    `**${tr(language, "edu.languages")}:** ${spokenLanguages.map((item) => `${item.name[language]} (${item.level[language].toLowerCase()})`).join(", ")}`,
    "",
    `**${tr(language, "edu.certifications")}:** ${certifications.map((item) => `${item.name}, ${item.detail[language]}`).join("; ")}`,
    "",
    `**${tr(language, "edu.publications")}:**`,
    "",
    ...publications.map((item) => {
      const page = item.projectId ? projectPage(siteUrl, language, item.projectId) : undefined;
      const link = page ? ` [${tr(language, "talks.project")}](${page})` : "";
      return `- ${citation(item)} ${inline(item.summary[language])}${link}`;
    }),
  );

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
    const page = projectPage(siteUrl, language, project.id);
    const target = page ?? url;
    const name = target ? `[${project.name}](${target})` : project.name;
    const notes = [
      typeof project.stars === "number" ? `${project.stars} ${label.stars}` : "",
      String(project.year),
      url ? "" : tr(language, "projects.private").toLowerCase(),
    ].filter(Boolean);
    const stack = project.tech?.length ? ` ${label.stack}: ${project.tech.join(", ")}.` : "";
    const source = page && url ? ` ${label.source}: ${url}` : "";
    lines.push(`- ${name} (${notes.join(", ")}): ${inline(project.desc[language])}${stack}${source}`);
  }

  lines.push("", `## ${tr(language, "projects.contributions")}`, "", tr(language, "projects.contributionsLead"), "");
  for (const item of contributions) {
    lines.push(`- [${item.repo}](${item.url}) (${item.merged}): ${inline(item.desc[language])}`);
  }

  lines.push("", `## ${tr(language, "talks.title")}`, "");
  for (const talk of talks) lines.push(talkLine(language, talk, siteUrl));

  lines.push("", `## ${tr(language, "contact.title")}`, "", tr(language, "contact.cta"), "", ...contactLines(), "");
  return lines.join("\n");
}

export function renderLlmsTxt(siteUrl: string): string {
  const role = currentRole();
  const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));
  const degrees = education
    .map((item) => `${tr("en", item.degreeKey)} at ${item.school}${item.current ? " (in progress)" : ""}`)
    .join("; ");

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${summary("en")}`,
    "",
    "Portfolio and résumé of a backend software engineer: experience, education, skills, open-source projects, talks and contact channels. The website is a single-page React app, prerendered to static HTML in Portuguese, English and Spanish. The files below carry the same content as plain text and as structured data, rendered at build time from the same source as the page. To answer questions about Mateus, read one Markdown profile or the JSON Resume; neither needs JavaScript.",
    "",
    // Key facts as a plain list (no heading), which llmstxt.org allows before the link sections.
    ...(role ? [`- Current role: ${role.role.en} at ${role.company} (since ${role.period.en.split(" – ")[0]})`] : []),
    `- Location: ${profile.city}, ${COUNTRY.en}`,
    `- Education: ${degrees}`,
    `- Focus: ${topSkills
      .slice(0, 4)
      .map((skill) => skill.en)
      .join(", ")}`,
    `- Spoken languages: ${spokenLanguages.map((item) => `${item.name.en} (${item.level.en.toLowerCase()})`).join(", ")}`,
    `- Publications: ${publications.map((item) => `${item.title} (${item.venue.split(" — ")[0]} ${item.year})`).join("; ")}`,
    `- Talks: ${talks.length} workshops (${talks.map((talk) => `${talk.title}, ${talk.event.en}`).join("; ")})`,
    ...(mail ? [`- Contact: ${mail.href.replace("mailto:", "")}`] : []),
    `- Last updated: ${profile.updatedAt}`,
    "",
    "## Profile",
    "",
    `- [Profile (English)](${siteHref(siteUrl, PROFILE_FILES.en)}): About, experience, education, skills, projects, contributions, talks and contact`,
    `- [Perfil (Português)](${siteHref(siteUrl, PROFILE_FILES.pt)}): Same content in Brazilian Portuguese`,
    `- [Perfil (Español)](${siteHref(siteUrl, PROFILE_FILES.es)}): Same content in Spanish`,
    `- [JSON Resume](${siteHref(siteUrl, RESUME_FILES.en)}): The profile as structured data (jsonresume.org schema), with ISO dates`,
    `- [Résumé (PDF)](${siteHref(siteUrl, CV_FILES.en)}): Two-page résumé laid out for applicant tracking systems; also in [Portuguese](${siteHref(siteUrl, CV_FILES.pt)}) and [Spanish](${siteHref(siteUrl, CV_FILES.es)})`,
    `- [Full context](${siteHref(siteUrl, "llms-full.txt")}): All three profiles in one file`,
    `- [Now](${siteHref(siteUrl, pagePath("en", { kind: "now" }))}): What Mateus is doing at the moment: role, degree, newest projects, latest talk and contribution`,
    `- [Uses](${siteHref(siteUrl, pagePath("en", { kind: "uses" }))}): The machine and the tools he uses every day`,
    ...(publishedNotes.length
      ? [`- [Notes](${siteHref(siteUrl, pagePath("en", { kind: "notes" }))}): ${publishedNotes.length} notes; Atom feed at ${siteHref(siteUrl, FEED_FILES.en)}`]
      : []),
    "",
    "## Projects",
    "",
  ];

  // Featured projects link to their own page (with details), the rest to the repository.
  for (const project of projects) {
    const url = project.githubUrl ?? project.liveUrl;
    const page = projectPage(siteUrl, "en", project.id);
    if (page) {
      const source = url ? ` [Source](${url})` : " Private repository.";
      lines.push(`- [${project.name}](${page}): ${inline(project.desc.en)}${source}`);
    } else if (url) {
      lines.push(`- [${project.name}](${url}): ${inline(project.desc.en)}`);
    }
  }

  lines.push("", "## Open-source contributions", "");
  for (const item of contributions) {
    lines.push(`- [${item.repo}](${item.url}): ${inline(item.desc.en)}`);
  }

  lines.push("", "## Publications", "");
  for (const item of publications) {
    const url = item.url ?? (item.projectId ? projectPage(siteUrl, "en", item.projectId) : undefined);
    if (url) lines.push(`- [${item.title}](${url}): ${citation(item)} ${inline(item.summary.en)}`);
  }

  lines.push("", "## Talks", "");
  for (const talk of talks) {
    const page = siteHref(siteUrl, pagePath("en", { kind: "talk", id: talk.id }));
    const material = talkUrl(talk);
    const people = talk.coSpeakers?.length ? ` With ${talk.coSpeakers.join(", ")}.` : "";
    lines.push(
      `- [${talk.title}](${page}): Workshop at ${talk.event.en}, ${talk.date}. ${inline(talk.desc.en)}${people}${material ? ` [Material](${material})` : ""}`,
    );
  }

  lines.push(
    "",
    "## Contact",
    "",
    ...contactLines(),
    "",
    "## Optional",
    "",
    `- [Website (English)](${siteHref(siteUrl)}): Interactive version of the profile with a WebGL background. In browsers with WebMCP it registers the tools get_profile, list_projects, list_talks, get_contact and go_to_section`,
    `- [Website (Português)](${siteHref(siteUrl, LANGUAGE_PATHS.pt)}): Same page in Portuguese`,
    `- [Website (Español)](${siteHref(siteUrl, LANGUAGE_PATHS.es)}): Same page in Spanish`,
    `- [JSON Resume (Português)](${siteHref(siteUrl, RESUME_FILES.pt)}): Structured data in Portuguese`,
    `- [JSON Resume (Español)](${siteHref(siteUrl, RESUME_FILES.es)}): Structured data in Spanish`,
    `- [Source code](${SOURCE_REPO_URL}): React, TypeScript, Vite, Tailwind CSS and three.js`,
    `- [Sitemap](${siteHref(siteUrl, "sitemap.xml")}): XML sitemap with every page in the three languages`,
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
    files[RESUME_FILES[language]] = `${JSON.stringify(buildResume(language, siteUrl), null, 2)}\n`;
    // The notes feed exists once there is a published note.
    if (publishedNotes.length) files[FEED_FILES[language]] = renderAtomFeed(language, siteUrl, publishedNotes);
  }
  return files;
}
