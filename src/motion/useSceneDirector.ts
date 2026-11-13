import { useEffect } from "react";
import { scrollState } from "@/motion/scroll";
import { computeMorph, sceneState, type SceneSection } from "@/motion/sceneState";
import { addTick, TICK } from "@/motion/ticker";

/**
 * Feeds the WebGL engine from the DOM. Each frame it turns the scroll
 * position into a formation value (from `[data-scene]` sections) and reports
 * where the portrait should sit (the `[data-portrait-stage]` element).
 *
 * Section offsets are cached and re-read only when the layout changes.
 */
export function useSceneDirector(): void {
  useEffect(() => {
    let sections: SceneSection[] = [];
    let stage: HTMLElement | null = null;
    let stale = true;

    const read = () => {
      stale = false;
      const y = window.scrollY;
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((element) => ({
        top: element.getBoundingClientRect().top + y,
        formation: Number(element.dataset.scene) || 0,
      }));
      stage = document.querySelector<HTMLElement>("[data-portrait-stage]");
    };

    const invalidate = () => {
      stale = true;
    };
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(invalidate) : null;
    resizeObserver?.observe(document.body);
    window.addEventListener("resize", invalidate);

    const stop = addTick(() => {
      if (stale) read();
      const viewport = window.innerHeight;
      sceneState.morph = computeMorph(sections, scrollState.y, viewport);

      // The portrait follows its DOM stage while that formation is on screen.
      if (stage && sceneState.morph > 0.05 && sceneState.morph < 1.95) {
        const rect = stage.getBoundingClientRect();
        sceneState.portrait.x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
        sceneState.portrait.y = 1 - ((rect.top + rect.height / 2) / viewport) * 2;
        sceneState.portrait.size = Math.min(rect.width, rect.height) / viewport;
      }
    }, TICK.scene);

    return () => {
      stop();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", invalidate);
      sceneState.morph = 0;
    };
  }, []);
}
