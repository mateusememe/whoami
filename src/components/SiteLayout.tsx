import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SceneBackground from "@/components/scene/SceneBackground";
import Header from "@/components/Header";
import CommandPalette from "@/components/CommandPalette";
import { Cursor } from "@/components/motion/Cursor";
import { Grain } from "@/components/motion/Grain";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { useAgentTools } from "@/agents/useAgentTools";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { useRouteScroll } from "@/hooks/useRouteScroll";
import { useSceneDirector } from "@/motion/useSceneDirector";
import { loadPage } from "@/lib/lazy";

/**
 * Shell shared by the home page and the project pages. The WebGL layer,
 * header, grain and cursor stay mounted across client-side navigation, so
 * the particle field keeps running and morphs to the next page's formation
 * instead of starting over. Each page names its formations with `data-scene`.
 */
const SiteLayout = () => {
  useSceneDirector();
  useRouteScroll();
  useDocumentHead();
  useAgentTools();

  // Fetch the project page chunk once the browser is idle, so opening a project is instant.
  useEffect(() => {
    if (typeof window.requestIdleCallback !== "function") return;
    const id = window.requestIdleCallback(() => void loadPage("project"), { timeout: 5000 });
    return () => window.cancelIdleCallback(id);
  }, []);

  return (
    // overflow-x: clip (not hidden) so `position: sticky` scenes keep working.
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <SmoothScroll />
      <SceneBackground />
      <Header />
      <Outlet />
      <CommandPalette />
      <Grain />
      <Cursor />
    </div>
  );
};

export default SiteLayout;
