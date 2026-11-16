import { useEffect } from "react";
import { registerAgentTools } from "@/agents/webmcp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";

/** Offers the site's WebMCP tools to in-browser agents, in the language being shown. */
export function useAgentTools(): void {
  const { language } = useLanguage();
  const { goToSection } = useSiteNavigation();

  useEffect(() => {
    const base = import.meta.env.BASE_URL || "/";
    return registerAgentTools({
      language,
      siteUrl: `${window.location.origin}${base}`.replace(/\/+$/, ""),
      // From a project page this goes home first, then to the section.
      goToSection,
    });
  }, [language, goToSection]);
}
