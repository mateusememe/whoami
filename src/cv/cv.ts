/**
 * The résumé as a PDF per language, laid out for applicant tracking systems
 * (ATS): one column of real text in reading order, standard section names,
 * bullets as list items, contact details as plain text, no tables, columns,
 * icons, images, ligatures or letter spacing (each can scramble the text a
 * parser extracts). Everything comes from src/data/portfolio.ts, so the PDF
 * never drifts from the site.
 *
 * buildCv() returns the document as data (tested); renderCvHtml() lays it
 * out for print; scripts/render-cv.ts prints it with headless Chrome and
 * scripts/check-cv.ts reads the PDF back as an ATS would.
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
  talks,
  techGroups,
  topSkills,
} from "@/data/portfolio";
import { HTML_LANG, LANGUAGE_PATHS, pagePath } from "@/i18n/routes";
import { translations, type Language } from "@/i18n/translations";
import { formatMonth } from "@/lib/dates";
import { siteHref } from "@/seo/site";

/** Section names as recruiters and parsers expect them, per language. */
export const CV_LABELS: Record<Language, Record<CvSectionId | "technologies" | "country" | "document" | "private", string>> = {
  en: {
    summary: "Summary",
    experience: "Experience",
    skills: "Skills",
    education: "Education",
    projects: "Projects",
    openSource: "Open Source",
    publications: "Publications",
    talks: "Talks & Workshops",
    languages: "Languages & Certifications",
    technologies: "Technologies",
    country: "Brazil",
    document: "Resume",
    private: "private repository",
  },
  pt: {
    summary: "Resumo",
    experience: "Experiência Profissional",
    skills: "Competências",
    education: "Formação Acadêmica",
    projects: "Projetos",
    openSource: "Open Source",
    publications: "Publicações",
    talks: "Palestras e Minicursos",
    languages: "Idiomas e Certificações",
    technologies: "Tecnologias",
    country: "Brasil",
    document: "Currículo",
    private: "repositório privado",
  },
  es: {
    summary: "Resumen",
    experience: "Experiencia Profesional",
    skills: "Habilidades",
    education: "Formación Académica",
    projects: "Proyectos",
    openSource: "Open Source",
    publications: "Publicaciones",
    talks: "Charlas y Talleres",
    languages: "Idiomas y Certificaciones",
    technologies: "Tecnologías",
    country: "Brasil",
    document: "Currículum",
    private: "repositorio privado",
  },
};

/** Section order: experience first, as recruiters read it. */
export const CV_SECTIONS = [
  "summary",
  "experience",
  "skills",
  "education",
  "projects",
  "openSource",
  "publications",
  "talks",
  "languages",
] as const;

export type CvSectionId = (typeof CV_SECTIONS)[number];

/**
 * Featured projects on the résumé: the systems work first, then the
 * research (the MSc project and the thesis behind the publication).
 */
export const CV_PROJECTS = [
  "rinha-backend-2026-c",
  "megabrain-context-protocol",
  "syntroph",
  "transaction-ledger",
  "lime-stability",
  "find-the-fight",
];

export interface CvEntry {
  /** Role, degree or project name. */
  title: string;
  /** Company, school or a short qualifier, on the same line as the title. */
  at?: string;
  /** Place and dates, or year and language. */
  meta?: string;
  /** Print the meta on the title line (short entries: projects, contributions). */
  inline?: boolean;
  bullets?: string[];
}

export interface CvSection {
  id: CvSectionId;
  heading: string;
  /** Entries with a title (experience, education, projects). */
  entries?: CvEntry[];
  /** Plain lines (summary, skills, talks, languages). */
  lines?: string[];
}

export interface CvDocument {
  language: Language;
  /** PDF title. */
  title: string;
  name: string;
  headline: string;
  /** Location, email and profile addresses, each as plain text. */
  contact: Array<{ text: string; href?: string }>;
  sections: CvSection[];
}

const tr = (language: Language, key: string) => translations[key]?.[language] ?? key;

/** Removes the backticks the data uses for inline code. */
const plain = (text: string) => text.replace(/`/g, "");

/** Host and path of a URL, as people type it ("github.com/mateusememe"). */
export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * Splits a paragraph into sentences, one bullet each. Breaks only after a
 * full stop followed by a capital letter, so "Node.js", "1.000" and
 * "(Fastify), and" stay whole.
 */
export function splitSentences(text: string): string[] {
  return plain(text)
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * The stack an entry lists but its text does not name, as one more bullet,
 * so every keyword is on the page once without repeating the sentences.
 */
function techLine(text: string, tech: string[], label: string): string[] {
  // "Magalu Cloud" names MagaluCloud and "AngularJS" names Angular.js.
  const squash = (value: string) => value.toLowerCase().replace(/[\s.-]/g, "");
  const body = squash(text);
  const missing = tech.filter((item) => !body.includes(squash(item)));
  return missing.length ? [`${label}: ${missing.join(", ")}.`] : [];
}

/** Groups items by key, keeping the order of first appearance. */
function groupBy<T>(items: T[], key: (item: T) => string): T[][] {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
  return [...groups.values()];
}

/** First sentence of a paragraph. */
const firstSentence = (text: string) => splitSentences(text)[0] ?? plain(text);

export function buildCv(language: Language, siteUrl: string): CvDocument {
  const labels = CV_LABELS[language];
  const link = (iconName: string) => socialLinks.find((item) => item.iconName === iconName);
  const mail = link("Mail");
  const linkedin = link("Linkedin");
  const github = link("Github");
  const site = siteHref(siteUrl, LANGUAGE_PATHS[language]);

  const sections: Record<CvSectionId, CvSection> = {
    summary: { id: "summary", heading: labels.summary, lines: [tr(language, "about.text")] },

    experience: {
      id: "experience",
      heading: labels.experience,
      entries: experiences.map((item) => ({
        title: item.role[language],
        at: item.company,
        meta: `${item.location} | ${item.period[language]}`,
        bullets: [...splitSentences(item.desc[language]), ...techLine(item.desc[language], item.tech, labels.technologies)],
      })),
    },

    skills: {
      id: "skills",
      heading: labels.skills,
      lines: [
        `${tr(language, "skills.topSkills")}: ${topSkills.map((skill) => skill[language]).join(", ")}.`,
        // Two groups per line keeps the list short; each still starts with its own label.
        ...techGroups
          .map((group) => `${tr(language, group.labelKey)}: ${group.items.join(", ")}.`)
          .reduce<string[]>((lines, group, index) => (index % 2 ? [...lines.slice(0, -1), `${lines.at(-1)} ${group}`] : [...lines, group]), []),
      ],
    },

    education: {
      id: "education",
      heading: labels.education,
      entries: education.map((item) => ({
        title: tr(language, item.degreeKey),
        at: item.fullName ?? item.school,
        meta: [
          `${item.period[language]}${item.current ? ` (${tr(language, "edu.inProgress")})` : ""}`,
          // The ProUni scholarship paid for the bachelor's degree.
          ...(item.degreeKey === "edu.bachelors" ? [tr(language, "skills.scholarship")] : []),
        ].join(" | "),
      })),
    },

    projects: {
      id: "projects",
      heading: labels.projects,
      entries: CV_PROJECTS.map((id) => {
        const project = projects.find((item) => item.id === id);
        if (!project) throw new Error(`CV project not found: ${id}`);
        const page = siteHref(siteUrl, pagePath(language, { kind: "project", id }));
        const url = project.githubUrl ? displayUrl(project.githubUrl) : `${displayUrl(page)} (${labels.private})`;
        return {
          title: project.name,
          meta: [project.year, project.language, url].filter(Boolean).join(" | "),
          inline: true,
          bullets: [firstSentence(project.desc[language])],
        };
      }),
    },

    openSource: {
      id: "openSource",
      heading: labels.openSource,
      entries: contributions.map((item) => ({
        title: item.repo,
        // A single pull request links to it; a set of them links to the repository.
        meta: `${formatMonth(item.merged, language)} | ${item.url.includes("?") ? `github.com/${item.repo}` : displayUrl(item.url)}`,
        inline: true,
        bullets: [firstSentence(item.desc[language])],
      })),
    },

    publications: {
      id: "publications",
      heading: labels.publications,
      lines: publications.map((item) => publicationReference(item).full),
    },

    talks: {
      id: "talks",
      heading: labels.talks,
      // One line per event: "34th Infoeste, Presidente Prudente, SP, Oct 2022: A; B; C (Online)."
      lines: groupBy(talks, (talk) => `${talk.event[language]}|${formatMonth(talk.date, language)}`).map((group) => {
        const event = group[0].event[language];
        const city = group.find((talk) => !talk.online)?.city;
        // "DevFest Presidente Prudente 2025" already says where it was.
        const place = city && !event.includes(city.split(",")[0]) ? city : "";
        const titles = group.map((talk) => {
          const notes = [
            ...(talk.kind === "talk" ? [tr(language, "talks.talk")] : []),
            ...(talk.online ? [tr(language, "talks.online")] : []),
          ];
          return notes.length ? `${talk.title} (${notes.join(", ")})` : talk.title;
        });
        return `${[event, place, formatMonth(group[0].date, language)].filter(Boolean).join(", ")}: ${titles.join("; ")}.`;
      }),
    },

    // Certificates here are language tests, so each sits with its language.
    languages: {
      id: "languages",
      heading: labels.languages,
      lines: [
        spokenLanguages
          .map((item) => {
            const certificate = certifications.find((cert) => cert.name.includes(item.name.en));
            return `${item.name[language]}: ${item.level[language]}${certificate ? `, ${certificate.name} ${certificate.detail[language]}` : ""}`;
          })
          .join(" | ") + ".",
      ],
    },
  };

  return {
    language,
    title: `${profile.name} | ${labels.document}`,
    name: profile.name,
    headline: tr(language, "hero.title"),
    contact: [
      { text: `${profile.city}, ${profile.region}, ${labels.country}` },
      ...(mail ? [{ text: mail.href.replace("mailto:", ""), href: mail.href }] : []),
      ...(linkedin ? [{ text: displayUrl(linkedin.href), href: linkedin.href }] : []),
      ...(github ? [{ text: displayUrl(github.href), href: github.href }] : []),
      { text: displayUrl(site), href: site },
    ],
    sections: CV_SECTIONS.map((id) => sections[id]),
  };
}

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Escaped text in which addresses and hyphenated words never break across lines:
 * a parser reads a line break as a space, so "check-in" split after the
 * hyphen comes out as "check- in". Very long URLs print a little smaller to
 * fit the line.
 */
const text = (value: string) =>
  escape(value).replace(/\S*(?:\w\/\w|\w-\w)\S*/g, (token) => {
    const long = token.length > 90 ? " long" : "";
    return `<span class="whole${long}">${token}</span>`;
  });

/** Font files for the print (file:// or https URLs). Without them the system sans serif is used. */
export interface CvFonts {
  regular: string;
  semibold: string;
  bold: string;
}

/** The document as a printable page: A4, one column, at most two pages. */
export function renderCvHtml(doc: CvDocument, fonts?: CvFonts): string {
  const face = (weight: number, url: string) =>
    `@font-face { font-family: "Inter"; font-style: normal; font-weight: ${weight}; src: url("${url}") format("woff2"); }`;
  const contact = doc.contact
    .map((item) => (item.href ? `<a href="${escape(item.href)}">${text(item.text)}</a>` : escape(item.text)))
    .join(" | ");

  const entry = (item: CvEntry) => `
      <div class="entry">
        <h3>${text(item.title)}${item.at ? ` | ${text(item.at)}` : ""}${item.inline && item.meta ? ` <span class="meta">| ${text(item.meta)}</span>` : ""}</h3>
        ${item.meta && !item.inline ? `<p class="meta">${text(item.meta)}</p>` : ""}
        ${item.bullets?.length ? `<ul>${item.bullets.map((bullet) => `<li>${text(bullet)}</li>`).join("")}</ul>` : ""}
      </div>`;

  const section = (item: CvSection) => `
    <section id="${item.id}">
      <h2>${escape(item.heading)}</h2>
      ${item.entries?.map(entry).join("") ?? ""}
      ${item.lines?.length ? (item.id === "summary" ? `<p>${text(item.lines[0])}</p>` : `<ul class="lines">${item.lines.map((line) => `<li>${text(line)}</li>`).join("")}</ul>`) : ""}
    </section>`;

  return `<!doctype html>
<html lang="${HTML_LANG[doc.language]}">
<head>
<meta charset="utf-8">
<title>${escape(doc.title)}</title>
<meta name="author" content="${escape(doc.name)}">
<style>
  ${fonts ? [face(400, fonts.regular), face(600, fonts.semibold), face(700, fonts.bold)].join("\n  ") : ""}
  @page { size: A4; margin: 10mm 12mm; }
  * { box-sizing: border-box; }
  html {
    font-family: "Inter", Arial, Helvetica, sans-serif;
    font-size: 9pt;
    line-height: 1.25;
    color: #111;
    /* Ligatures turn "fi" and "fl" into one glyph that many parsers cannot map back to letters. */
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
    -webkit-print-color-adjust: exact;
  }
  body { margin: 0; }
  h1 { font-size: 19pt; font-weight: 700; line-height: 1.1; margin: 0; }
  .headline { font-size: 11pt; font-weight: 600; margin: 2pt 0 0; }
  .contact { margin: 4pt 0 0; color: #222; }
  a { color: inherit; text-decoration: none; }
  h2 {
    font-size: 10.5pt;
    font-weight: 700;
    margin: 6.5pt 0 2.5pt;
    padding-bottom: 1.5pt;
    border-bottom: 0.6pt solid #888;
    break-after: avoid;
  }
  h3, p.meta { break-after: avoid; }
  h3 { font-size: 9.4pt; font-weight: 600; margin: 0; }
  h3 .meta { font-size: 9pt; font-weight: 400; }
  p { margin: 0; }
  .meta { color: #333; }
  /* Long entries may continue on the next page; a title never ends a page alone. */
  .entry { margin: 0 0 3pt; }
  .entry .meta, li { break-inside: avoid; }
  ul { margin: 1.5pt 0 0; padding-left: 11pt; }
  ul.lines { margin-top: 0; }
  li { margin: 0 0 1pt; }
  .whole { white-space: nowrap; }
  .whole.long { font-size: 8.2pt; }
</style>
</head>
<body>
  <header>
    <h1>${escape(doc.name)}</h1>
    <p class="headline">${escape(doc.headline)}</p>
    <p class="contact">${contact}</p>
  </header>
  <main>${doc.sections.map(section).join("")}
  </main>
</body>
</html>
`;
}
