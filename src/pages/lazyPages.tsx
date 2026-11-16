import { useEffect, useState, type ComponentType } from "react";
import { lazyParts, loadProjectPage } from "@/lib/lazy";

/** Route element for /projects/:id: the page when its chunk is loaded, a placeholder until then. */
export const ProjectPageRoute = () => {
  const [Page, setPage] = useState<ComponentType | null>(() => lazyParts.projectPage);

  useEffect(() => {
    if (Page) return;
    let live = true;
    loadProjectPage().then(() => {
      if (live) setPage(() => lazyParts.projectPage);
    });
    return () => {
      live = false;
    };
  }, [Page]);

  // Same scene as the page, so the background does not jump while the chunk arrives.
  return Page ? <Page /> : <main data-scene="4" aria-busy="true" className="min-h-[100svh]" />;
};
