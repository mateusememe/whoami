/**
 * GLSL for the mesh scene. All animation runs on the GPU from `uTime`, so the
 * CPU only updates a few uniforms per frame.
 *
 * Shared uniforms:
 *   uTime      seconds since start
 *   uProjScale drawing-buffer pixels per world unit at distance 1
 *   uFade      (near, far) view-space depth range for depth fading
 *
 * Fragment shaders skip three's colorspace chunk on purpose: palette colors
 * arrive as sRGB from CSS tokens and go to the canvas unchanged.
 */

const depthFade = /* glsl */ `
  float depthFade(float depth) {
    return 1.0 - 0.8 * smoothstep(uFade.x, uFade.y, depth);
  }
`;

export const nodeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uProjScale;
  uniform vec2 uFade;
  attribute float aSize;
  attribute float aPhase;
  attribute float aKind;
  varying float vPulse;
  varying float vKind;
  varying float vFade;
  ${depthFade}

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = -mv.z;
    vPulse = 0.5 + 0.5 * sin(uTime * 1.4 + aPhase);
    vKind = aKind;
    vFade = depthFade(depth);
    gl_PointSize = uSize * aSize * (1.0 + 0.18 * vPulse) * uProjScale / depth;
    gl_Position = projectionMatrix * mv;
  }
`;

export const nodeFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSignal;
  uniform float uOpacity;
  varying float vPulse;
  varying float vKind;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.04, d);
    core *= core;
    float ring = vKind * smoothstep(0.05, 0.0, abs(d - 0.4)) * (0.3 + 0.7 * vPulse);
    float alpha = (core + ring) * vFade * uOpacity;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(mix(uColor, uSignal, vKind * 0.85), alpha);
  }
`;

export const edgeVertex = /* glsl */ `
  uniform vec2 uFade;
  attribute float aBackbone;
  varying float vFade;
  varying float vBackbone;
  ${depthFade}

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFade = depthFade(-mv.z);
    vBackbone = aBackbone;
    gl_Position = projectionMatrix * mv;
  }
`;

export const edgeFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSignal;
  uniform float uOpacity;
  varying float vFade;
  varying float vBackbone;

  void main() {
    vec3 color = mix(uColor, uSignal, vBackbone * 0.6);
    gl_FragColor = vec4(color, uOpacity * vFade * (0.55 + 0.45 * vBackbone));
  }
`;

export const packetVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uProjScale;
  uniform vec2 uFade;
  attribute vec3 aEnd;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vAlpha;
  ${depthFade}

  void main() {
    float t = fract(uTime * aSpeed + aPhase);
    vec4 mv = modelViewMatrix * vec4(mix(position, aEnd, t), 1.0);
    float depth = -mv.z;
    vAlpha = sin(t * 3.14159265) * depthFade(depth);
    gl_PointSize = uSize * uProjScale / depth;
    gl_Position = projectionMatrix * mv;
  }
`;

export const packetFragment = /* glsl */ `
  uniform vec3 uSignal;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha * uOpacity;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uSignal, alpha);
  }
`;

export const glyphVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uProjScale;
  uniform float uHeight;
  uniform vec2 uFade;
  attribute float aSpeed;
  attribute float aSeed;
  varying float vGlyph;
  varying float vAlpha;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    vec3 p = position;
    float halfHeight = uHeight * 0.5;
    p.y = mod(p.y - uTime * aSpeed + halfHeight, uHeight) - halfHeight;
    vGlyph = step(0.5, hash(aSeed + floor(uTime * 1.5 + aSeed)));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    float edge = 1.0 - smoothstep(halfHeight * 0.7, halfHeight, abs(p.y));
    // Fade relative to the camera so portrait screens (camera pulled back) keep the field.
    vAlpha = edge * (1.0 - smoothstep(uFade.x + 4.0, uFade.y + 26.0, depth));
    gl_PointSize = uSize * uProjScale / depth;
    gl_Position = projectionMatrix * mv;
  }
`;

export const glyphFragment = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vGlyph;
  varying float vAlpha;

  void main() {
    vec2 uv = vec2((gl_PointCoord.x + vGlyph) * 0.5, 1.0 - gl_PointCoord.y);
    float alpha = texture2D(uAtlas, uv).a * vAlpha * uOpacity;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * Particle field ("dust"). One Points object morphs between seven formations
 * as uMorph goes 0..6:
 *   0 haze      scattered volume around the hero mesh
 *   1 portrait  dot-matrix photo (aPortrait / aTone), placed by uFrame
 *   2 terrain   rows of dots rolling like a landscape
 *   3 globe     latitude rings and meridians
 *   4 tunnel    ring around the viewport edges, travelling toward the camera
 *   5 wave      a bundle of sine waves, like a voice on an oscilloscope
 *   6 galaxy    three-armed spiral disc
 * Formations 2..6 are computed from aSeed, so only the haze and the portrait
 * take buffer space.
 *
 * Realism comes from a thin-lens model: points off the focal plane grow into
 * soft bokeh discs and lose brightness (energy is conserved).
 */
export const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uTravel;
  uniform float uSize;
  uniform float uDot;
  uniform float uProjScale;
  uniform float uFocus;
  uniform float uAperture;
  uniform float uMaxSize;
  uniform float uDark;
  uniform vec2 uView;
  uniform vec3 uFrame;
  uniform vec3 uPointer;
  attribute vec3 aPortrait;
  attribute vec2 aTone;
  attribute vec4 aSeed;
  varying float vAlpha;
  varying float vBlur;
  varying float vAccent;

  const float PI = 3.14159265359;
  const float TAU = 6.28318530718;

  mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  vec3 formHaze() {
    vec3 p = position;
    p.x += sin(uTime * 0.07 + aSeed.x * TAU) * 0.6;
    p.y += cos(uTime * 0.06 + aSeed.y * TAU) * 0.5;
    return p;
  }

  vec3 formPortrait() {
    vec3 p = vec3(aPortrait.xy * uFrame.z, aPortrait.z * uFrame.z * 0.13);
    p.z += sin(uTime * 0.9 + aSeed.x * TAU) * 0.035;
    return vec3(uFrame.xy, 0.0) + p;
  }

  vec3 formTerrain() {
    float row = floor(aSeed.y * 44.0) / 44.0;
    float z = mix(-30.0, 9.0, row);
    float x = (fract(aSeed.x + uTime * 0.005 * (0.5 + row)) - 0.5) * uView.x * 5.2;
    float y = -uView.y * 0.86
      + sin(x * 0.3 + uTime * 0.4) * 0.42
      + sin(z * 0.36 - uTime * 0.28 + x * 0.09) * 0.6;
    return vec3(x, y, z);
  }

  vec3 formGlobe() {
    float tall = step(uView.x, uView.y * 0.8);
    // Low in the frame, so the upper half of the screen stays clear for text:
    // off the lower right corner on wide screens, rising from the bottom edge on tall ones.
    float radius = mix(min(uView.y * 0.78, uView.x * 0.5), uView.x * 0.92, tall);
    vec3 center = mix(vec3(uView.x * 0.66, -uView.y * 0.96, -4.0), vec3(0.0, -uView.y * 1.22, -5.0), tall);
    float ring = step(0.5, aSeed.w);
    float phi = mix(aSeed.x * PI, acos(1.0 - 2.0 * (floor(aSeed.x * 13.0) + 0.5) / 13.0), ring);
    float theta = mix(floor(aSeed.y * 20.0) / 20.0 * TAU, aSeed.y * TAU, ring) + uTime * 0.07;
    vec3 p = radius * vec3(sin(phi) * cos(theta), cos(phi), sin(phi) * sin(theta));
    p.xy = rot(0.38) * p.xy;
    return center + p;
  }

  vec3 formTunnel() {
    float angle = aSeed.x * TAU;
    float z = mix(-54.0, 13.0, fract(aSeed.y + uTravel * (0.6 + aSeed.z * 0.8)));
    float r = 1.08 + aSeed.w * 0.5;
    return vec3(cos(angle) * uView.x * r, sin(angle) * uView.y * r, z);
  }

  vec3 formWave() {
    // Seven sine waves share one envelope that tapers at the screen edges and
    // swells in bursts, so the bundle reads as a voice, not a pattern.
    float line = floor(aSeed.y * 7.0);
    float xn = (aSeed.x - 0.5) * 2.4;
    float taper = exp(-xn * xn * 1.6);
    float burst = 0.55 + 0.45 * sin(uTime * 0.9 + line * 1.3) * sin(xn * 2.1 - uTime * 0.7);
    float amplitude = uView.y * 0.22 * taper * burst;
    float y = sin(xn * (5.0 + line * 0.6) - uTime * (1.2 + line * 0.15) + line * 0.9) * amplitude;
    float z = -2.0 - line * 0.55 + (aSeed.z - 0.5) * 0.3;
    // Low in the frame, under the reading line of the talks.
    return vec3(xn * uView.x, y - uView.y * 0.62, z);
  }

  vec3 formGalaxy() {
    float radius = max(uView.x, uView.y) * 1.15;
    float r = pow(aSeed.x, 0.62) * radius;
    float arm = floor(aSeed.y * 3.0) / 3.0 * TAU;
    float angle = arm + r * 0.36 + (aSeed.z - 0.5) * 1.1 * (1.0 - aSeed.x * 0.6) - uTime * 0.05;
    vec3 p = vec3(cos(angle) * r, (aSeed.w - 0.5) * 0.55 * (1.2 - aSeed.x), sin(angle) * r);
    // Seen at a shallow angle: a disc lying under the content, not a wall behind it.
    p.yz = rot(-0.34) * p.yz;
    return vec3(0.0, -uView.y * 0.52, -9.0) + p;
  }

  void main() {
    // Per-particle stagger: each particle leaves a little later than the last,
    // but all of them arrive, so integer morph values are exact formations.
    float base = floor(min(uMorph, 5.9999));
    float local = uMorph - base;
    float eased = smoothstep(0.0, 1.0, clamp((local - aSeed.w * 0.3) / 0.7, 0.0, 1.0));
    float m = base + eased;

    float w0 = max(0.0, 1.0 - abs(m));
    float w1 = max(0.0, 1.0 - abs(m - 1.0));
    float w2 = max(0.0, 1.0 - abs(m - 2.0));
    float w3 = max(0.0, 1.0 - abs(m - 3.0));
    float w4 = max(0.0, 1.0 - abs(m - 4.0));
    float w5 = max(0.0, 1.0 - abs(m - 5.0));
    float w6 = max(0.0, 1.0 - abs(m - 6.0));

    vec3 pos = formHaze() * w0
      + formPortrait() * w1
      + formTerrain() * w2
      + formGlobe() * w3
      + formTunnel() * w4
      + formWave() * w5
      + formGalaxy() * w6;

    // Mid-transition the particles follow a swirl instead of a straight line.
    float flow = sin(PI * eased);
    vec3 q = pos * 0.33 + aSeed.xyz * 6.0;
    pos += flow * 1.5 * vec3(sin(q.y + uTime * 0.6), cos(q.x - uTime * 0.5), sin(q.x + q.y));

    // The pointer pushes nearby particles away and toward the viewer.
    vec2 away = pos.xy - uPointer.xy;
    float push = uPointer.z * exp(-dot(away, away) / 2.4);
    pos.xy += normalize(away + vec2(0.0001)) * push * 0.7;
    pos.z += push * 0.9;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float depth = max(-mv.z, 0.1);

    float tone = mix(1.0 - aTone.x, aTone.x, uDark);
    float worldSize = mix(uSize * (0.7 + aSeed.z * 0.75), uDot * (0.3 + tone * 0.85), w1);
    float sharp = worldSize * uProjScale / depth;
    float bokeh = uAperture * abs(depth - uFocus) / depth * uProjScale;
    float size = sharp + bokeh;

    // The hero haze is sparse: only about one particle in eight is lit there.
    float sparse = step(0.875, fract(aSeed.x * 7.13 + aSeed.y * 3.71));
    // Formations behind reading text stay quiet; the far rows of the terrain fade into a horizon.
    float horizon = smoothstep(44.0, 16.0, depth);
    // In the tunnel only a third of the particles are lit, and the far end stays dark.
    float streak = step(0.66, fract(aSeed.x * 3.37 + aSeed.z * 5.11)) * smoothstep(62.0, 22.0, depth);
    float layer = w0 * 0.6 * sparse + w1 + w2 * 0.5 * horizon + w3 * 0.2 + w4 * 0.55 * streak + w5 * 0.17 + w6 * 0.42 * horizon;
    float shown = mix(1.0, (0.12 + 0.88 * tone) * aTone.y, w1);
    vAlpha = layer * shown * pow(sharp / size, 1.35) * smoothstep(0.4, 3.0, depth);
    vBlur = clamp(bokeh / max(sharp, 0.75), 0.0, 4.0) * 0.25;
    vAccent = step(0.93, aSeed.z) * (1.0 - w1);

    gl_PointSize = min(size, uMaxSize);
    gl_Position = projectionMatrix * mv;
  }
`;

export const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSignal;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vBlur;
  varying float vAccent;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // In focus: a soft dot. Out of focus: a flat disc with a brighter rim, like a lens.
    float core = smoothstep(1.0, 0.0, d);
    core *= core;
    float disc = smoothstep(1.0, 0.82, d) * (0.7 + 0.3 * smoothstep(0.5, 0.95, d));
    float alpha = mix(core, disc, smoothstep(0.04, 0.45, vBlur)) * vAlpha * uOpacity;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(mix(uColor, uSignal, vAccent), alpha);
  }
`;
