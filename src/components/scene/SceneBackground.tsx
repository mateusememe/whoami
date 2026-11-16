import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import BinaryBackground from "@/components/BinaryBackground";
import { supportsWebGL2 } from "@/webgl/core/capabilities";

const WebGLBackground = lazy(() => import("@/components/scene/WebGLBackground"));

/** Catches a failed chunk download or a render error in the WebGL tree. */
class FallbackBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Background layer selector:
 *   WebGL 2 available  -> three.js service mesh (lazy chunk)
 *   otherwise / error  -> 2D canvas binary rain
 *
 * Renders nothing until mounted, so the prerendered HTML and the first
 * client render agree.
 */
const SceneBackground = () => {
  const [mode, setMode] = useState<"pending" | "webgl" | "canvas">("pending");
  const fallBack = useCallback(() => setMode("canvas"), []);

  // Start the background when the main thread is idle after hydration (or
  // after 1.2 s at the latest), so building the scene never competes with
  // the first paint or the first interaction.
  useEffect(() => {
    const start = () => setMode(supportsWebGL2() ? "webgl" : "canvas");
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(start, 200);
    return () => window.clearTimeout(timer);
  }, []);

  if (mode === "pending") return null;
  if (mode === "canvas") return <BinaryBackground />;

  return (
    <FallbackBoundary fallback={<BinaryBackground />}>
      <Suspense fallback={null}>
        <WebGLBackground onError={fallBack} />
      </Suspense>
    </FallbackBoundary>
  );
};

export default SceneBackground;
