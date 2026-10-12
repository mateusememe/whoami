// Runs after `vite build` (client) and `vite build --ssr` (server entry).
//
// - dist/404.html: the empty SPA shell, so unknown paths render NotFound on
//   the client instead of hydrating the home page markup.
// - dist/index.html: the home page rendered to HTML inside #root, so crawlers
//   and agents get the content without running JavaScript.

import { readFileSync, rmSync, writeFileSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

const ROOT_MARKER = '<div id="root"></div>';
const distDir = resolve("dist");
const ssrDir = resolve("dist-ssr");

const template = readFileSync(resolve(distDir, "index.html"), "utf8");
if (!template.includes(ROOT_MARKER)) {
  throw new Error(`prerender: ${ROOT_MARKER} not found in dist/index.html`);
}

writeFileSync(resolve(distDir, "404.html"), template);

const { render } = (await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href)) as {
  render: (path?: string) => string;
};
const appHtml = render("/");
writeFileSync(resolve(distDir, "index.html"), template.replace(ROOT_MARKER, `<div id="root">${appHtml}</div>`));

rmSync(ssrDir, { recursive: true, force: true });
console.log(`✓ prerendered dist/index.html (${(appHtml.length / 1024).toFixed(1)} kB of HTML), 404.html shell written`);
