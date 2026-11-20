/**
 * The Markdown bodies of the notes, bundled with the note page chunk (eager,
 * so a prerendered note renders synchronously and hydrates the same HTML).
 */
import { Marked } from "marked";
import type { Language } from "@/i18n/translations";

const files = import.meta.glob("./*/*.md", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

const marked = new Marked({ gfm: true, async: false });

/** Markdown of a note in a language, or undefined when the file is missing. */
export function noteMarkdown(slug: string, language: Language): string | undefined {
  return files[`./${slug}/${language}.md`];
}

/** Markdown to HTML. The notes are written in this repository, so the HTML is trusted. */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}

/** Slugs and languages that have a body, for the parity test. */
export const noteFiles = Object.keys(files);
