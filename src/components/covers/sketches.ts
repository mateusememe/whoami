/**
 * Project covers: one small canvas animation per featured project, each
 * showing what the project does (a puzzle being solved, a tree rebalancing,
 * a nearest-neighbour search, a shape thinning to its skeleton...). Every sketch is a pure function of time, so
 * it loops, pauses and renders a still frame for reduced motion for free.
 *
 * Loaded on demand by ProjectCover, so this file stays out of the main bundle.
 */
import { createRng, gaussian } from "@/webgl/core/random";
import {
  avlLayouts,
  fuzzyCMeans,
  manhattan,
  nearest,
  rasterize,
  scramble,
  solvePuzzle,
  zhangSuen,
  type Board,
  type FcmStep,
  type TreeLayout,
} from "@/components/covers/algorithms";

/** CSS color tokens as raw HSL triples (`"172 66% 52%"`). */
export interface SketchColors {
  fg: string;
  muted: string;
  signal: string;
  card: string;
}

export interface SketchFrame {
  ctx: CanvasRenderingContext2D;
  /** Canvas size in CSS pixels. */
  w: number;
  h: number;
  /** Seconds since the cover became visible. */
  t: number;
  colors: SketchColors;
}

export type Sketch = (frame: SketchFrame) => void;

export function readSketchColors(root: HTMLElement = document.documentElement): SketchColors {
  const style = getComputedStyle(root);
  const token = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    fg: token("--foreground", "0 0% 85%"),
    muted: token("--muted-foreground", "0 0% 55%"),
    signal: token("--signal", "172 66% 52%"),
    card: token("--card", "0 0% 11%"),
  };
}

// ---------- helpers ----------

const hsl = (token: string, alpha = 1) => `hsl(${token} / ${alpha})`;
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mono = (size: number, weight = 500) => `${weight} ${size}px "JetBrains Mono Variable", ui-monospace, monospace`;
const textSize = (w: number) => Math.min(Math.max(w / 40, 9), 12.5);

/** Computes a value once, on first use. */
function lazy<T>(create: () => T): () => T {
  let value: T | undefined;
  return () => (value ??= create());
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}

function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  size: number,
  align: CanvasTextAlign = "left",
): void {
  ctx.font = mono(size);
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// ---------- 8-puzzle: A* solving a scrambled board ----------

const puzzlePath = lazy<Board[]>(() => solvePuzzle(scramble(30)));

const puzzle: Sketch = ({ ctx, w, h, t, colors }) => {
  const path = puzzlePath();
  const steps = path.length - 1;
  const stepTime = 0.42;
  const local = t % (steps * stepTime + 2);
  const index = Math.min(Math.floor(local / stepTime), steps);
  const solved = index === steps;
  const frac = solved ? 0 : ease((local - index * stepTime) / stepTime);
  const from = path[index];
  const to = path[Math.min(index + 1, steps)];

  const size = Math.min(w * 0.44, h * 0.74);
  const cell = size / 3;
  const gap = cell * 0.07;
  const x0 = w * 0.09;
  const y0 = (h - size) / 2;

  for (let value = 1; value <= 8; value++) {
    const a = from.indexOf(value);
    const b = to.indexOf(value);
    const moving = a !== b;
    const x = x0 + lerp(a % 3, b % 3, frac) * cell;
    const y = y0 + lerp(Math.floor(a / 3), Math.floor(b / 3), frac) * cell;
    const lit = moving || solved;

    roundedRect(ctx, x + gap, y + gap, cell - gap * 2, cell - gap * 2, cell * 0.14);
    ctx.fillStyle = lit ? hsl(colors.signal, 0.14) : hsl(colors.fg, 0.05);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = lit ? hsl(colors.signal, 0.85) : hsl(colors.fg, 0.28);
    ctx.stroke();
    label(ctx, String(value), x + cell / 2, y + cell / 2 + 1, lit ? hsl(colors.signal) : hsl(colors.fg, 0.9), cell * 0.36, "center");
  }

  const size10 = textSize(w);
  const tx = x0 + size + w * 0.07;
  const distance = manhattan(from);
  const lines: Array<[string, string]> = [
    ["A*", hsl(colors.fg, 0.9)],
    [`g(n) = ${String(index).padStart(2, "0")}`, hsl(colors.muted)],
    [`h(n) = ${String(distance).padStart(2, "0")}`, hsl(colors.muted)],
    [`f(n) = ${String(index + distance).padStart(2, "0")}`, hsl(colors.fg, 0.9)],
    [solved ? "solved" : "searching", solved ? hsl(colors.signal) : hsl(colors.muted, 0.7)],
  ];
  lines.forEach(([text, color], i) => label(ctx, text, tx, h / 2 + (i - 2) * size10 * 2, color, i === 0 ? size10 * 1.5 : size10));
};

// ---------- git-github-in-action: branches, commits, merges ----------

const GIT_LANES = [0.52, 0.27, 0.77];
const GIT_COMMITS: Array<{ lane: number; x: number }> = [
  { lane: 0, x: 0.1 },
  { lane: 0, x: 0.24 },
  { lane: 1, x: 0.33 },
  { lane: 1, x: 0.45 },
  { lane: 0, x: 0.42 },
  { lane: 0, x: 0.58 },
  { lane: 2, x: 0.66 },
  { lane: 2, x: 0.76 },
  { lane: 0, x: 0.72 },
  { lane: 0, x: 0.9 },
];
const GIT_LINKS: Array<[number, number]> = [
  [0, 1],
  [1, 4],
  [4, 5],
  [5, 8],
  [8, 9],
  [1, 2],
  [2, 3],
  [3, 5],
  [5, 6],
  [6, 7],
  [7, 9],
];

const git: Sketch = ({ ctx, w, h, t, colors }) => {
  const reveal = Math.min((t % 7.5) / 5, 1.12);
  const size = textSize(w);
  const px = (commit: { lane: number; x: number }) => ({ x: commit.x * w, y: GIT_LANES[commit.lane] * h });

  ["main", "feature/api", "hotfix"].forEach((name, lane) => {
    label(ctx, name, w * 0.06, GIT_LANES[lane] * h - size * 1.9, hsl(colors.muted, lane === 0 ? 0.9 : 0.6), size);
  });

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w * reveal, h);
  ctx.clip();
  ctx.lineWidth = 1.5;
  for (const [fromIndex, toIndex] of GIT_LINKS) {
    const a = px(GIT_COMMITS[fromIndex]);
    const b = px(GIT_COMMITS[toIndex]);
    const main = GIT_COMMITS[fromIndex].lane === 0 && GIT_COMMITS[toIndex].lane === 0;
    ctx.strokeStyle = main ? hsl(colors.fg, 0.55) : hsl(colors.signal, 0.7);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    const mid = (a.x + b.x) / 2;
    ctx.bezierCurveTo(mid, a.y, mid, b.y, b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();

  let head = GIT_COMMITS[0];
  for (const commit of GIT_COMMITS) {
    const pop = ease(clamp01((reveal - commit.x) * 9));
    if (pop <= 0) continue;
    if (commit.lane === 0 && commit.x > head.x) head = commit;
    const { x, y } = px(commit);
    ctx.beginPath();
    ctx.arc(x, y, Math.min(w, h) * 0.022 * pop, 0, Math.PI * 2);
    ctx.fillStyle = hsl(colors.card);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = commit.lane === 0 ? hsl(colors.fg, 0.9) : hsl(colors.signal);
    ctx.stroke();
  }

  const at = px(head);
  label(ctx, "HEAD", at.x, at.y + size * 2.4, hsl(colors.signal), size, "center");
};

// ---------- codecash: GraphQL API with a Redis cache in front of PostgreSQL ----------

type Hop = [from: number, to: number, start: number, end: number];
const FLOW_NODES: Array<{ name: string; x: number; y: number }> = [
  { name: "client", x: 0.15, y: 0.5 },
  { name: "GraphQL API", x: 0.47, y: 0.5 },
  { name: "Redis", x: 0.82, y: 0.25 },
  { name: "PostgreSQL", x: 0.82, y: 0.75 },
];
const FLOW_MISS: Hop[] = [
  [0, 1, 0, 0.16],
  [1, 2, 0.16, 0.3],
  [1, 3, 0.34, 0.5],
  [3, 1, 0.5, 0.66],
  [1, 2, 0.68, 0.8],
  [1, 0, 0.82, 1],
];
const FLOW_HIT: Hop[] = [
  [0, 1, 0, 0.26],
  [1, 2, 0.26, 0.5],
  [2, 1, 0.5, 0.74],
  [1, 0, 0.76, 1],
];

const flow: Sketch = ({ ctx, w, h, t, colors }) => {
  const local = t % 8.4;
  const miss = local < 4.2;
  const hops = miss ? FLOW_MISS : FLOW_HIT;
  const u = miss ? local / 4.2 : ((local - 4.2) % 2.1) / 2.1;
  const size = textSize(w);
  const boxW = w * 0.21;
  const boxH = Math.max(h * 0.17, size * 2.6);
  const at = (i: number) => ({ x: FLOW_NODES[i].x * w, y: FLOW_NODES[i].y * h });

  const active = hops.find(([, , start, end]) => u >= start && u < end);

  ctx.lineWidth = 1;
  for (const [a, b] of [
    [0, 1],
    [1, 2],
    [1, 3],
  ]) {
    const on = active && ((active[0] === a && active[1] === b) || (active[0] === b && active[1] === a));
    ctx.strokeStyle = on ? hsl(colors.signal, 0.9) : hsl(colors.fg, 0.2);
    ctx.setLineDash(on ? [] : [3, 4]);
    ctx.beginPath();
    ctx.moveTo(at(a).x, at(a).y);
    ctx.lineTo(at(b).x, at(b).y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  FLOW_NODES.forEach((node, i) => {
    const { x, y } = at(i);
    const on = active && (active[0] === i || active[1] === i);
    roundedRect(ctx, x - boxW / 2, y - boxH / 2, boxW, boxH, 8);
    ctx.fillStyle = hsl(colors.card);
    ctx.fill();
    ctx.strokeStyle = on ? hsl(colors.signal, 0.9) : hsl(colors.fg, 0.3);
    ctx.stroke();
    label(ctx, node.name, x, y + 1, on ? hsl(colors.fg) : hsl(colors.muted), size, "center");
  });

  if (active) {
    const [a, b, start, end] = active;
    const k = ease((u - start) / (end - start));
    ctx.beginPath();
    ctx.arc(lerp(at(a).x, at(b).x, k), lerp(at(a).y, at(b).y, k), 4.5, 0, Math.PI * 2);
    ctx.fillStyle = hsl(colors.signal);
    ctx.fill();
  }

  const status = miss ? (u < 0.32 ? "cache lookup" : "MISS  →  PostgreSQL  ·  41 ms") : "HIT  ·  3 ms";
  label(ctx, status, w * 0.06, h * 0.9, miss ? hsl(colors.muted) : hsl(colors.signal), size);
};

// ---------- rinha-backend-2026-c: fraud detection by nearest-neighbour search ----------

const knnPoints = lazy(() => {
  const rng = createRng(26);
  return Array.from({ length: 150 }, () => {
    const fraud = rng() < 0.3;
    // Fraud clusters toward one corner, so nearby queries tend to vote the same way.
    const x = fraud ? 0.55 + rng() * 0.45 : rng();
    const y = fraud ? rng() * 0.55 : rng();
    return { x, y, fraud };
  });
});

const knn: Sketch = ({ ctx, w, h, t, colors }) => {
  const points = knnPoints();
  const cycleTime = 2.8;
  const cycle = Math.floor(t / cycleTime);
  const local = (t % cycleTime) / cycleTime;
  const size = textSize(w);
  const plot = { x: w * 0.07, y: h * 0.2, w: w * 0.86, h: h * 0.66 };
  const columns = 8;
  const rows = 5;
  const toX = (x: number) => plot.x + x * plot.w;
  const toY = (y: number) => plot.y + y * plot.h;

  const query = createRng(500 + cycle);
  const qx = 0.12 + query() * 0.76;
  const qy = 0.12 + query() * 0.76;
  const column = Math.floor(qx * columns);
  const row = Math.floor(qy * rows);
  const found = nearest(points.map((p) => [p.x, p.y] as [number, number]), [qx, qy], 5);

  // Spatial buckets: only the query's bucket and its neighbours are searched.
  ctx.lineWidth = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const near = Math.abs(c - column) <= 1 && Math.abs(r - row) <= 1;
      const reach = ease(clamp01(local * 4));
      ctx.strokeStyle = near ? hsl(colors.signal, 0.15 + 0.45 * reach) : hsl(colors.fg, 0.09);
      ctx.strokeRect(plot.x + (c * plot.w) / columns, plot.y + (r * plot.h) / rows, plot.w / columns, plot.h / rows);
    }
  }

  points.forEach((point, index) => {
    const hit = found.includes(index);
    ctx.beginPath();
    ctx.arc(toX(point.x), toY(point.y), hit ? 3.2 : 2, 0, Math.PI * 2);
    if (point.fraud) {
      ctx.strokeStyle = hsl(hit ? colors.signal : colors.fg, hit ? 1 : 0.5);
      ctx.stroke();
    } else {
      ctx.fillStyle = hsl(hit ? colors.signal : colors.fg, hit ? 1 : 0.4);
      ctx.fill();
    }
  });

  // Lines reach the five nearest reference vectors one after another.
  found.forEach((index, order) => {
    const grow = ease(clamp01((local - 0.22 - order * 0.07) * 5));
    if (grow <= 0) return;
    ctx.strokeStyle = hsl(colors.signal, 0.75);
    ctx.beginPath();
    ctx.moveTo(toX(qx), toY(qy));
    ctx.lineTo(lerp(toX(qx), toX(points[index].x), grow), lerp(toY(qy), toY(points[index].y), grow));
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.arc(toX(qx), toY(qy), 5, 0, Math.PI * 2);
  ctx.fillStyle = hsl(colors.card);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = hsl(colors.signal);
  ctx.stroke();

  const votes = found.filter((index) => points[index].fraud).length;
  const decided = local > 0.62;
  label(ctx, "KNN  k = 5", w * 0.06, h * 0.1, hsl(colors.signal), size);
  label(
    ctx,
    decided ? `fraud_score ${(votes / 5).toFixed(1)}  ·  ~250 µs` : "searching 9 of 40 buckets",
    w * 0.94,
    h * 0.1,
    hsl(decided ? colors.fg : colors.muted, decided ? 0.9 : 1),
    size,
    "right",
  );
};

// ---------- megabrain-context-protocol: an agent talking to an MCP server ----------

const MCP_MESSAGES: Array<{ method: string; toServer: boolean }> = [
  { method: "initialize", toServer: true },
  { method: "capabilities", toServer: false },
  { method: "tools/list", toServer: true },
  { method: "tools", toServer: false },
  { method: "tools/call", toServer: true },
  { method: "resources/read", toServer: true },
  { method: "result", toServer: false },
];

const mcp: Sketch = ({ ctx, w, h, t, colors }) => {
  const stepTime = 0.85;
  const total = MCP_MESSAGES.length * stepTime + 2.4;
  const local = t % total;
  const index = Math.min(Math.floor(local / stepTime), MCP_MESSAGES.length);
  const frac = ease(clamp01((local - index * stepTime) / (stepTime * 0.8)));
  const size = textSize(w);

  const boxW = w * 0.24;
  const boxH = Math.max(h * 0.2, size * 3);
  const left = w * 0.18;
  const right = w * 0.82;
  const y = h * 0.4;

  ctx.lineWidth = 1;
  ctx.strokeStyle = hsl(colors.fg, 0.2);
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(left + boxW / 2, y);
  ctx.lineTo(right - boxW / 2, y);
  ctx.stroke();
  ctx.setLineDash([]);

  const done = index >= MCP_MESSAGES.length;
  [
    { x: left, name: "coding agent" },
    { x: right, name: "MCP server" },
  ].forEach((box, side) => {
    const active = !done && (MCP_MESSAGES[index].toServer ? side === 1 : side === 0);
    roundedRect(ctx, box.x - boxW / 2, y - boxH / 2, boxW, boxH, 8);
    ctx.fillStyle = hsl(colors.card);
    ctx.fill();
    ctx.strokeStyle = active ? hsl(colors.signal, 0.9) : hsl(colors.fg, 0.3);
    ctx.stroke();
    label(ctx, box.name, box.x, y + 1, hsl(active ? colors.fg : colors.muted), size, "center");
  });

  // The JSON-RPC message in flight.
  if (!done) {
    const message = MCP_MESSAGES[index];
    const from = message.toServer ? left + boxW / 2 : right - boxW / 2;
    const to = message.toServer ? right - boxW / 2 : left + boxW / 2;
    const x = lerp(from, to, frac);
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = hsl(colors.signal);
    ctx.fill();
    label(ctx, message.method, x, y - size * 1.5, hsl(colors.signal), size, "center");
  }

  // Log of what has been exchanged so far.
  const shown = MCP_MESSAGES.slice(0, Math.min(index + 1, MCP_MESSAGES.length)).slice(-4);
  shown.forEach((message, i) => {
    const arrow = message.toServer ? "→" : "←";
    label(ctx, `${arrow} ${message.method}`, w * 0.08, h * 0.66 + i * size * 1.55, hsl(colors.muted, 0.5 + 0.5 * (i / shown.length)), size);
  });

  label(ctx, "Model Context Protocol", w * 0.06, h * 0.1, hsl(colors.signal), size);
  label(ctx, done ? "branch ready for PR: yes" : "is this branch ready for a PR?", w * 0.94, h * 0.1, hsl(done ? colors.fg : colors.muted, done ? 0.9 : 1), size, "right");
};

// ---------- syntroph: a hexagonal core passing events between adapters ----------

const BUS_ADAPTERS = ["memory", "graph", "storage", "runtime", "skills", "journal"];
const busRoutes = lazy(() => {
  const rng = createRng(12);
  return Array.from({ length: 24 }, () => {
    const from = Math.floor(rng() * 6);
    const to = (from + 1 + Math.floor(rng() * 5)) % 6;
    return [from, to] as [number, number];
  });
});

const bus: Sketch = ({ ctx, w, h, t, colors }) => {
  const routes = busRoutes();
  const stepTime = 1.3;
  const step = Math.floor(t / stepTime);
  const local = (t % stepTime) / stepTime;
  const [from, to] = routes[step % routes.length];
  const size = textSize(w);

  const cx = w * 0.4;
  const cy = h * 0.54;
  const radius = Math.min(w * 0.3, h * 0.36);
  const at = (i: number, r = radius) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r * 1.15, y: cy + Math.sin(angle) * r };
  };

  // Hexagonal core.
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = hsl(colors.fg, 0.45);
  ctx.beginPath();
  for (let i = 0; i <= 6; i++) {
    const p = at(i, radius * 0.34);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  label(ctx, "core", cx, cy + 1, hsl(colors.fg, 0.9), size, "center");

  BUS_ADAPTERS.forEach((name, i) => {
    const p = at(i);
    const active = i === from || i === to;
    ctx.strokeStyle = active ? hsl(colors.signal, 0.6) : hsl(colors.fg, 0.14);
    ctx.setLineDash(active ? [] : [3, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = hsl(colors.card);
    ctx.fill();
    ctx.strokeStyle = active ? hsl(colors.signal) : hsl(colors.fg, 0.5);
    ctx.stroke();
    const below = p.y > cy;
    label(ctx, name, p.x, p.y + (below ? 1 : -1) * size * 1.5, hsl(active ? colors.fg : colors.muted), size * 0.92, "center");
  });

  // The event: adapter → core → adapter.
  const a = at(from);
  const b = at(to);
  const inbound = local < 0.5;
  const k = ease(inbound ? local * 2 : (local - 0.5) * 2);
  const x = inbound ? lerp(a.x, cx, k) : lerp(cx, b.x, k);
  const y = inbound ? lerp(a.y, cy, k) : lerp(cy, b.y, k);
  ctx.beginPath();
  ctx.arc(x, y, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = hsl(colors.signal);
  ctx.fill();

  // Append-only journal: one line per delivered event.
  const journalX = w * 0.76;
  label(ctx, "saga journal", journalX, h * 0.26, hsl(colors.muted), size);
  for (let i = 0; i < 6; i++) {
    const entry = step - i;
    if (entry < 0) break;
    const [f, to2] = routes[entry % routes.length];
    const fresh = i === 0 ? ease(clamp01(local * 3)) : 1;
    label(
      ctx,
      `${String(entry + 1).padStart(3, "0")} ${BUS_ADAPTERS[f].slice(0, 3)}→${BUS_ADAPTERS[to2].slice(0, 3)}`,
      journalX,
      h * 0.26 + (i + 1) * size * 1.6,
      hsl(i === 0 ? colors.signal : colors.fg, (i === 0 ? 1 : 0.55 - i * 0.07) * fresh),
      size * 0.92,
    );
  }

  label(ctx, "event bus", w * 0.06, h * 0.1, hsl(colors.signal), size);
};

// ---------- fuzzymeans-ai: Fuzzy C-Means memberships ----------

const fcmData = lazy(() => {
  const rng = createRng(77);
  const blobs: Array<[number, number]> = [
    [0.25, 0.32],
    [0.7, 0.3],
    [0.5, 0.74],
  ];
  const points = Array.from({ length: 75 }, (_, i) => {
    const [bx, by] = blobs[i % 3];
    return [clamp01(bx + gaussian(rng) * 0.085), clamp01(by + gaussian(rng) * 0.085)] as [number, number];
  });
  const steps: FcmStep[] = fuzzyCMeans(points, 3, 14);
  // The explained point sits between clusters, so its memberships are mixed.
  const probe = nearest(points, [0.47, 0.47], 1)[0];
  return { points, steps, probe };
});

const fcm: Sketch = ({ ctx, w, h, t, colors }) => {
  const { points, steps, probe } = fcmData();
  const stepTime = 0.55;
  const local = t % (steps.length * stepTime + 2.6);
  const index = Math.min(Math.floor(local / stepTime), steps.length - 1);
  const frac = index < steps.length - 1 ? ease((local - index * stepTime) / stepTime) : 1;
  const current = steps[index];
  const next = steps[Math.min(index + 1, steps.length - 1)];
  const size = textSize(w);
  const plot = { x: w * 0.07, y: h * 0.2, w: w * 0.62, h: h * 0.68 };
  const toX = (x: number) => plot.x + x * plot.w;
  const toY = (y: number) => plot.y + y * plot.h;
  const centers = current.centers.map(([x, y], j) => [lerp(x, next.centers[j][0], frac), lerp(y, next.centers[j][1], frac)]);

  points.forEach(([x, y], i) => {
    // Certain points are solid; points shared between clusters are faint.
    const certainty = Math.max(...current.memberships[i]);
    ctx.beginPath();
    ctx.arc(toX(x), toY(y), 2.3, 0, Math.PI * 2);
    ctx.fillStyle = hsl(colors.fg, 0.18 + 0.6 * certainty);
    ctx.fill();
  });

  const [px, py] = points[probe];
  centers.forEach(([x, y], j) => {
    const membership = lerp(current.memberships[probe][j], next.memberships[probe][j], frac);
    ctx.strokeStyle = hsl(colors.signal, 0.25 + 0.7 * membership);
    ctx.lineWidth = 1 + membership * 1.5;
    ctx.beginPath();
    ctx.moveTo(toX(px), toY(py));
    ctx.lineTo(toX(x), toY(y));
    ctx.stroke();

    // Cluster center: a cross.
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = hsl(colors.signal);
    ctx.beginPath();
    ctx.moveTo(toX(x) - 6, toY(y));
    ctx.lineTo(toX(x) + 6, toY(y));
    ctx.moveTo(toX(x), toY(y) - 6);
    ctx.lineTo(toX(x), toY(y) + 6);
    ctx.stroke();

    // Membership bars for the explained point.
    const barY = h * (0.36 + j * 0.16);
    const barX = w * 0.76;
    const barW = w * 0.17;
    label(ctx, `u${j + 1}`, barX - size * 0.7, barY, hsl(colors.muted), size, "right");
    ctx.fillStyle = hsl(colors.fg, 0.1);
    ctx.fillRect(barX, barY - 3, barW, 6);
    ctx.fillStyle = hsl(colors.signal, 0.85);
    ctx.fillRect(barX, barY - 3, barW * membership, 6);
    label(ctx, `${Math.round(membership * 100)}%`, barX + barW, barY - size * 1.1, hsl(colors.fg, 0.8), size * 0.9, "right");
  });

  ctx.beginPath();
  ctx.arc(toX(px), toY(py), 4.5, 0, Math.PI * 2);
  ctx.fillStyle = hsl(colors.card);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = hsl(colors.signal);
  ctx.stroke();

  label(ctx, "Fuzzy C-Means  m = 2", w * 0.06, h * 0.1, hsl(colors.signal), size);
  label(ctx, `iteration ${String(index + 1).padStart(2, "0")}/${steps.length}`, w * 0.94, h * 0.1, hsl(colors.muted), size, "right");
};

// ---------- AlgorithmForest: AVL insertions and rotations ----------

const TREE_KEYS = [10, 20, 30, 40, 50, 25, 60, 70, 15, 80, 5];
const treeLayouts = lazy<TreeLayout[]>(() => avlLayouts(TREE_KEYS));

const tree: Sketch = ({ ctx, w, h, t, colors }) => {
  const layouts = treeLayouts();
  const stepTime = 0.8;
  const local = t % (layouts.length * stepTime + 2.2);
  const index = Math.min(Math.floor(local / stepTime), layouts.length - 1);
  const frac = ease(clamp01((local - index * stepTime) / (stepTime * 0.62)));
  const current = layouts[index];
  const previous = index > 0 ? layouts[index - 1] : null;
  const size = textSize(w);
  const radius = Math.min(w, h) * 0.05;
  const levelHeight = (h * 0.56) / 3;

  const place = (key: number) => {
    const target = current.nodes.get(key) as { x: number; y: number };
    const origin = previous?.nodes.get(key);
    const x = origin ? lerp(origin.x, target.x, frac) : target.x;
    const y = origin ? lerp(origin.y, target.y, frac) : target.y - (1 - frac) * 0.5;
    return { x: w * 0.1 + x * w * 0.8, y: h * 0.26 + y * levelHeight, fresh: !origin };
  };

  ctx.lineWidth = 1.2;
  for (const [parent, child] of current.edges) {
    const a = place(parent);
    const b = place(child);
    ctx.strokeStyle = hsl(colors.fg, 0.35 * (a.fresh || b.fresh ? frac : 1));
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  for (const key of current.nodes.keys()) {
    const { x, y, fresh } = place(key);
    const alpha = fresh ? frac : 1;
    const lit = key === current.inserted;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = hsl(colors.card, alpha);
    ctx.fill();
    ctx.strokeStyle = lit ? hsl(colors.signal, alpha) : hsl(colors.fg, 0.6 * alpha);
    ctx.stroke();
    label(ctx, String(key), x, y + 1, lit ? hsl(colors.signal, alpha) : hsl(colors.fg, 0.9 * alpha), radius * 0.85, "center");
  }

  label(ctx, `insert(${current.inserted})`, w * 0.06, h * 0.1, hsl(colors.signal), size);
  label(ctx, `height ${current.height} · balanced`, w * 0.94, h * 0.1, hsl(colors.muted), size, "right");
};

// ---------- zhang-suen-thinning: a shape eroding to its skeleton ----------

const thinningData = lazy(() => {
  const bitmap = rasterize(
    42,
    24,
    [
      [
        [5, 20],
        [5, 4],
        [21, 15],
        [37, 4],
        [37, 20],
      ],
    ],
    2.7,
  );
  const { passes } = zhangSuen(bitmap);
  // For each cell: the pass that removes it, or -1 for skeleton, -2 for background.
  const removedAt = new Int16Array(bitmap.cells.length).fill(-2);
  bitmap.cells.forEach((ink, i) => {
    if (ink) removedAt[i] = -1;
  });
  passes.forEach((pass, k) => pass.forEach((index) => (removedAt[index] = k)));
  return { bitmap, removedAt, passes: passes.length };
});

const thinning: Sketch = ({ ctx, w, h, t, colors }) => {
  const { bitmap, removedAt, passes } = thinningData();
  const passTime = 0.55;
  const local = t % (0.9 + passes * passTime + 2.6);
  const progress = (local - 0.9) / passTime;
  const done = clamp01(progress - passes + 1);
  const size = textSize(w);

  const cell = Math.min((w * 0.84) / bitmap.width, (h * 0.66) / bitmap.height);
  const left = (w - cell * bitmap.width) / 2;
  const top = h * 0.2;
  let alive = 0;

  for (let i = 0; i < removedAt.length; i++) {
    const state = removedAt[i];
    if (state === -2) continue;
    const x = left + (i % bitmap.width) * cell;
    const y = top + Math.floor(i / bitmap.width) * cell;
    let alpha = 0.8;
    let scale = 0.78;
    let color = colors.fg;

    if (state === -1) {
      alive += 1;
      if (done > 0) color = colors.signal;
      alpha = 0.8 + 0.2 * done;
    } else if (progress >= state + 1) {
      alpha = 0.07;
      scale = 0.3;
    } else if (progress >= state) {
      const k = progress - state;
      alpha = lerp(0.8, 0.07, k);
      scale = lerp(0.78, 0.3, k);
      alive += 1;
    } else {
      alive += 1;
    }

    const side = cell * scale;
    ctx.fillStyle = hsl(color, alpha);
    ctx.fillRect(x + (cell - side) / 2, y + (cell - side) / 2, side, side);
  }

  const pass = Math.min(Math.max(Math.floor(progress) + 1, 0), passes);
  label(ctx, `pass ${String(pass).padStart(2, "0")}/${String(passes).padStart(2, "0")}`, w * 0.06, h * 0.1, hsl(colors.signal), size);
  label(ctx, `${alive} px`, w * 0.94, h * 0.1, hsl(colors.muted), size, "right");
};

// ---------- transaction.ledger: idempotent writes, outbox, queue ----------

const LEDGER_STAGES = ["API", "DynamoDB", "Stream", "SQS"];

const ledger: Sketch = ({ ctx, w, h, t, colors }) => {
  const interval = 0.8;
  const hop = 0.55;
  const size = textSize(w);
  const stageX = (i: number) => w * (0.14 + i * 0.24);
  const y = h * 0.44;
  const boxW = w * 0.17;
  const boxH = Math.max(h * 0.2, size * 2.8);

  ctx.lineWidth = 1;
  ctx.strokeStyle = hsl(colors.fg, 0.2);
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(stageX(0), y);
  ctx.lineTo(stageX(3), y);
  ctx.stroke();
  ctx.setLineDash([]);

  LEDGER_STAGES.forEach((name, i) => {
    roundedRect(ctx, stageX(i) - boxW / 2, y - boxH / 2, boxW, boxH, 8);
    ctx.fillStyle = hsl(colors.card);
    ctx.fill();
    ctx.strokeStyle = hsl(colors.fg, 0.3);
    ctx.stroke();
    label(ctx, name, stageX(i), y + boxH / 2 + size * 1.3, hsl(colors.muted), size, "center");
  });

  const latest = Math.floor(t / interval);
  for (let n = Math.max(0, latest - 7); n <= latest; n++) {
    const stage = (t - n * interval) / hop;
    const duplicate = n % 4 === 3;
    let x: number;
    let dy = 0;
    let alpha = 1;

    if (duplicate && stage > 1) {
      // The conditional write rejects a repeated idempotency key.
      x = stageX(1);
      dy = (stage - 1) * h * 0.28;
      alpha = clamp01(1 - (stage - 1) * 0.9);
    } else {
      const k = Math.min(stage, 3.6);
      const whole = Math.min(Math.floor(k), 3);
      x = lerp(stageX(whole), stageX(Math.min(whole + 1, 3)) + (whole === 3 ? w * 0.12 : 0), ease(k - whole));
      alpha = clamp01(3.6 - stage + 0.4);
    }
    if (alpha <= 0) continue;

    roundedRect(ctx, x - 9, y + dy - 6, 18, 12, 3);
    ctx.fillStyle = duplicate ? hsl(colors.muted, 0.5 * alpha) : hsl(colors.signal, alpha);
    ctx.fill();
    if (duplicate && stage > 1) label(ctx, "409", x + 16, y + dy, hsl(colors.muted, alpha), size * 0.9);
  }

  const finished = Math.max(0, Math.floor((t - hop * 3) / interval) + 1);
  const rejected = Math.floor(finished / 4);
  label(ctx, `committed ${String((finished - rejected) % 1000).padStart(3, "0")}`, w * 0.06, h * 0.1, hsl(colors.signal), size);
  label(ctx, `duplicates rejected ${String(rejected % 1000).padStart(3, "0")}`, w * 0.94, h * 0.1, hsl(colors.muted), size, "right");
};

// ---------- lime.stability.imputation: how stable is a local explanation? ----------

const limePoints = lazy(() => {
  const rng = createRng(19);
  return Array.from({ length: 54 }, () => ({ x: rng(), y: rng() }));
});
const boundary = (x: number) => 0.5 + 0.2 * Math.sin(x * 4.6 + 0.4);
const LIME_WEIGHTS = [0.78, 0.46, 0.24];

const lime: Sketch = ({ ctx, w, h, t, colors }) => {
  const cycleTime = 1.5;
  const cycle = Math.floor(t / cycleTime);
  const k = ease(clamp01(((t % cycleTime) / cycleTime) * 2.2));
  const size = textSize(w);

  const plot = { x: w * 0.07, y: h * 0.18, w: w * 0.56, h: h * 0.68 };
  const toX = (x: number) => plot.x + x * plot.w;
  const toY = (y: number) => plot.y + y * plot.h;

  // The model's decision boundary.
  ctx.lineWidth = 1;
  ctx.strokeStyle = hsl(colors.fg, 0.25);
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const x = i / 40;
    if (i === 0) ctx.moveTo(toX(x), toY(boundary(x)));
    else ctx.lineTo(toX(x), toY(boundary(x)));
  }
  ctx.stroke();
  ctx.setLineDash([]);

  for (const point of limePoints()) {
    ctx.beginPath();
    ctx.arc(toX(point.x), toY(point.y), 2.2, 0, Math.PI * 2);
    if (point.y < boundary(point.x)) {
      ctx.fillStyle = hsl(colors.fg, 0.45);
      ctx.fill();
    } else {
      ctx.strokeStyle = hsl(colors.fg, 0.4);
      ctx.stroke();
    }
  }

  // The explained instance and this run's perturbations around it.
  const x0 = 0.5;
  const y0 = boundary(x0);
  const sample = createRng(100 + cycle);
  for (let i = 0; i < 24; i++) {
    const px = x0 + gaussian(sample) * 0.085;
    const py = y0 + gaussian(sample) * 0.085;
    ctx.beginPath();
    ctx.arc(toX(px), toY(py), 1.8, 0, Math.PI * 2);
    ctx.fillStyle = hsl(colors.signal, 0.6 * k);
    ctx.fill();
  }

  // The local linear surrogate: its slope shifts a little on every run.
  const angleOf = (run: number) => Math.atan(0.2 * 4.6 * Math.cos(x0 * 4.6 + 0.4)) + (createRng(7 + run)() - 0.5) * 0.55;
  const angle = lerp(angleOf(cycle - 1), angleOf(cycle), k);
  const reach = plot.w * 0.3;
  ctx.strokeStyle = hsl(colors.signal, 0.95);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(toX(x0) - Math.cos(angle) * reach, toY(y0) - Math.sin(angle) * reach);
  ctx.lineTo(toX(x0) + Math.cos(angle) * reach, toY(y0) + Math.sin(angle) * reach);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(toX(x0), toY(y0), 5, 0, Math.PI * 2);
  ctx.fillStyle = hsl(colors.card);
  ctx.fill();
  ctx.stroke();

  // Feature weights with the spread they show across runs.
  const barX = w * 0.7;
  const barW = w * 0.23;
  LIME_WEIGHTS.forEach((weight, i) => {
    const y = h * (0.34 + i * 0.17);
    const spread = 0.09 + i * 0.03;
    const noise = (run: number) => (createRng(31 + run * 3 + i)() - 0.5) * 2 * spread;
    const value = weight + lerp(noise(cycle - 1), noise(cycle), k);
    label(ctx, `x${i + 1}`, barX - size * 0.8, y, hsl(colors.muted), size, "right");
    ctx.fillStyle = hsl(colors.fg, 0.1);
    ctx.fillRect(barX, y - 3, barW, 6);
    ctx.fillStyle = hsl(colors.fg, 0.55);
    ctx.fillRect(barX, y - 3, barW * value, 6);
    ctx.strokeStyle = hsl(colors.signal, 0.9);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(barX + barW * (weight - spread), y - 7);
    ctx.lineTo(barX + barW * (weight - spread), y + 7);
    ctx.moveTo(barX + barW * (weight + spread), y - 7);
    ctx.lineTo(barX + barW * (weight + spread), y + 7);
    ctx.stroke();
  });

  label(ctx, "LIME · local surrogate", w * 0.06, h * 0.1, hsl(colors.signal), size);
  label(ctx, `run ${String((cycle % 20) + 1).padStart(2, "0")}/20`, w * 0.94, h * 0.1, hsl(colors.muted), size, "right");
};

/** Sketch per featured project id (see `projects` in src/data/portfolio.ts). */
export const sketches: Record<string, Sketch> = {
  "rinha-backend-2026-c": knn,
  "megabrain-context-protocol": mcp,
  syntroph: bus,
  "transaction-ledger": ledger,
  codecash: flow,
  "8-puzzle": puzzle,
  "fuzzymeans-ai": fcm,
  "lime-stability": lime,
  "git-github-in-action": git,
  "algorithm-forest": tree,
  "zhang-suen-thinning": thinning,
};
