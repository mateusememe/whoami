import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Group,
  LineSegments,
  NormalBlending,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
  type IUniform,
} from "three";
import type { QualitySettings } from "@/webgl/core/capabilities";
import type { ScenePalette } from "@/webgl/core/palette";
import { buildGlyphField, buildMeshGraph, buildPackets, type GlyphBounds } from "@/webgl/scene/graph";
import * as glsl from "@/webgl/scene/shaders";

export interface SceneFrame {
  /** Seconds since start. Frozen at 0 when motion is reduced. */
  time: number;
  /** Page scroll progress, 0..1. */
  scroll: number;
}

type Layer = "nodes" | "edges" | "packets" | "glyphs";

/** Base opacity per layer and theme. Additive glow reads brighter on dark. */
const LAYER_OPACITY: Record<"dark" | "light", Record<Layer, number>> = {
  dark: { nodes: 0.9, edges: 0.2, packets: 1, glyphs: 0.17 },
  light: { nodes: 0.7, edges: 0.18, packets: 0.9, glyphs: 0.13 },
};

/** World-unit point sizes. */
const SIZE = { node: 0.13, packet: 0.11, glyph: 0.42 };

const GLYPH_BOUNDS: GlyphBounds = { width: 56, height: 34, near: 4, far: 30 };

/**
 * The "service mesh" constellation: gateway nodes (services), pods, links and
 * message packets, over a field of falling binary digits.
 */
export class MeshScene {
  readonly root = new Group();

  /** Orientation frame: turned 90° on portrait screens so the wide layout runs vertically. */
  private readonly layout = new Group();
  /** Spins inside the layout frame. */
  private readonly mesh = new Group();
  private readonly shared = {
    uTime: { value: 0 } as IUniform<number>,
    uProjScale: { value: 1 } as IUniform<number>,
    uFade: { value: new Vector2(8, 24) } as IUniform<Vector2>,
  };
  private readonly color = { value: new Vector3() } as IUniform<Vector3>;
  private readonly signal = { value: new Vector3() } as IUniform<Vector3>;
  private readonly opacity: Record<Layer, IUniform<number>> = {
    nodes: { value: 1 },
    edges: { value: 1 },
    packets: { value: 1 },
    glyphs: { value: 1 },
  };
  private readonly materials: Record<Layer, ShaderMaterial>;
  private readonly geometries: BufferGeometry[] = [];
  private readonly atlas: CanvasTexture;
  private baseOpacity = LAYER_OPACITY.dark;

  constructor(quality: QualitySettings, palette: ScenePalette) {
    const graph = buildMeshGraph({ clusters: quality.clusters, nodesPerCluster: quality.nodesPerCluster });
    const packets = buildPackets(graph);
    const glyphs = buildGlyphField(quality.glyphs, GLYPH_BOUNDS);
    this.atlas = createGlyphAtlas();

    this.materials = {
      nodes: this.material(glsl.nodeVertex, glsl.nodeFragment, {
        uSize: { value: SIZE.node },
        uOpacity: this.opacity.nodes,
      }),
      edges: this.material(glsl.edgeVertex, glsl.edgeFragment, { uOpacity: this.opacity.edges }),
      packets: this.material(glsl.packetVertex, glsl.packetFragment, {
        uSize: { value: SIZE.packet },
        uOpacity: this.opacity.packets,
      }),
      glyphs: this.material(glsl.glyphVertex, glsl.glyphFragment, {
        uSize: { value: SIZE.glyph },
        uHeight: { value: GLYPH_BOUNDS.height },
        uAtlas: { value: this.atlas },
        uOpacity: this.opacity.glyphs,
      }),
    };

    // Nodes
    const nodeGeometry = this.geometry({
      position: [graph.positions, 3],
      aSize: [graph.sizes, 1],
      aPhase: [graph.phases, 1],
      aKind: [graph.kinds, 1],
    });
    this.mesh.add(this.object(new Points(nodeGeometry, this.materials.nodes)));

    // Edges, unrolled into one vertex pair per segment
    const edgeCount = graph.edges.length / 2;
    const edgePositions = new Float32Array(edgeCount * 6);
    const backbone = new Float32Array(edgeCount * 2);
    for (let e = 0; e < edgeCount; e++) {
      for (let end = 0; end < 2; end++) {
        const node = graph.edges[e * 2 + end];
        edgePositions.set(graph.positions.subarray(node * 3, node * 3 + 3), (e * 2 + end) * 3);
        backbone[e * 2 + end] = e < graph.backboneEdges ? 1 : 0;
      }
    }
    const edgeGeometry = this.geometry({ position: [edgePositions, 3], aBackbone: [backbone, 1] });
    this.mesh.add(this.object(new LineSegments(edgeGeometry, this.materials.edges)));

    // Packets
    const packetGeometry = this.geometry({
      position: [packets.starts, 3],
      aEnd: [packets.ends, 3],
      aSpeed: [packets.speeds, 1],
      aPhase: [packets.phases, 1],
    });
    this.mesh.add(this.object(new Points(packetGeometry, this.materials.packets)));

    // Binary field stays still while the mesh rotates, which gives parallax.
    const glyphGeometry = this.geometry({
      position: [glyphs.positions, 3],
      aSpeed: [glyphs.speeds, 1],
      aSeed: [glyphs.seeds, 1],
    });
    const field = this.object(new Points(glyphGeometry, this.materials.glyphs));
    field.renderOrder = -1;

    this.layout.add(this.mesh);
    this.root.add(field, this.layout);
    this.setPalette(palette);
  }

  setPalette(palette: ScenePalette): void {
    this.color.value.fromArray(palette.foreground);
    this.signal.value.fromArray(palette.signal);
    this.baseOpacity = LAYER_OPACITY[palette.isDark ? "dark" : "light"];

    const blending = palette.isDark ? AdditiveBlending : NormalBlending;
    for (const layer of ["nodes", "packets"] as const) {
      const material = this.materials[layer];
      if (material.blending !== blending) {
        material.blending = blending;
        material.needsUpdate = true;
      }
    }
  }

  setPortrait(portrait: boolean): void {
    this.layout.rotation.z = portrait ? Math.PI / 2 : 0;
  }

  /** Called by the engine every frame with the current camera and drawing buffer. */
  setView(projectionScale: number, fadeNear: number, fadeFar: number): void {
    this.shared.uProjScale.value = projectionScale;
    this.shared.uFade.value.set(fadeNear, fadeFar);
  }

  update({ time, scroll }: SceneFrame): void {
    this.shared.uTime.value = time;
    this.mesh.rotation.y = time * 0.035 + scroll * Math.PI * 1.1;
    this.mesh.rotation.x = 0.28 + scroll * 0.25;

    // Full strength behind the hero, dimmer behind reading content.
    const intensity = 1 - 0.4 * smoothstep(0, 0.12, scroll);
    for (const layer of Object.keys(this.opacity) as Layer[]) {
      this.opacity[layer].value = this.baseOpacity[layer] * (layer === "glyphs" ? 1 : intensity);
    }
  }

  dispose(): void {
    this.geometries.forEach((geometry) => geometry.dispose());
    Object.values(this.materials).forEach((material) => material.dispose());
    this.atlas.dispose();
  }

  private material(vertexShader: string, fragmentShader: string, uniforms: Record<string, IUniform>): ShaderMaterial {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { ...this.shared, uColor: this.color, uSignal: this.signal, ...uniforms },
      transparent: true,
      depthWrite: false,
    });
  }

  private geometry(attributes: Record<string, [Float32Array, number]>): BufferGeometry {
    const geometry = new BufferGeometry();
    for (const [name, [array, size]] of Object.entries(attributes)) {
      geometry.setAttribute(name, new BufferAttribute(array, size));
    }
    this.geometries.push(geometry);
    return geometry;
  }

  /** Positions are animated in shaders, so CPU-side bounds are meaningless. */
  private object<T extends Points | LineSegments>(object: T): T {
    object.frustumCulled = false;
    return object;
  }
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/** Two-cell texture: "0" on the left half, "1" on the right half. */
function createGlyphAtlas(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const texture = new CanvasTexture(canvas);

  const draw = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = '500 92px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("0", 64, 68);
    ctx.fillText("1", 192, 68);
    texture.needsUpdate = true;
  };

  draw();
  // The web font may load after the scene starts. Redraw once it is ready.
  document.fonts?.load('500 92px "JetBrains Mono"').then(draw, () => undefined);
  return texture;
}
