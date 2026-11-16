// Runs after `vite build` (client) and `vite build --ssr` (server entry).
//
// - dist/404.html: the empty SPA shell, so unknown paths render NotFound on
//   the client instead of hydrating the home page markup.
// - One index.html per page and language (src/i18n/routes.ts): the home page
//   at /, /pt/, /es/ and each featured project at /projects/<id>/ (and the
//   /pt/, /es/ versions), with that page's <html lang>, title, descriptions,
//   canonical URL, hreflang links and JSON-LD. Crawlers and agents get
//   content and metadata without running JavaScript.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { pathToFileURL } from "url";
import { HTML_LANG, LANGUAGES, PAGES, pagePath } from "../src/i18n/routes";
import { renderHead, replaceHead } from "../src/seo/head";
import { DEFAULT_SITE_URL } from "../src/seo/site";

const ROOT_MARKER = '<div id="root"></div>';
const LANG_MARKER = '<html lang="en">';
const distDir = resolve("dist");
const ssrDir = resolve("dist-ssr");
const siteUrl = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;

const template = readFileSync(resolve(distDir, "index.html"), "utf8");
for (const marker of [ROOT_MARKER, LANG_MARKER]) {
  if (!template.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`);
}

writeFileSync(resolve(distDir, "404.html"), template);

const { prepare, render } = (await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href)) as {
  prepare: () => Promise<void>;
  render: (path?: string) => string;
};
await prepare();

const written: string[] = [];
for (const target of PAGES) {
  for (const language of LANGUAGES) {
    const path = pagePath(language, target);
    const html = replaceHead(template, renderHead(language, siteUrl, target))
      .replace(LANG_MARKER, `<html lang="${HTML_LANG[language]}">`)
      // A function replacer: the rendered HTML may contain "$", which a string replacement would interpret.
      .replace(ROOT_MARKER, () => `<div id="root">${render(path)}</div>`);

    const file = resolve(distDir, `.${path}index.html`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    written.push(`${path}index.html (${(html.length / 1024).toFixed(0)} kB)`);
  }
}

rmSync(ssrDir, { recursive: true, force: true });
const homes = written.filter((line) => !line.includes("/projects/"));
console.log(
  `✓ prerendered ${written.length} pages: ${homes.join(", ")} and ${written.length - homes.length} project pages; 404.html shell written`,
);
