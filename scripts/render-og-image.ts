// Renders the share cards (1200x630), one per language: public/og-image.png
// (English), og-image.pt.png and og-image.es.png.
//
// The card follows the site: the name in Space Grotesk, the role in
// Instrument Serif, labels in JetBrains Mono, and the dot-matrix portrait
// from the About scene, sampled from the profile photo on a canvas. Fonts
// load from node_modules and the photo is inlined, so the render needs no
// network. Headless Chrome takes the screenshot.
//
// Manual step, not part of the build: `npm run og:image`.
// Set CHROME_PATH if Chrome is not at a usual location (scripts/chrome.ts).

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { pathToFileURL } from "url";
import { projects, talks } from "../src/data/portfolio";
import { LANGUAGES } from "../src/i18n/routes";
import { translations, type Language } from "../src/i18n/translations";
import { OG_IMAGE_FILES } from "../src/seo/files";
import { DEFAULT_SITE_URL, SITE_NAME } from "../src/seo/site";
import { baseFlags, findChrome, runChrome } from "./chrome";

const WIDTH = 1200;
const HEIGHT = 630;

// Dark theme tokens (src/index.css)
const BG = "#141414";
const FG = "#ededed";
const MUTED = "#8c8c8c";
const SIGNAL = "#34d5c0";

const tr = (language: Language, key: string) => translations[key]?.[language] ?? key;
const font = (path: string) => pathToFileURL(resolve("node_modules", path)).href;

/** Short counts line, e.g. "17 projects · 4 workshops". */
const COUNTS: Record<Language, (repos: number, workshops: number) => string> = {
  en: (repos, workshops) => `${repos} projects · ${workshops} workshops`,
  pt: (repos, workshops) => `${repos} projetos · ${workshops} minicursos`,
  es: (repos, workshops) => `${repos} proyectos · ${workshops} talleres`,
};

function cardHtml(language: Language): string {
  const segments = tr(language, "hero.subtitle").split(" | ");
  const photo = `data:image/jpeg;base64,${readFileSync(resolve("public/images/profile-avatar.jpg")).toString("base64")}`;
  const host = DEFAULT_SITE_URL.replace(/^https?:\/\//, "");
  const [first, ...rest] = SITE_NAME.split(" ");

  return `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8">
<style>
  @font-face { font-family: "Space Grotesk"; font-weight: 300 700; src: url("${font("@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "JetBrains Mono"; font-weight: 100 800; src: url("${font("@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "Instrument Serif"; font-style: italic; src: url("${font("@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2")}") format("woff2"); }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${BG}; color: ${FG}; }
  body { position: relative; }
  .glow { position: absolute; right: -120px; top: -40px; width: 760px; height: 760px; background: radial-gradient(circle, ${SIGNAL}14 0%, transparent 62%); }
  canvas { position: absolute; right: 50px; top: 45px; width: 540px; height: 540px; }
  .label { font: 500 14px "JetBrains Mono", monospace; letter-spacing: .22em; text-transform: uppercase; color: ${MUTED}; }
  .top { position: absolute; left: 72px; right: 72px; top: 52px; display: flex; justify-content: space-between; }
  .content { position: absolute; left: 72px; top: 104px; width: 640px; }
  .prompt { font: 500 24px "JetBrains Mono", monospace; color: ${SIGNAL}; margin-bottom: 20px; }
  .prompt span { color: ${MUTED}; }
  .caret { display: inline-block; width: 13px; height: 25px; margin-left: 7px; transform: translateY(4px); background: ${SIGNAL}; opacity: .85; }
  h1 { font: 600 88px/0.9 "Space Grotesk", sans-serif; letter-spacing: -0.045em; }
  .role { margin-top: 26px; font: italic 40px/1 "Instrument Serif", serif; color: ${FG}; }
  .facts { margin-top: 16px; font: 400 17px/1.6 "JetBrains Mono", monospace; color: ${MUTED}; }
  .bottom { position: absolute; left: 72px; right: 72px; bottom: 46px; display: flex; justify-content: space-between; align-items: baseline; }
  .url { font: 500 18px "JetBrains Mono", monospace; color: ${SIGNAL}; }
</style></head>
<body>
  <div class="glow"></div>
  <canvas id="portrait" width="1120" height="1120"></canvas>
  <div class="top label"><span>~/whoami</span><span>${tr(language, "hero.location")}</span></div>
  <div class="content">
    <p class="prompt"><span>$</span> whoami<i class="caret"></i></p>
    <h1>${first}<br>${rest.join("<br>")}</h1>
    <p class="role">${tr(language, "hero.title")}</p>
    <p class="facts">${segments[0]}<br>${segments.slice(2).join(" · ")}</p>
  </div>
  <div class="bottom"><span class="url">${host}</span><span class="label">${COUNTS[language](projects.length, talks.length)}</span></div>
  <script>
    // Dot-matrix portrait, as in the About scene: one dot per cell, size and
    // opacity from brightness, faded by an elliptical vignette.
    const image = new Image();
    image.onload = () => {
      const grid = 84;
      const sample = document.createElement("canvas");
      sample.width = sample.height = grid;
      const sctx = sample.getContext("2d");
      // Head and shoulders: a square crop a little above the center.
      const side = image.width * 0.74;
      sctx.drawImage(image, (image.width - side) / 2, image.height * 0.04, side, side, 0, 0, grid, grid);
      const pixels = sctx.getImageData(0, 0, grid, grid).data;
      const canvas = document.getElementById("portrait");
      const ctx = canvas.getContext("2d");
      const cell = canvas.width / grid;
      let seed = 7;
      const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let y = 0; y < grid; y++) {
        for (let x = 0; x < grid; x++) {
          const i = (y * grid + x) * 4;
          const lum = (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]) / 255;
          // The studio wall sits in the midtones; a steep curve pushes it back
          // and keeps the face and shirt edges.
          const t = Math.min(1, Math.max(0, (lum - 0.2) / 0.62));
          const tone = t * t * (3 - 2 * t);
          const dx = (x + 0.5) / grid - 0.5, dy = (y + 0.5) / grid - 0.44;
          const mask = Math.max(0, Math.min(1, 1.5 - Math.hypot(dx / 0.4, dy / 0.5) * 1.1));
          // Every cell keeps a faint dot, so the grid reads as one surface.
          const alpha = (0.07 + 0.93 * tone) * mask;
          if (alpha < 0.03) continue;
          const accent = random() < 0.045;
          ctx.fillStyle = accent ? "${SIGNAL}" : "${FG}";
          ctx.globalAlpha = Math.min(1, alpha * 1.15);
          ctx.beginPath();
          ctx.arc((x + 0.5) * cell, (y + 0.5) * cell, cell * (0.1 + 0.34 * tone), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      document.body.dataset.ready = "1";
    };
    image.src = "${photo}";
  </script>
</body></html>`;
}

async function screenshot(htmlPath: string, output: string, profileDir: string): Promise<void> {
  const chrome = findChrome();
  if (!chrome) throw new Error("Chrome not found: set CHROME_PATH");
  await runChrome(
    chrome,
    [
      ...baseFlags(profileDir),
      "--force-device-scale-factor=1",
      `--window-size=${WIDTH},${HEIGHT}`,
      "--virtual-time-budget=5000",
      `--screenshot=${output}`,
      pathToFileURL(htmlPath).href,
    ],
    output,
  );
}

const workdir = mkdtempSync(join(tmpdir(), "og-"));

try {
  for (const language of LANGUAGES) {
    const htmlPath = join(workdir, `card.${language}.html`);
    const output = resolve("public", OG_IMAGE_FILES[language]);
    writeFileSync(htmlPath, cardHtml(language));
    await screenshot(htmlPath, output, join(workdir, `profile-${language}`));
    console.log(`✓ ${OG_IMAGE_FILES[language]} written (${WIDTH}x${HEIGHT})`);
  }
} finally {
  rmSync(workdir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
