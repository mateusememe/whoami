// Prints the résumé (src/cv/cv.ts) to one PDF per language with headless
// Chrome. Runs after the prerender in `npm run build` (output in dist/cv/);
// `npm run cv` writes them to public/cv/ for the dev server instead.
//
// Without Chrome it warns and skips locally; in CI (CI=true) it fails.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join, resolve } from "path";
import { pathToFileURL } from "url";
import { buildCv, renderCvHtml } from "../src/cv/cv";
import { LANGUAGES } from "../src/i18n/routes";
import { CV_FILES } from "../src/seo/files";
import { DEFAULT_SITE_URL } from "../src/seo/site";
import { baseFlags, findChrome, runChrome } from "./chrome";

const outDir = resolve(process.argv[2] ?? "dist");
const siteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
const font = (weight: number) =>
  pathToFileURL(resolve("node_modules", `@fontsource/inter/files/inter-latin-${weight}-normal.woff2`)).href;

const chrome = findChrome();
if (!chrome) {
  if (process.env.CI) throw new Error("render-cv: Chrome not found (set CHROME_PATH)");
  console.warn("⚠ render-cv: Chrome not found, résumé PDFs skipped (set CHROME_PATH)");
  process.exit(0);
}

const workdir = mkdtempSync(join(tmpdir(), "cv-"));
try {
  for (const language of LANGUAGES) {
    const html = renderCvHtml(buildCv(language, siteUrl), { regular: font(400), semibold: font(600), bold: font(700) });
    const htmlPath = join(workdir, `cv.${language}.html`);
    const output = resolve(outDir, CV_FILES[language]);
    writeFileSync(htmlPath, html);
    mkdirSync(dirname(output), { recursive: true });
    rmSync(output, { force: true });
    await runChrome(
      chrome,
      [
        ...baseFlags(join(workdir, `profile-${language}`)),
        "--no-pdf-header-footer",
        "--export-tagged-pdf",
        "--generate-pdf-document-outline",
        "--virtual-time-budget=5000",
        `--print-to-pdf=${output}`,
        pathToFileURL(htmlPath).href,
      ],
      output,
    );
    console.log(`✓ ${CV_FILES[language]} written`);
  }
} finally {
  rmSync(workdir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
