import { Component, lazy, Suspense, useCallback, useState, type ReactNode } from "react";
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
 */
const SceneBackground = () => {
  const [mode, setMode] = useState<"webgl" | "canvas">(() => (supportsWebGL2() ? "webgl" : "canvas"));
  const fallBack = useCallback(() => setMode("canvas"), []);

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
