/**
 * Notes (the blog): metadata here, one Markdown body per language next to
 * it, in src/content/notes/<slug>/{en,pt,es}.md, without front matter.
 * Bodies load with the note page chunk, never with the main bundle.
 *
 * A note with `draft: true` shows on the dev server (`npm run dev`) and is
 * left out of the build: no route, no prerendered page, no sitemap entry,
 * no feed item. With no published note, /notes/ and every link to it stay
 * hidden. Steps to add one: docs/ARCHITECTURE.md, "Add a note".
 */
import type { LocalizedString } from "@/data/portfolio";

export interface NoteMeta {
  /** URL segment: /notes/<slug>/. Also the folder of the Markdown files. */
  slug: string;
  /** Publication date, `YYYY-MM-DD`. */
  date: string;
  /** Last substantive edit, `YYYY-MM-DD`, when after the publication. */
  updated?: string;
  title: LocalizedString;
  /** One or two sentences for the list, the meta description and the feeds. */
  summary: LocalizedString;
  tags: string[];
  draft?: boolean;
}

/** Newest first. */
export const notes: NoteMeta[] = [];

/** True on the dev server only: drafts are previewed there and nowhere else. */
const previewDrafts = (import.meta as { env?: { MODE?: string } }).env?.MODE === "development";

/** The notes that get a page, newest first. */
export const publishedNotes: NoteMeta[] = notes.filter((note) => !note.draft || previewDrafts);
