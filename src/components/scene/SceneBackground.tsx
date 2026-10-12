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

  useEffect(() => {
    setMode(supportsWebGL2() ? "webgl" : "canvas");
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
