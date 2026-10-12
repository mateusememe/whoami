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
