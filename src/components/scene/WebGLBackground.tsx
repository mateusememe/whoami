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

    let engine: Engine;
    try {
      engine = new Engine({
        canvas,
        quality: getQualitySettings(),
        reducedMotion: prefersReducedMotion(),
        onFirstFrame: () => host.setAttribute("data-ready", "true"),
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
    };
  }, [onError]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-testid="webgl-background"
      className="fixed inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-slow ease-expo data-[ready=true]:opacity-100"
    />
  );
};

export default WebGLBackground;
