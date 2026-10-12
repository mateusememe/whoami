// Renders public/og-image.png (1200x630), the Open Graph / Twitter card.
//
// The background is the same seeded service mesh as the WebGL scene,
// projected to SVG. Text comes from the translations. Headless Chrome takes
// the screenshot, so fonts and layout match the site.
//
// Manual step, not part of the build: `npm run og:image`.
// Set CHROME_PATH if Chrome is not at the default macOS location.

import { spawn } from "child_process";
import { existsSync, mkdtempSync, rmSync, statSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { pathToFileURL } from "url";
import { translations } from "../src/i18n/translations";
import { buildMeshGraph, buildPackets } from "../src/webgl/scene/graph";
import { createRng } from "../src/webgl/core/random";
import { DEFAULT_SITE_URL, SITE_NAME } from "../src/seo/site";

const WIDTH = 1200;
const HEIGHT = 630;
const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Dark theme tokens (src/index.css)
const BG = "#141414";
const FG = "#d9d9d9";
const MUTED = "#8c8c8c";
const SIGNAL = "#34d5c0";

function meshSvg(): string {
  const graph = buildMeshGraph({ clusters: 7, nodesPerCluster: 18 });
  const packets = buildPackets(graph);
  const rng = createRng(5);

  // Same camera as the engine at scroll 0: rotation, then perspective.
  const ry = 0.55;
  const rx = 0.28;
  const distance = 15;
  const focal = HEIGHT / 2 / Math.tan((50 * Math.PI) / 360);
  const project = (x: number, y: number, z: number) => {
    const x1 = x * Math.cos(ry) + z * Math.sin(ry);
    const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
    const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
    const depth = distance - z2;
    // Shift the mesh right so it sits behind the photo and leaves the text clear.
    return { x: WIDTH * 0.62 + (x1 * focal) / depth, y: HEIGHT / 2 - (y2 * focal) / depth, depth };
  };
  const fade = (depth: number) => Math.max(0.2, Math.min(1, 1.35 - depth / 24));
  const node = (i: number) =>
    project(graph.positions[i * 3], graph.positions[i * 3 + 1], graph.positions[i * 3 + 2]);

  const parts: string[] = [];

  // Binary field
  for (let i = 0; i < 140; i++) {
    const glyph = rng() < 0.5 ? "0" : "1";
    const size = 10 + rng() * 10;
    parts.push(
      `<text x="${(rng() * WIDTH).toFixed(1)}" y="${(rng() * HEIGHT).toFixed(1)}" font-size="${size.toFixed(1)}" fill="${FG}" fill-opacity="${(0.05 + rng() * 0.1).toFixed(2)}">${glyph}</text>`,
    );
  }

  // Edges
  for (let e = 0; e < graph.edges.length / 2; e++) {
    const a = node(graph.edges[e * 2]);
    const b = node(graph.edges[e * 2 + 1]);
    const backbone = e < graph.backboneEdges;
    const alpha = (backbone ? 0.35 : 0.16) * fade((a.depth + b.depth) / 2);
    parts.push(
      `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${backbone ? SIGNAL : FG}" stroke-opacity="${alpha.toFixed(3)}" stroke-width="1"/>`,
    );
  }

  // Nodes
  for (let i = 0; i < graph.nodeCount; i++) {
    const p = node(i);
    const gateway = graph.kinds[i] === 1;
    const r = (gateway ? 5 : 2.2 * graph.sizes[i]) * (15 / p.depth);
    const alpha = fade(p.depth);
    if (gateway) {
      parts.push(
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(r * 2.2).toFixed(1)}" fill="none" stroke="${SIGNAL}" stroke-opacity="${(0.55 * alpha).toFixed(2)}" stroke-width="1.5"/>`,
      );
    }
    parts.push(
      `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${gateway ? SIGNAL : FG}" fill-opacity="${(0.85 * alpha).toFixed(2)}" filter="url(#glow)"/>`,
    );
  }

  // Packets frozen mid-flight
  for (let p = 0; p < packets.count; p++) {
    const t = packets.phases[p];
    const s = packets.starts;
    const e = packets.ends;
    const q = project(
      s[p * 3] + (e[p * 3] - s[p * 3]) * t,
      s[p * 3 + 1] + (e[p * 3 + 1] - s[p * 3 + 1]) * t,
      s[p * 3 + 2] + (e[p * 3 + 2] - s[p * 3 + 2]) * t,
    );
    const alpha = Math.sin(t * Math.PI) * fade(q.depth);
    parts.push(
      `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="2.4" fill="${SIGNAL}" fill-opacity="${alpha.toFixed(2)}" filter="url(#glow)"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="JetBrains Mono, monospace">
  <defs><filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  ${parts.join("\n  ")}
</svg>`;
}

function cardHtml(): string {
  const title = translations["hero.title"].en;
  const segments = translations["hero.subtitle"].en.split(" | ");
  const avatar = pathToFileURL(resolve("public/images/profile-avatar.jpg")).href;
  const host = DEFAULT_SITE_URL.replace(/^https?:\/\//, "");

  return `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;700&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${BG}; }
  .mesh { position: absolute; inset: 0; }
  .vignette { position: absolute; inset: 0; background: linear-gradient(90deg, ${BG} 0%, ${BG}f2 38%, ${BG}66 62%, transparent 100%); }
  .content { position: absolute; left: 72px; top: 0; bottom: 0; width: 640px; display: flex; flex-direction: column; justify-content: center; }
  .prompt { font: 500 26px "JetBrains Mono", monospace; color: ${SIGNAL}; margin-bottom: 18px; }
  .prompt span { color: ${MUTED}; }
  .caret { display: inline-block; width: 15px; height: 26px; margin-left: 6px; transform: translateY(4px); background: ${SIGNAL}; opacity: .85; }
  h1 { font: 700 68px/1.02 "Space Grotesk", sans-serif; color: #ededed; letter-spacing: -1.5px; margin-bottom: 22px; }
  .role { font: 500 22px "JetBrains Mono", monospace; color: ${FG}; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 18px; }
  .meta { font: 400 19px/1.55 "JetBrains Mono", monospace; color: ${MUTED}; }
  .url { position: absolute; left: 72px; bottom: 44px; font: 500 18px "JetBrains Mono", monospace; color: ${SIGNAL}; }
  .photo { position: absolute; right: 84px; top: 50%; width: 300px; height: 300px; transform: translateY(-50%); border-radius: 44px; padding: 6px; background: rgba(30,30,30,.7); box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 0 70px ${SIGNAL}40; }
  .photo img { width: 100%; height: 100%; object-fit: cover; border-radius: 38px; display: block; }
</style></head>
<body>
  <div class="mesh">${meshSvg()}</div>
  <div class="vignette"></div>
  <div class="content">
    <p class="prompt"><span>$</span> whoami<i class="caret"></i></p>
    <h1>${SITE_NAME.replace(" Monteiro", "<br>Monteiro")}</h1>
    <p class="role">${title}</p>
    <p class="meta">${segments[0]}<br>${segments[1]}<br>${segments.slice(2).join(" · ")}</p>
  </div>
  <p class="url">${host}</p>
  <div class="photo"><img src="${avatar}" alt=""></div>
</body></html>`;
}

/**
 * Headless Chrome on macOS can keep running after it writes the screenshot,
 * so wait for a fresh file and stop the process ourselves.
 */
async function screenshot(htmlPath: string, output: string, profileDir: string): Promise<void> {
  const startedAt = Date.now();
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--allow-file-access-from-files",
      `--user-data-dir=${profileDir}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      "--virtual-time-budget=5000",
      `--screenshot=${output}`,
      pathToFileURL(htmlPath).href,
    ],
    { stdio: "ignore" },
  );

  try {
    for (let waited = 0; waited < 60_000; waited += 250) {
      if (existsSync(output) && statSync(output).mtimeMs >= startedAt && statSync(output).size > 0) {
        await new Promise((r) => setTimeout(r, 500)); // let the write finish
        return;
      }
      if (chrome.exitCode !== null) throw new Error(`Chrome exited with code ${chrome.exitCode}`);
      await new Promise((r) => setTimeout(r, 250));
    }
    throw new Error("Timed out waiting for the screenshot");
  } finally {
    if (chrome.exitCode === null) {
      const exited = new Promise((r) => chrome.once("exit", r));
      chrome.kill();
      await exited;
    }
  }
}

const workdir = mkdtempSync(join(tmpdir(), "og-"));
const htmlPath = join(workdir, "card.html");
const output = resolve("public/og-image.png");

try {
  writeFileSync(htmlPath, cardHtml());
  await screenshot(htmlPath, output, join(workdir, "profile"));
  console.log(`✓ og-image.png written (${WIDTH}x${HEIGHT})`);
} finally {
  rmSync(workdir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
