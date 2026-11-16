import { useEffect, useRef } from "react";
import { Engine } from "@/webgl/core/Engine";
import { getQualitySettings, prefersReducedMotion } from "@/webgl/core/capabilities";

interface WebGLBackgroundProps {
  onError: (error: unknown) => void;
}

/**
 * Mounts the three.js engine. Loaded as a separate chunk by SceneBackground,
 * so three.js never blocks first paint.
 *
 * The canvas is created per mount (not rendered by React) because dispose()
 * forces a context loss, and a lost canvas cannot host a new renderer.
 */
const WebGLBackground = ({ onError }: WebGLBackgroundProps) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    host.appendChild(canvas);

    const root = document.documentElement;
    const base = import.meta.env.BASE_URL || "/";

    let engine: Engine;
    try {
      engine = new Engine({
        canvas,
        quality: getQualitySettings(),
        reducedMotion: prefersReducedMotion(),
        portraitUrl: `${base.endsWith("/") ? base : `${base}/`}images/profile-avatar.webp`,
        onFirstFrame: () => {
          host.setAttribute("data-ready", "true");
          // Tells CSS the particle portrait is live, so the image fallback steps aside.
          if (engine.animated) root.dataset.scene = "webgl";
          // A still frame stays behind every section, so it is drawn quieter.
          else host.setAttribute("data-static", "true");
        },
      });
      engine.start();
    } catch (error) {
      canvas.remove();
      onError(error);
      return;
    }

    return () => {
      engine.dispose();
      canvas.remove();
      delete root.dataset.scene;
    };
  }, [onError]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-testid="webgl-background"
      className="fixed inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-slow ease-expo data-[ready=true]:opacity-100 data-[static=true]:!opacity-50"
    />
  );
};

export default WebGLBackground;
