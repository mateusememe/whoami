import { useEffect, useState, type ComponentType } from "react";
import { lazyParts, loadPage, type LazyPageKind } from "@/lib/lazy";

/** Formation behind each page while its chunk loads, so the background does not jump. */
const SCENES: Record<LazyPageKind, string> = { project: "4", talk: "5", now: "2", uses: "0", notes: "0", note: "0" };

/** Route element for a lazily split page: the page when its chunk is loaded, a placeholder until then. */
export const LazyPage = ({ kind }: { kind: LazyPageKind }) => {
  const [Page, setPage] = useState<ComponentType | null>(() => lazyParts.pages[kind] ?? null);

  useEffect(() => {
    if (Page) return;
    let live = true;
    loadPage(kind).then(() => {
      if (live) setPage(() => lazyParts.pages[kind] ?? null);
    });
    return () => {
      live = false;
    };
  }, [Page, kind]);

  return Page ? <Page /> : <main data-scene={SCENES[kind]} aria-busy="true" className="min-h-[100svh]" />;
};
