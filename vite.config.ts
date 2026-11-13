import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Preloads the display font (Space Grotesk, latin subset) from the built
 * HTML. The hero name is the largest thing on screen, so fetching its font
 * alongside the CSS avoids a late swap. Build only: dev serves fonts unhashed.
 */
function preloadDisplayFont(): Plugin {
  return {
    name: "preload-display-font",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, context) {
        const font = Object.keys(context.bundle ?? {}).find((file) =>
          /space-grotesk-latin-wght-normal-[\w-]+\.woff2$/.test(file),
        );
        if (!font) return [];
        return [
          {
            tag: "link",
            attrs: {
              rel: "preload",
              as: "font",
              type: "font/woff2",
              href: `${process.env.VITE_BASE_PATH || "/"}${font}`,
              crossorigin: "",
            },
            injectTo: "head",
          },
        ];
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), preloadDisplayFont()],
  build: {
    // three.js ships as one lazy chunk (~550 kB, ~140 kB gzip) loaded after first paint.
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
