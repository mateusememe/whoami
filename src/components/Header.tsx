import { Moon, Sun } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/ds";
import ScrollProgress from "@/components/ScrollProgress";
import { NAV_ITEMS } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

const flags: Record<Language, string> = { pt: "🇧🇷", en: "🇺🇸", es: "🇪🇸" };
const langNames: Record<Language, string> = { pt: "Português", en: "English", es: "Español" };
const THEME_STORAGE_KEY = "portfolio_theme";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved !== null) {
    return saved === "dark";
  }
  return true; // Default to dark mode for hacker/terminal aesthetic
}

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  // null until mounted: the first render matches the prerendered HTML (dark),
  // then the saved preference is read. index.html applies the class before
  // first paint, so there is no theme flash.
  const [darkPreference, setDarkPreference] = useState<boolean | null>(null);
  const dark = darkPreference ?? true;
  const activeSection = useActiveSection(NAV_ITEMS);

  useEffect(() => {
    setDarkPreference(getInitialTheme());
  }, []);

  useEffect(() => {
    if (darkPreference === null) return;
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      // ignore storage errors
    }

    // Dynamically update favicon based on active theme
    const svgFavicon = document.querySelector<HTMLLinkElement>("link[rel='icon'][type='image/svg+xml']");
    if (svgFavicon) {
      const basePath = import.meta.env.BASE_URL || "/";
      const normalized = basePath.endsWith("/") ? basePath : `${basePath}/`;
      svgFavicon.href = `${normalized}favicon-${dark ? "dark" : "light"}.svg`;
    }
  }, [darkPreference, dark]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        <a
          href="#root"
          className="font-mono text-sm sm:text-base font-semibold tracking-wider text-foreground/80 hover:text-foreground transition-colors p-1"
          aria-label="Ir para o topo"
        >
          MM
        </a>

        <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item;
            return (
              <a
                key={item}
                href={`#${item}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative py-1 text-xs font-medium uppercase tracking-wide transition-colors duration-fast",
                  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-signal after:transition-transform after:duration-base after:ease-expo",
                  isActive ? "text-foreground after:scale-x-100" : "text-muted-foreground hover:text-foreground after:scale-x-0",
                )}
              >
                {t(`nav.${item}`)}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-0.5 sm:gap-1" role="group" aria-label="Seleção de idioma">
            {(Object.keys(flags) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                aria-label={`Mudar para ${langNames[lang]}`}
                aria-pressed={language === lang}
                className={`min-w-[34px] min-h-[34px] sm:min-w-[30px] sm:min-h-[30px] flex items-center justify-center text-sm px-1.5 py-0.5 rounded-lg transition-all ${
                  language === lang
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">{flags[lang]}</span>
              </button>
            ))}
          </div>

          <IconButton
            tone="ghost"
            size="md"
            onClick={() => setDarkPreference(!dark)}
            aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </IconButton>
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
};

export default Header;
