/**
 * Atom feed of the notes, one per language (feed.xml, feed.pt.xml,
 * feed.es.xml). Written by `npm run generate` only when there is a
 * published note; the page heads link it under the same condition.
 */
import { profile } from "@/data/portfolio";
import type { NoteMeta } from "@/content/notes";
import { pagePath } from "@/i18n/routes";
import { translations, type Language } from "@/i18n/translations";
import { siteHref } from "@/seo/site";

export const FEED_FILES: Record<Language, string> = { en: "feed.xml", pt: "feed.pt.xml", es: "feed.es.xml" };

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** `2026-11-20` → `2026-11-20T00:00:00Z` (Atom needs a full timestamp). */
const timestamp = (date: string) => `${date}T00:00:00Z`;

export function renderAtomFeed(language: Language, siteUrl: string, notes: NoteMeta[]): string {
  const feedUrl = siteHref(siteUrl, FEED_FILES[language]);
  const blogUrl = siteHref(siteUrl, pagePath(language, { kind: "notes" }));
  const updated = notes.map((note) => note.updated ?? note.date).sort().at(-1) ?? profile.updatedAt;
  const title = translations["seo.notesTitle"][language];
  const entries = notes.map((note) => {
    const url = siteHref(siteUrl, pagePath(language, { kind: "note", id: note.slug }));
    return [
      "  <entry>",
      `    <id>${escape(url)}</id>`,
      `    <title>${escape(note.title[language])}</title>`,
      `    <link rel="alternate" type="text/html" href="${escape(url)}"/>`,
      `    <published>${timestamp(note.date)}</published>`,
      `    <updated>${timestamp(note.updated ?? note.date)}</updated>`,
      `    <summary>${escape(note.summary[language])}</summary>`,
      ...note.tags.map((tag) => `    <category term="${escape(tag)}"/>`),
      "  </entry>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${language === "pt" ? "pt-BR" : language}">`,
    `  <id>${escape(blogUrl)}</id>`,
    `  <title>${escape(title)}</title>`,
    `  <link rel="self" type="application/atom+xml" href="${escape(feedUrl)}"/>`,
    `  <link rel="alternate" type="text/html" href="${escape(blogUrl)}"/>`,
    `  <updated>${timestamp(updated)}</updated>`,
    `  <author><name>${escape(profile.name)}</name><uri>${escape(siteHref(siteUrl))}</uri></author>`,
    ...entries,
    "</feed>",
    "",
  ].join("\n");
}
