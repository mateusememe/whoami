// Fails when the JavaScript and CSS every page loads first grow past the
// budget. Runs after `npm run build`. Pages, the palette, covers and WebGL
// are separate chunks and do not count here.

import { readFileSync } from "fs";
import { resolve } from "path";
import { gzipSync } from "zlib";

/** Gzip budgets in kB (1 kB = 1000 bytes, as Vite reports them). */
const BUDGET = { js: 120, css: 20 };

const dist = resolve("dist");
const html = readFileSync(resolve(dist, "index.html"), "utf8");
const assets = (pattern: RegExp) => [...html.matchAll(pattern)].map((match) => match[1]);

// The entry script, the chunks it preloads and the stylesheets, as index.html references them.
const scripts = [
  ...assets(/<script type="module"[^>]*src="([^"]+\.js)"/g),
  ...assets(/<link rel="modulepreload"[^>]*href="([^"]+\.js)"/g),
];
const styles = assets(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"/g);

const gzipKb = (files: string[]) =>
  files.reduce((sum, file) => {
    const path = resolve(dist, `.${file.replace(/^.*?\/assets\//, "/assets/")}`);
    return sum + gzipSync(readFileSync(path), { level: 9 }).length / 1000;
  }, 0);

const js = gzipKb(scripts);
const css = gzipKb(styles);
const failures = [
  ...(js > BUDGET.js ? [`JavaScript: ${js.toFixed(1)} kB gzip, budget ${BUDGET.js} kB`] : []),
  ...(css > BUDGET.css ? [`CSS: ${css.toFixed(1)} kB gzip, budget ${BUDGET.css} kB`] : []),
];

if (scripts.length === 0) throw new Error("check-bundle: no entry script found in dist/index.html");
if (failures.length) {
  console.error(`✗ initial bundle over budget:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ initial bundle: ${js.toFixed(1)} / ${BUDGET.js} kB JS, ${css.toFixed(1)} / ${BUDGET.css} kB CSS (gzip)`);
