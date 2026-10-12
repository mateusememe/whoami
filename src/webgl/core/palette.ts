/**
 * Bridges the CSS design tokens (`--foreground`, `--signal`) into the WebGL
 * scene. Colors stay as raw sRGB triples: the scene's shaders write them
 * straight to the canvas, so they match the DOM exactly.
 */

export type RGB = [number, number, number];

export interface ScenePalette {
  isDark: boolean;
  foreground: RGB;
  signal: RGB;
}

const FALLBACK: Record<"dark" | "light", Omit<ScenePalette, "isDark">> = {
  dark: { foreground: [0.85, 0.85, 0.85], signal: [0.33, 0.85, 0.77] },
  light: { foreground: [0.13, 0.13, 0.13], signal: [0.07, 0.45, 0.4] },
};

export function hslToRgb(h: number, s: number, l: number): RGB {
  const hue = (((h % 360) + 360) % 360) / 360;
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [channel(hue + 1 / 3), channel(hue), channel(hue - 1 / 3)];
}

/** Parses a shadcn-style HSL token such as `"172 66% 52%"`. */
export function parseHslToken(value: string): RGB | null {
  const match = value.trim().match(/^(-?[\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/);
  if (!match) return null;
  return hslToRgb(parseFloat(match[1]), parseFloat(match[2]) / 100, parseFloat(match[3]) / 100);
}

export function readPalette(root: HTMLElement = document.documentElement): ScenePalette {
  const isDark = root.classList.contains("dark");
  const style = getComputedStyle(root);
  const fallback = FALLBACK[isDark ? "dark" : "light"];
  return {
    isDark,
    foreground: parseHslToken(style.getPropertyValue("--foreground")) ?? fallback.foreground,
    signal: parseHslToken(style.getPropertyValue("--signal")) ?? fallback.signal,
  };
}

/** Calls `onChange` whenever the `dark` class on the root element flips. */
export function watchPalette(
  onChange: (palette: ScenePalette) => void,
  root: HTMLElement = document.documentElement,
): () => void {
  const observer = new MutationObserver(() => onChange(readPalette(root)));
  observer.observe(root, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
