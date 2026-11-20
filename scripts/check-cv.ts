// Reads the résumé PDFs back the way an applicant tracking system does
// (text extraction, no layout) and fails when something a parser needs is
// missing or garbled. Runs after render-cv.ts in `npm run build`.
//
// Checks, per language: at most two pages; the PDF title; name, email and
// every company present; the section headings, in their language and in
// order; every bullet of every entry readable as one run of text; and no
// ligature glyph or replacement character.

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { buildCv } from "../src/cv/cv";
import { experiences, profile } from "../src/data/portfolio";
import { LANGUAGES } from "../src/i18n/routes";
import { CV_FILES } from "../src/seo/files";
import { DEFAULT_SITE_URL } from "../src/seo/site";

const outDir = resolve(process.argv[2] ?? "dist");
const siteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
const MAX_PAGES = 2;

/** Plain text of a PDF, page by page, as pdf.js extracts it. */
async function extract(path: string): Promise<{ pages: number; title: string; text: string }> {
  const pdf = await getDocument({ data: new Uint8Array(readFileSync(path)), useSystemFonts: false }).promise;
  const meta = await pdf.getMetadata();
  let text = "";
  for (let index = 1; index <= pdf.numPages; index++) {
    const content = await (await pdf.getPage(index)).getTextContent();
    for (const item of content.items) {
      if ("str" in item) text += item.str + (item.hasEOL ? "\n" : "");
    }
    text += "\n";
  }
  const title = (meta.info as { Title?: string }).Title ?? "";
  await pdf.destroy();
  return { pages: pdf.numPages, title, text };
}

const flat = (text: string) => text.replace(/\s+/g, " ").trim();

const missing = LANGUAGES.filter((language) => !existsSync(resolve(outDir, CV_FILES[language])));
if (missing.length) {
  if (process.env.CI) throw new Error(`check-cv: missing ${missing.map((language) => CV_FILES[language]).join(", ")}`);
  console.warn("⚠ check-cv: résumé PDFs not found, check skipped");
  process.exit(0);
}

const failures: string[] = [];
for (const language of LANGUAGES) {
  const doc = buildCv(language, siteUrl);
  const { pages, title, text } = await extract(resolve(outDir, CV_FILES[language]));
  const body = flat(text);
  const fail = (message: string) => failures.push(`${CV_FILES[language]}: ${message}`);

  if (pages > MAX_PAGES) fail(`${pages} pages (max ${MAX_PAGES})`);
  if (title !== doc.title) fail(`PDF title is "${title}", expected "${doc.title}"`);
  if (/[ﬀ-ﬆ]/.test(text)) fail("contains ligature glyphs (fi, fl…), which parsers misread");
  if (text.includes("�")) fail("contains replacement characters");

  for (const value of [profile.name, ...doc.contact.map((item) => item.text), ...experiences.map((item) => item.company)]) {
    if (!body.includes(value)) fail(`missing "${value}"`);
  }

  // Headings stand on their own line, in the order of the document.
  const lines = text.split("\n").map((line) => line.trim());
  let previous = -1;
  for (const section of doc.sections) {
    const at = lines.indexOf(section.heading);
    if (at === -1) fail(`heading "${section.heading}" not found on its own line`);
    else if (at < previous) fail(`heading "${section.heading}" out of order`);
    previous = Math.max(previous, at);

    // Every bullet and line comes out whole, words in order.
    for (const line of [...(section.lines ?? []), ...(section.entries ?? []).flatMap((entry) => entry.bullets ?? [])]) {
      if (!body.includes(flat(line))) fail(`text not extracted whole: "${line.slice(0, 60)}…"`);
    }
  }

  console.log(`✓ ${CV_FILES[language]}: ${pages} pages, ${body.split(" ").length} words, ${doc.sections.length} sections in order`);
}

if (failures.length) {
  console.error(`✗ résumé check failed:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
