import { describe, it, expect } from "vitest";
import { createRng } from "@/webgl/core/random";
import { getQualitySettings, pickQualityTier, supportsWebGL2, QUALITY_PRESETS } from "@/webgl/core/capabilities";
import { hslToRgb, parseHslToken, readPalette } from "@/webgl/core/palette";
import { PerformanceGovernor } from "@/webgl/core/governor";
import { buildGlyphField, buildMeshGraph, buildPackets } from "@/webgl/scene/graph";
import { damp, scrollProgress } from "@/lib/motion";

describe("random", () => {
  it("is deterministic for a given seed", () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 5 }, a);
    const seqB = Array.from({ length: 5 }, b);
    expect(seqA).toEqual(seqB);
    expect(seqA.every((v) => v >= 0 && v < 1)).toBe(true);
  });
});

describe("capabilities", () => {
  const desktop = { width: 1440, cores: 8, memory: 8, coarsePointer: false };

  it("picks high for a desktop", () => {
    expect(pickQualityTier(desktop)).toBe("high");
  });

  it("picks medium for touch or narrow screens", () => {
    expect(pickQualityTier({ ...desktop, coarsePointer: true })).toBe("medium");
    expect(pickQualityTier({ ...desktop, width: 600 })).toBe("medium");
    expect(pickQualityTier({ ...desktop, memory: 4 })).toBe("medium");
  });

  it("picks low for weak hardware", () => {
    expect(pickQualityTier({ ...desktop, cores: 4 })).toBe("low");
    expect(pickQualityTier({ ...desktop, memory: 2 })).toBe("low");
  });

  it("merges the preset into the settings", () => {
    expect(getQualitySettings(desktop)).toEqual({ tier: "high", ...QUALITY_PRESETS.high });
  });

  it("reports no WebGL 2 in jsdom", () => {
    expect(supportsWebGL2()).toBe(false);
  });
});

describe("palette", () => {
  it("parses shadcn HSL tokens", () => {
    expect(parseHslToken("0 0% 100%")).toEqual([1, 1, 1]);
    expect(parseHslToken(" 0 100% 50% ")).toEqual([1, 0, 0]);
    expect(parseHslToken("not a color")).toBeNull();
  });

  it("converts hue sectors", () => {
    const [r, g, b] = hslToRgb(120, 1, 0.5);
    expect([r, g, b]).toEqual([0, 1, 0]);
  });

  it("reads the theme from the root element", () => {
    const root = document.createElement("div");
    root.className = "dark";
    root.style.setProperty("--foreground", "0 0% 50%");
    const palette = readPalette(root);
    expect(palette.isDark).toBe(true);
    expect(palette.foreground[0]).toBeCloseTo(0.5);
    // --signal is unset here, so the dark fallback applies.
    expect(palette.signal).toHaveLength(3);
  });
});

describe("motion", () => {
  it("damps toward the target independent of frame rate", () => {
    const oneStep = damp(0, 1, 4, 0.1);
    let twoSteps = damp(0, 1, 4, 0.05);
    twoSteps = damp(twoSteps, 1, 4, 0.05);
    expect(oneStep).toBeCloseTo(twoSteps, 10);
    expect(oneStep).toBeGreaterThan(0);
    expect(oneStep).toBeLessThan(1);
  });

  it("normalizes scroll progress", () => {
    expect(scrollProgress(0, 2000, 1000)).toBe(0);
    expect(scrollProgress(500, 2000, 1000)).toBe(0.5);
    expect(scrollProgress(1500, 2000, 1000)).toBe(1);
    expect(scrollProgress(100, 800, 1000)).toBe(0);
  });
});

describe("PerformanceGovernor", () => {
  it("steps the pixel ratio down when frames run over budget", () => {
    const governor = new PerformanceGovernor({ initialPixelRatio: 2, windowSize: 10 });
    let result: number | null = null;
    for (let i = 0; i < 10; i++) result = governor.sample(1 / 20);
    expect(result).toBe(1.75);
  });

  it("holds when frames are within budget and never drops below the floor", () => {
    const fast = new PerformanceGovernor({ initialPixelRatio: 2, windowSize: 10 });
    for (let i = 0; i < 30; i++) expect(fast.sample(1 / 60)).toBeNull();

    const slow = new PerformanceGovernor({ initialPixelRatio: 1.25, windowSize: 1 });
    expect(slow.sample(1)).toBe(1);
    expect(slow.sample(1)).toBeNull();
    expect(slow.pixelRatio).toBe(1);
  });
});

describe("mesh graph", () => {
  const graph = buildMeshGraph({ clusters: 6, nodesPerCluster: 10 });

  it("creates one gateway per cluster", () => {
    expect(graph.nodeCount).toBe(60);
    expect(graph.positions).toHaveLength(180);
    expect(Array.from(graph.kinds).filter((k) => k === 1)).toHaveLength(6);
  });

  it("produces unique, in-range edges", () => {
    const keys = new Set<string>();
    for (let e = 0; e < graph.edges.length; e += 2) {
      const a = graph.edges[e];
      const b = graph.edges[e + 1];
      expect(a).not.toBe(b);
      expect(Math.max(a, b)).toBeLessThan(graph.nodeCount);
      keys.add(`${a}-${b}`);
    }
    expect(keys.size).toBe(graph.edges.length / 2);
  });

  it("connects every node", () => {
    const degree = new Array(graph.nodeCount).fill(0);
    graph.edges.forEach((node) => degree[node]++);
    expect(degree.every((d) => d > 0)).toBe(true);
  });

  it("places backbone edges between gateways first", () => {
    expect(graph.backboneEdges).toBeGreaterThan(0);
    for (let e = 0; e < graph.backboneEdges; e++) {
      expect(graph.kinds[graph.edges[e * 2]]).toBe(1);
      expect(graph.kinds[graph.edges[e * 2 + 1]]).toBe(1);
    }
  });

  it("is stable for the same seed", () => {
    const again = buildMeshGraph({ clusters: 6, nodesPerCluster: 10 });
    expect(Array.from(again.positions)).toEqual(Array.from(graph.positions));
  });

  it("sends packets along existing edges", () => {
    const packets = buildPackets(graph);
    expect(packets.count).toBeGreaterThan(graph.backboneEdges * 3 - 1);
    expect(packets.starts).toHaveLength(packets.count * 3);
    expect(Array.from(packets.speeds).every((s) => s > 0)).toBe(true);
  });

  it("fills the glyph box", () => {
    const glyphs = buildGlyphField(100, { width: 10, height: 6, near: 2, far: 8 });
    expect(glyphs.count).toBe(100);
    for (let i = 0; i < 100; i++) {
      expect(Math.abs(glyphs.positions[i * 3])).toBeLessThanOrEqual(5);
      expect(glyphs.positions[i * 3 + 2]).toBeLessThanOrEqual(-2);
      expect(glyphs.positions[i * 3 + 2]).toBeGreaterThanOrEqual(-8);
    }
  });
});
