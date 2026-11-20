/**
 * Title, description and URL of every page, per language. Shared by the
 * build-time <head> (head.ts) and the browser, which updates the document
 * head on client-side navigation (useDocumentHead).
 */
import { publishedNotes } from "@/content/notes";
import { experiences, projects, talks } from "@/data/portfolio";
import { pagePath, type Page } from "@/i18n/routes";
import { translations, type Language } from "@/i18n/translations";

export function tr(language: Language, key: string, params?: Record<string, string | number>): string {
  const text = translations[key]?.[language] ?? key;
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}

export function currentRole() {
  return experiences.find((experience) => experience.period.en.endsWith("Present"));
}

export function seoDescription(language: Language): string {
  return tr(language, "seo.description").replace("{company}", currentRole()?.company ?? "");
}

/** Cuts text at a word boundary so it fits search result snippets. */
export function clip(text: string, max = 158): string {
  const plain = text.replace(/`/g, "");
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

export interface PageMeta {
  title: string;
  description: string;
  /** Path relative to the site URL, with a trailing slash. */
  path: string;
}

export function projectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function talkById(id: string) {
  return talks.find((talk) => talk.id === id);
}

export function pageMeta(page: Page, language: Language): PageMeta {
  const path = pagePath(language, page);
  if (page.kind === "project") {
    const project = projectById(page.id);
    if (project) {
      return {
        title: tr(language, "seo.projectTitle", { name: project.name }),
        description: clip(project.desc[language]),
        path,
      };
    }
  }
  if (page.kind === "talk") {
    const talk = talkById(page.id);
    if (talk) {
      return {
        title: tr(language, "seo.talkTitle", { title: talk.title, kind: tr(language, `talks.${talk.kind}`).toLowerCase() }),
        description: clip(talk.desc[language]),
        path,
      };
    }
  }
  if (page.kind === "now") {
    const role = currentRole();
    return {
      title: tr(language, "seo.nowTitle"),
      description: tr(language, "seo.nowDescription", { role: role?.role[language] ?? "", company: role?.company ?? "" }),
      path,
    };
  }
  if (page.kind === "notes") return { title: tr(language, "seo.notesTitle"), description: tr(language, "seo.notesDescription"), path };
  if (page.kind === "note") {
    const note = publishedNotes.find((item) => item.slug === page.id);
    if (note) return { title: tr(language, "seo.noteTitle", { title: note.title[language] }), description: clip(note.summary[language]), path };
  }
  if (page.kind === "uses") return { title: tr(language, "seo.usesTitle"), description: tr(language, "seo.usesDescription"), path };
  return { title: tr(language, "seo.title"), description: seoDescription(language), path };
}
