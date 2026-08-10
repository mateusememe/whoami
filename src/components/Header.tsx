import { Moon, Sun } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

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
  const [dark, setDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
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
  }, [dark]);

  const navItems = ["about", "experience", "education", "skills", "projects", "contact"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <a
          href="#root"
          className="font-mono text-sm font-semibold tracking-wider text-foreground/80 hover:text-foreground transition-colors"
          aria-label="Ir para o topo"
        >
          MM
        </a>

        <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase"
            >
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" role="group" aria-label="Seleção de idioma">
            {(Object.keys(flags) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                aria-label={`Mudar para ${langNames[lang]}`}
                aria-pressed={language === lang}
                className={`text-sm px-1.5 py-0.5 rounded transition-all ${
                  language === lang
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">{flags[lang]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setDark((prev) => !prev)}
            aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
