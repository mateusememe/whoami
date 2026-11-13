import { useEffect } from "react";
import { registerAgentTools } from "@/agents/webmcp";
import { useLanguage } from "@/contexts/LanguageContext";
import { scrollToTarget } from "@/motion/scroll";

/** Offers the page's WebMCP tools to in-browser agents, in the language being shown. */
export function useAgentTools(): void {
  const { language } = useLanguage();

  useEffect(() => {
    const base = import.meta.env.BASE_URL || "/";
    return registerAgentTools({
      language,
      siteUrl: `${window.location.origin}${base}`.replace(/\/+$/, ""),
      goToSection: (id) => {
        const element = document.getElementById(id);
        if (element) scrollToTarget(element);
      },
    });
  }, [language]);
}
