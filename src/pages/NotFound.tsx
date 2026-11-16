import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Surface } from "@/components/ds";
import { Magnetic } from "@/components/motion/Magnetic";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";

/** Unknown paths (404.html renders the app shell, which lands here). Rendered inside SiteLayout. */
const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { homePath } = useSiteNavigation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    const prevTitle = document.title;
    document.title = `404 — ${t("notFound.title")} | Mateus Mendonça`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", t("notFound.message"));
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDesc);
      robots.remove();
    };
  }, [location.pathname, t]);

  return (
    <main className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-28">
      <Surface className="w-full max-w-lg rounded-[2rem] border-border/50 p-10 text-center sm:p-12">
        <span className="mb-4 block font-mono text-xs text-signal">$ curl -I {location.pathname}</span>
        <span className="block font-display text-display-2xl font-semibold leading-none text-foreground">404</span>
        <h1 className="mt-4 font-serif text-3xl italic text-foreground">{t("notFound.title")}</h1>
        <p className="mb-8 mt-3 text-body-lg text-muted-foreground">{t("notFound.message")}</p>
        <Magnetic>
          <Link
            to={homePath}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-background transition-opacity duration-base hover:opacity-85"
          >
            {t("notFound.backHome")}
          </Link>
        </Magnetic>
      </Surface>
    </main>
  );
};

export default NotFound;
