/**
 * Pure geometry generation for the "service mesh" scene. No three.js here:
 * everything returns typed arrays so it can be unit tested in jsdom.
 *
 * Layout: clusters (services) sit on a flattened Fibonacci sphere. Each
 * cluster has one gateway node at its center plus pods scattered around it.
 * Pods link to the nearest earlier node in their cluster (a tree, with a few
 * extra links for loops). Gateways link to their two nearest gateways.
 */
import { createRng, gaussian, range } from "@/webgl/core/random";

export interface GraphOptions {
  clusters: number;
  nodesPerCluster: number;
  /** Radius of the sphere that holds the cluster centers. */
  radius?: number;
  /** Standard deviation of pod offsets around their gateway. */
  spread?: number;
  seed?: number;
}

export interface MeshGraph {
  /** xyz per node. */
  positions: Float32Array;
  /** Relative point size per node. */
  sizes: Float32Array;
  /** Pulse phase offset per node, radians. */
  phases: Float32Array;
  /** 1 for gateway nodes, 0 for pods. */
  kinds: Float32Array;
  /** Flat list of node index pairs. */
  edges: Uint16Array;
  /** Number of edges that connect two gateways. They come first in `edges`. */
  backboneEdges: number;
  nodeCount: number;
}

export interface PacketBuffers {
  starts: Float32Array;
  ends: Float32Array;
  speeds: Float32Array;
  phases: Float32Array;
  count: number;
}

export interface GlyphBuffers {
  positions: Float32Array;
  speeds: Float32Array;
  seeds: Float32Array;
  count: number;
}

export interface GlyphBounds {
  width: number;
  height: number;
  near: number;
  far: number;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function buildMeshGraph({
  clusters,
  nodesPerCluster,
  radius = 6.5,
  spread = 1.25,
  seed = 7,
}: GraphOptions): MeshGraph {
  const rng = createRng(seed);
  const nodeCount = clusters * nodesPerCluster;
  const positions = new Float32Array(nodeCount * 3);
  const sizes = new Float32Array(nodeCount);
  const phases = new Float32Array(nodeCount);
  const kinds = new Float32Array(nodeCount);

  const centers: number[][] = [];
  for (let c = 0; c < clusters; c++) {
    const y = clusters === 1 ? 0 : 1 - (c / (clusters - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * c;
    centers.push([
      Math.cos(theta) * ring * radius + gaussian(rng) * 0.4,
      y * radius * 0.5 + gaussian(rng) * 0.3,
      Math.sin(theta) * ring * radius + gaussian(rng) * 0.4,
    ]);
  }

  for (let c = 0; c < clusters; c++) {
    for (let n = 0; n < nodesPerCluster; n++) {
      const i = c * nodesPerCluster + n;
      const isGateway = n === 0;
      const offset = isGateway ? 0 : spread;
      positions[i * 3] = centers[c][0] + gaussian(rng) * offset;
      positions[i * 3 + 1] = centers[c][1] + gaussian(rng) * offset * 0.8;
      positions[i * 3 + 2] = centers[c][2] + gaussian(rng) * offset;
      sizes[i] = isGateway ? 2.1 : range(rng, 0.55, 1.15);
      phases[i] = rng() * Math.PI * 2;
      kinds[i] = isGateway ? 1 : 0;
    }
  }

  const seen = new Set<number>();
  const backbone: number[] = [];
  const local: number[] = [];
  const link = (a: number, b: number, into: number[]) => {
    if (a === b) return;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const key = lo * nodeCount + hi;
    if (seen.has(key)) return;
    seen.add(key);
    into.push(lo, hi);
  };

  // Backbone: each gateway to its two nearest gateways.
  for (let c = 0; c < clusters; c++) {
    const gateway = c * nodesPerCluster;
    const nearest = nearestNodes(
      positions,
      gateway,
      Array.from({ length: clusters }, (_, k) => k * nodesPerCluster),
      2,
    );
    for (const other of nearest) link(gateway, other, backbone);
  }

  // Local: each pod to the nearest earlier node of its cluster.
  for (let c = 0; c < clusters; c++) {
    const base = c * nodesPerCluster;
    for (let n = 1; n < nodesPerCluster; n++) {
      const i = base + n;
      const earlier = Array.from({ length: n }, (_, k) => base + k);
      const [first, second] = nearestNodes(positions, i, earlier, 2);
      link(i, first, local);
      if (second !== undefined && rng() < 0.3) link(i, second, local);
    }
  }

  return {
    positions,
    sizes,
    phases,
    kinds,
    edges: Uint16Array.from([...backbone, ...local]),
    backboneEdges: backbone.length / 2,
    nodeCount,
  };
}

/**
 * Message packets that travel along edges. Backbone edges carry more traffic.
 * Speed is normalized by edge length so packets move at a similar velocity.
 */
export function buildPackets(graph: MeshGraph, density = 0.7, seed = 11): PacketBuffers {
  const rng = createRng(seed);
  const edgeCount = graph.edges.length / 2;
  const assigned: number[] = [];

  for (let e = 0; e < edgeCount; e++) {
    const weight = e < graph.backboneEdges ? 3 : density;
    let quota = Math.floor(weight);
    if (rng() < weight - quota) quota += 1;
    for (let q = 0; q < quota; q++) assigned.push(e);
  }

  const count = assigned.length;
  const starts = new Float32Array(count * 3);
  const ends = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const phases = new Float32Array(count);
  const { positions, edges } = graph;

  assigned.forEach((e, p) => {
    const forward = rng() < 0.5;
    const a = edges[e * 2 + (forward ? 0 : 1)];
    const b = edges[e * 2 + (forward ? 1 : 0)];
    for (let k = 0; k < 3; k++) {
      starts[p * 3 + k] = positions[a * 3 + k];
      ends[p * 3 + k] = positions[b * 3 + k];
    }
    const length = Math.hypot(
      positions[b * 3] - positions[a * 3],
      positions[b * 3 + 1] - positions[a * 3 + 1],
      positions[b * 3 + 2] - positions[a * 3 + 2],
    );
    speeds[p] = range(rng, 0.9, 1.8) / Math.max(length, 0.5);
    phases[p] = rng();
  });

  return { starts, ends, speeds, phases, count };
}

/** Binary digits ("0"/"1") falling through a box behind the mesh. */
export function buildGlyphField(count: number, bounds: GlyphBounds, seed = 23): GlyphBuffers {
  const rng = createRng(seed);
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = range(rng, -bounds.width / 2, bounds.width / 2);
    positions[i * 3 + 1] = range(rng, -bounds.height / 2, bounds.height / 2);
    positions[i * 3 + 2] = -range(rng, bounds.near, bounds.far);
    speeds[i] = range(rng, 0.25, 1.1);
    seeds[i] = rng() * 100;
  }

  return { positions, speeds, seeds, count };
}

function nearestNodes(positions: Float32Array, from: number, candidates: number[], k: number): number[] {
  return candidates
    .filter((c) => c !== from)
    .map((c) => ({ c, d: distanceSq(positions, from, c) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map(({ c }) => c);
}

function distanceSq(positions: Float32Array, a: number, b: number): number {
  const dx = positions[a * 3] - positions[b * 3];
  const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
  const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
  return dx * dx + dy * dy + dz * dz;
}
