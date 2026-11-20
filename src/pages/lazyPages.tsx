import { useEffect, useReducer } from "react";
import { lazyParts, loadPage, type LazyPageKind } from "@/lib/lazy";

/** Formation behind each page while its chunk loads, so the background does not jump. */
const SCENES: Record<LazyPageKind, string> = { project: "4", talk: "5", now: "2", uses: "0", notes: "0", note: "0" };

/**
 * Route element for a lazily split page: the page when its chunk is loaded,
 * a placeholder until then. The page is read from `lazyParts` on every
 * render, never kept in state: React reuses this element when the route
 * changes between two kinds of page (a talk page to a project page), and a
 * stored component would render the previous kind with the new URL.
 */
export const LazyPage = ({ kind }: { kind: LazyPageKind }) => {
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  const Page = lazyParts.pages[kind];

  useEffect(() => {
    if (Page) return;
    let live = true;
    loadPage(kind).then(() => {
      if (live) rerender();
    });
    return () => {
      live = false;
    };
  }, [Page, kind]);

  return Page ? <Page /> : <main data-scene={SCENES[kind]} aria-busy="true" className="min-h-[100svh]" />;
};
