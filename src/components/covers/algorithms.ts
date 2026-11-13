/**
 * The algorithms behind the project covers, as pure functions. Each returns
 * the frames a cover plays back, so the drawing code only interpolates.
 * These are the real algorithms from the repositories they illustrate.
 */
import { createRng } from "@/webgl/core/random";

// ---------- 8-puzzle: A* with Manhattan distance ----------

export type Board = number[];
const GOAL: Board = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export function manhattan(board: Board): number {
  let total = 0;
  for (let i = 0; i < 9; i++) {
    const value = board[i];
    if (value === 0) continue;
    const goal = value - 1;
    total += Math.abs((i % 3) - (goal % 3)) + Math.abs(Math.floor(i / 3) - Math.floor(goal / 3));
  }
  return total;
}

function neighbours(board: Board): Board[] {
  const blank = board.indexOf(0);
  const column = blank % 3;
  const row = Math.floor(blank / 3);
  const moves: number[] = [];
  if (row > 0) moves.push(blank - 3);
  if (row < 2) moves.push(blank + 3);
  if (column > 0) moves.push(blank - 1);
  if (column < 2) moves.push(blank + 1);
  return moves.map((target) => {
    const next = board.slice();
    next[blank] = next[target];
    next[target] = 0;
    return next;
  });
}

/** Scrambles the solved board with a random walk, so the result is always solvable. */
export function scramble(moves: number, seed = 8): Board {
  const rng = createRng(seed);
  let board = GOAL.slice();
  let previous = "";
  for (let i = 0; i < moves; i++) {
    const options = neighbours(board).filter((next) => next.join("") !== previous);
    previous = board.join("");
    board = options[Math.floor(rng() * options.length)];
  }
  return board;
}

/** Shortest solution from `start` to the goal, including both ends. */
export function solvePuzzle(start: Board): Board[] {
  interface Node {
    board: Board;
    g: number;
    parent: Node | null;
  }
  const goalKey = GOAL.join("");
  const best = new Map<string, number>([[start.join(""), 0]]);
  // f = g + h is a small integer, so buckets replace a priority queue.
  const buckets: Node[][] = [];
  const push = (node: Node) => {
    const f = node.g + manhattan(node.board);
    (buckets[f] ??= []).push(node);
  };
  push({ board: start, g: 0, parent: null });

  for (let f = 0; f < buckets.length; f++) {
    const bucket = buckets[f];
    while (bucket && bucket.length > 0) {
      const node = bucket.pop() as Node;
      const key = node.board.join("");
      if ((best.get(key) ?? Infinity) < node.g) continue;
      if (key === goalKey) {
        const path: Board[] = [];
        for (let step: Node | null = node; step; step = step.parent) path.unshift(step.board);
        return path;
      }
      for (const board of neighbours(node.board)) {
        const g = node.g + 1;
        const nextKey = board.join("");
        if (g >= (best.get(nextKey) ?? Infinity)) continue;
        best.set(nextKey, g);
        push({ board, g, parent: node });
      }
      // A child can land in the current bucket (h dropped by 1): keep draining it.
    }
  }
  return [start];
}

// ---------- AVL tree: insertion with rotations ----------

interface AvlNode {
  key: number;
  height: number;
  left: AvlNode | null;
  right: AvlNode | null;
}

const heightOf = (node: AvlNode | null) => (node ? node.height : 0);
const refresh = (node: AvlNode) => {
  node.height = 1 + Math.max(heightOf(node.left), heightOf(node.right));
};

function rotateRight(node: AvlNode): AvlNode {
  const pivot = node.left as AvlNode;
  node.left = pivot.right;
  pivot.right = node;
  refresh(node);
  refresh(pivot);
  return pivot;
}

function rotateLeft(node: AvlNode): AvlNode {
  const pivot = node.right as AvlNode;
  node.right = pivot.left;
  pivot.left = node;
  refresh(node);
  refresh(pivot);
  return pivot;
}

function insert(node: AvlNode | null, key: number): AvlNode {
  if (!node) return { key, height: 1, left: null, right: null };
  if (key < node.key) node.left = insert(node.left, key);
  else node.right = insert(node.right, key);
  refresh(node);

  const balance = heightOf(node.left) - heightOf(node.right);
  if (balance > 1) {
    if (key > (node.left as AvlNode).key) node.left = rotateLeft(node.left as AvlNode);
    return rotateRight(node);
  }
  if (balance < -1) {
    if (key < (node.right as AvlNode).key) node.right = rotateRight(node.right as AvlNode);
    return rotateLeft(node);
  }
  return node;
}

export interface TreeLayout {
  /** key → position: x is the in-order rank (0..1), y the depth (0 = root). */
  nodes: Map<number, { x: number; y: number }>;
  /** Parent and child keys. */
  edges: Array<[number, number]>;
  inserted: number;
  height: number;
}

/** One layout per insertion. Rotations show up as nodes changing place between layouts. */
export function avlLayouts(keys: number[]): TreeLayout[] {
  let root: AvlNode | null = null;
  return keys.map((key) => {
    root = insert(root, key);
    const nodes = new Map<number, { x: number; y: number }>();
    const edges: Array<[number, number]> = [];
    let rank = 0;
    const total = (function size(node: AvlNode | null): number {
      return node ? 1 + size(node.left) + size(node.right) : 0;
    })(root);
    const walk = (node: AvlNode | null, depth: number) => {
      if (!node) return;
      walk(node.left, depth + 1);
      nodes.set(node.key, { x: total > 1 ? rank / (total - 1) : 0.5, y: depth });
      rank += 1;
      if (node.left) edges.push([node.key, node.left.key]);
      if (node.right) edges.push([node.key, node.right.key]);
      walk(node.right, depth + 1);
    };
    walk(root, 0);
    return { nodes, edges, inserted: key, height: heightOf(root) };
  });
}

// ---------- Zhang-Suen thinning ----------

export interface Bitmap {
  width: number;
  height: number;
  /** Row-major, 1 = ink. */
  cells: Uint8Array;
}

/** Rasterizes thick strokes into a bitmap: a cell is ink when it is within `radius` of a segment. */
export function rasterize(width: number, height: number, strokes: number[][][], radius: number): Bitmap {
  const cells = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (const stroke of strokes) {
        for (let i = 0; i < stroke.length - 1; i++) {
          const [ax, ay] = stroke[i];
          const [bx, by] = stroke[i + 1];
          const dx = bx - ax;
          const dy = by - ay;
          const t = Math.min(Math.max(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1), 0), 1);
          if (Math.hypot(x - (ax + t * dx), y - (ay + t * dy)) <= radius) cells[y * width + x] = 1;
        }
      }
    }
  }
  return { width, height, cells };
}

/**
 * Zhang-Suen thinning. Returns, per sub-iteration, the cells it removed
 * (as indices). The cells left when the list ends are the skeleton.
 */
export function zhangSuen(bitmap: Bitmap): { passes: number[][]; skeleton: Uint8Array } {
  const { width, height } = bitmap;
  const cells = bitmap.cells.slice();
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : cells[y * width + x]);
  const passes: number[][] = [];

  for (let changed = true; changed; ) {
    changed = false;
    for (let step = 0; step < 2; step++) {
      const remove: number[] = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (!at(x, y)) continue;
          // Neighbours clockwise from north: P2..P9.
          const p = [
            at(x, y - 1),
            at(x + 1, y - 1),
            at(x + 1, y),
            at(x + 1, y + 1),
            at(x, y + 1),
            at(x - 1, y + 1),
            at(x - 1, y),
            at(x - 1, y - 1),
          ];
          const count = p.reduce((sum, value) => sum + value, 0);
          if (count < 2 || count > 6) continue;
          let transitions = 0;
          for (let i = 0; i < 8; i++) if (!p[i] && p[(i + 1) % 8]) transitions += 1;
          if (transitions !== 1) continue;
          const [n, , e, , s, , w] = p;
          const keep = step === 0 ? n * e * s !== 0 || e * s * w !== 0 : n * e * w !== 0 || n * s * w !== 0;
          if (!keep) remove.push(y * width + x);
        }
      }
      if (remove.length > 0) {
        for (const index of remove) cells[index] = 0;
        passes.push(remove);
        changed = true;
      }
    }
  }
  return { passes, skeleton: cells };
}

// ---------- Fuzzy C-Means ----------

export interface FcmStep {
  /** Cluster centers after this iteration. */
  centers: Array<[number, number]>;
  /** Membership of every point in every cluster; each row sums to 1. */
  memberships: number[][];
  /** Objective J_m = Σ u^m · d². It never increases from one step to the next. */
  objective: number;
}

/**
 * Fuzzy C-Means on 2D points. Unlike k-means, a point belongs to every
 * cluster with a degree between 0 and 1. Returns one step per iteration.
 */
export function fuzzyCMeans(
  points: Array<[number, number]>,
  clusters: number,
  iterations: number,
  fuzziness = 2,
  seed = 3,
): FcmStep[] {
  const rng = createRng(seed);
  let centers: Array<[number, number]> = Array.from({ length: clusters }, () => [rng(), rng()]);
  const exponent = 2 / (fuzziness - 1);
  const steps: FcmStep[] = [];

  const membershipsFor = (current: Array<[number, number]>) =>
    points.map(([x, y]) => {
      const distances = current.map(([cx, cy]) => Math.max(Math.hypot(x - cx, y - cy), 1e-9));
      return distances.map((d) => 1 / distances.reduce((sum, other) => sum + Math.pow(d / other, exponent), 0));
    });

  for (let iteration = 0; iteration < iterations; iteration++) {
    const memberships = membershipsFor(centers);

    // Each center moves to the mean of all points, weighted by membership^m.
    centers = centers.map((_, j) => {
      let weight = 0;
      let sumX = 0;
      let sumY = 0;
      points.forEach(([x, y], i) => {
        const w = Math.pow(memberships[i][j], fuzziness);
        weight += w;
        sumX += w * x;
        sumY += w * y;
      });
      return [sumX / weight, sumY / weight] as [number, number];
    });

    const updated = membershipsFor(centers);
    let objective = 0;
    points.forEach(([x, y], i) => {
      centers.forEach(([cx, cy], j) => {
        objective += Math.pow(updated[i][j], fuzziness) * ((x - cx) ** 2 + (y - cy) ** 2);
      });
    });
    steps.push({ centers, memberships: updated, objective });
  }
  return steps;
}

// ---------- K nearest neighbours ----------

/** Indices of the `k` points closest to `query`, nearest first. */
export function nearest(points: Array<[number, number]>, query: [number, number], k: number): number[] {
  return points
    .map(([x, y], index) => ({ index, distance: (x - query[0]) ** 2 + (y - query[1]) ** 2 }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k)
    .map(({ index }) => index);
}
