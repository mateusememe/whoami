// Runs after `vite build` (client) and `vite build --ssr` (server entry).
//
// - dist/404.html: the empty SPA shell, so unknown paths render NotFound on
//   the client instead of hydrating the home page markup.
// - dist/index.html, dist/pt/index.html, dist/es/index.html: the home page
//   rendered to HTML in each language, with that language's <html lang>,
//   title, descriptions, canonical URL, hreflang links and JSON-LD. Crawlers
//   and agents get content and metadata without running JavaScript.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { pathToFileURL } from "url";
import { HTML_LANG, LANGUAGE_PATHS, LANGUAGES } from "../src/i18n/routes";
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

const { render } = (await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href)) as {
  render: (path?: string) => string;
};

const written: string[] = [];
for (const language of LANGUAGES) {
  const path = LANGUAGE_PATHS[language];
  const html = replaceHead(template, renderHead(language, siteUrl))
    .replace(LANG_MARKER, `<html lang="${HTML_LANG[language]}">`)
    // A function replacer: the rendered HTML may contain "$", which a string replacement would interpret.
    .replace(ROOT_MARKER, () => `<div id="root">${render(path)}</div>`);

  const file = resolve(distDir, `.${path}index.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  written.push(`${path}index.html (${(html.length / 1024).toFixed(0)} kB)`);
}

rmSync(ssrDir, { recursive: true, force: true });
console.log(`✓ prerendered ${written.join(", ")}; 404.html shell written`);
