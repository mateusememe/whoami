import { describe, it, expect } from "vitest";
import {
  avlLayouts,
  fuzzyCMeans,
  manhattan,
  nearest,
  rasterize,
  scramble,
  solvePuzzle,
  zhangSuen,
  type Bitmap,
} from "@/components/covers/algorithms";
import { sketches } from "@/components/covers/sketches";
import { projects } from "@/data/portfolio";
import {
  buildParticles,
  buildPlaceholderPortrait,
  buildPortrait,
  HAZE_BOUNDS,
  meshPresence,
  portraitResolution,
} from "@/webgl/scene/particles";

describe("project covers", () => {
  const featured = projects.filter((project) => project.featured).map((project) => project.id);

  it("has a sketch for every featured project, and none left over", () => {
    for (const id of featured) expect(typeof sketches[id], id).toBe("function");
    expect(Object.keys(sketches).sort()).toEqual([...featured].sort());
  });
});

describe("Fuzzy C-Means", () => {
  const points: Array<[number, number]> = [
    [0.1, 0.1],
    [0.15, 0.12],
    [0.12, 0.18],
    [0.85, 0.9],
    [0.9, 0.82],
    [0.88, 0.88],
    [0.5, 0.5],
  ];
  const steps = fuzzyCMeans(points, 2, 12);

  it("gives every point memberships that sum to 1", () => {
    for (const step of steps) {
      for (const row of step.memberships) expect(row.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10);
    }
  });

  it("never increases the objective", () => {
    for (let i = 1; i < steps.length; i++) expect(steps[i].objective).toBeLessThanOrEqual(steps[i - 1].objective + 1e-12);
  });

  it("splits a point halfway between two clusters evenly, and commits the rest", () => {
    const last = steps[steps.length - 1].memberships;
    expect(Math.max(...last[0])).toBeGreaterThan(0.95);
    expect(Math.max(...last[4])).toBeGreaterThan(0.95);
    expect(Math.abs(last[6][0] - last[6][1])).toBeLessThan(0.15);
  });
});

describe("nearest neighbours", () => {
  it("returns the k closest points, nearest first", () => {
    const points: Array<[number, number]> = [
      [0, 0],
      [1, 1],
      [0.1, 0],
      [5, 5],
    ];
    expect(nearest(points, [0, 0], 2)).toEqual([0, 2]);
    expect(nearest(points, [5, 5], 1)).toEqual([3]);
  });
});

describe("8-puzzle (A*)", () => {
  const start = scramble(30);
  const path = solvePuzzle(start);

  it("starts at the scramble and ends solved", () => {
    expect(path[0]).toEqual(start);
    expect(path[path.length - 1]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    expect(manhattan(path[path.length - 1])).toBe(0);
  });

  it("moves one tile into the blank per step", () => {
    for (let i = 1; i < path.length; i++) {
      const changed = path[i].filter((value, index) => value !== path[i - 1][index]);
      expect(changed).toHaveLength(2);
      expect(changed).toContain(0);
    }
  });

  it("finds a solution no longer than the scramble, and never shorter than the heuristic", () => {
    expect(path.length - 1).toBeLessThanOrEqual(30);
    expect(path.length - 1).toBeGreaterThanOrEqual(manhattan(start));
  });
});

describe("AVL layouts", () => {
  const keys = [10, 20, 30, 40, 50, 25, 60, 70, 15, 80, 5];
  const layouts = avlLayouts(keys);

  it("adds one node per insertion", () => {
    layouts.forEach((layout, i) => {
      expect(layout.nodes.size).toBe(i + 1);
      expect(layout.edges).toHaveLength(i);
      expect(layout.inserted).toBe(keys[i]);
    });
  });

  it("stays balanced: 11 keys fit in height 4 (a plain BST of this input would reach 6)", () => {
    expect(layouts[layouts.length - 1].height).toBe(4);
    for (const layout of layouts) {
      const depths = [...layout.nodes.values()].map((node) => node.y);
      expect(Math.max(...depths) + 1).toBe(layout.height);
    }
  });

  it("orders nodes left to right by key", () => {
    const last = layouts[layouts.length - 1];
    const sorted = [...last.nodes.entries()].sort((a, b) => a[0] - b[0]).map(([, position]) => position.x);
    for (let i = 1; i < sorted.length; i++) expect(sorted[i]).toBeGreaterThan(sorted[i - 1]);
  });
});

describe("Zhang-Suen thinning", () => {
  const count = (cells: Uint8Array) => cells.reduce((sum, value) => sum + value, 0);

  /** Connected ink regions, 8-connectivity. */
  const components = ({ width, height, cells }: Bitmap) => {
    const seen = new Uint8Array(cells.length);
    let total = 0;
    for (let start = 0; start < cells.length; start++) {
      if (!cells[start] || seen[start]) continue;
      total += 1;
      const stack = [start];
      seen[start] = 1;
      while (stack.length) {
        const index = stack.pop() as number;
        const x = index % width;
        const y = Math.floor(index / width);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            const next = ny * width + nx;
            if (cells[next] && !seen[next]) {
              seen[next] = 1;
              stack.push(next);
            }
          }
        }
      }
    }
    return total;
  };

  const bitmap = rasterize(42, 24, [[[5, 20], [5, 4], [21, 15], [37, 4], [37, 20]]], 2.7);
  const { passes, skeleton } = zhangSuen(bitmap);

  it("only removes ink, and removes most of it", () => {
    for (const pass of passes) for (const index of pass) expect(bitmap.cells[index]).toBe(1);
    expect(count(skeleton)).toBeGreaterThan(0);
    expect(count(skeleton)).toBeLessThan(count(bitmap.cells) / 3);
    expect(count(bitmap.cells) - passes.flat().length).toBe(count(skeleton));
  });

  it("keeps the shape in one piece", () => {
    expect(components(bitmap)).toBe(1);
    expect(components({ ...bitmap, cells: skeleton })).toBe(1);
  });

  it("leaves a skeleton one pixel wide (no solid 2x2 block)", () => {
    const { width, height } = bitmap;
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const block =
          skeleton[y * width + x] + skeleton[y * width + x + 1] + skeleton[(y + 1) * width + x] + skeleton[(y + 1) * width + x + 1];
        expect(block).toBeLessThan(4);
      }
    }
  });
});

describe("particle field buffers", () => {
  it("places the haze inside its bounds and seeds every particle", () => {
    const { positions, seeds, count } = buildParticles(500);
    expect(count).toBe(500);
    expect(positions).toHaveLength(1500);
    expect(seeds).toHaveLength(2000);
    for (let i = 0; i < count; i++) {
      expect(Math.abs(positions[i * 3])).toBeLessThanOrEqual(HAZE_BOUNDS.width / 2);
      expect(Math.abs(positions[i * 3 + 1])).toBeLessThanOrEqual(HAZE_BOUNDS.height / 2);
    }
    expect([...seeds].every((value) => value >= 0 && value < 1)).toBe(true);
  });

  it("is deterministic", () => {
    expect([...buildParticles(50).positions]).toEqual([...buildParticles(50).positions]);
  });

  it("maps pixel brightness to dot tone", () => {
    // 2x2 image: white, black / mid gray, white
    const pixels = [255, 255, 255, 255, 0, 0, 0, 255, 128, 128, 128, 255, 255, 255, 255, 255];
    const { positions, tones, resolution } = buildPortrait(pixels, 2, 6);
    expect(resolution).toBe(2);
    expect(tones[0]).toBeCloseTo(1);
    expect(tones[2]).toBe(0);
    expect(tones[4]).toBeGreaterThan(0.2);
    expect(tones[4]).toBeLessThan(1);
    // First cell is top-left: x negative, y positive.
    expect(positions[0]).toBeLessThan(0);
    expect(positions[1]).toBeGreaterThan(0);
    // Brighter pixels sit closer to the viewer.
    expect(positions[2]).toBeGreaterThan(positions[5]);
    // Particles beyond the grid are masked out.
    expect(tones[4 * 2 + 1]).toBe(0);
    expect(tones[5 * 2 + 1]).toBe(0);
  });

  it("fades the portrait out toward its corners", () => {
    const resolution = portraitResolution(100);
    const { tones } = buildPlaceholderPortrait(100);
    const center = (Math.floor(resolution / 2) * resolution + Math.floor(resolution / 2)) * 2 + 1;
    expect(resolution).toBe(10);
    expect(tones[center]).toBe(1);
    expect(tones[1]).toBe(0);
  });

  it("shows the mesh in the hero and the contact finale only", () => {
    expect(meshPresence(0)).toBe(1);
    expect(meshPresence(1)).toBe(0);
    expect(meshPresence(3)).toBe(0);
    expect(meshPresence(5)).toBe(0);
    expect(meshPresence(6)).toBeCloseTo(0.85);
  });
});
