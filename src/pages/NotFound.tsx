import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SceneBackground from "@/components/scene/SceneBackground";
import Header from "@/components/Header";
import { Surface } from "@/components/ds";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    const prevTitle = document.title;
    document.title = "404 — Página não encontrada | Mateus Mendonça";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", "Esta página não existe. Volte para o portfólio de Mateus Mendonça Monteiro.");
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDesc);
      robots.remove();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden flex flex-col justify-between">
      <SceneBackground />
      <Header />
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
        <Surface className="p-8 sm:p-8 max-w-md w-full text-center border-border/50 shadow-xl">
          <span className="font-mono text-xs text-signal block mb-3">$ curl -I {location.pathname}</span>
          <span className="font-mono text-5xl font-bold text-foreground block mb-2">404</span>
          <h1 className="font-display text-xl font-semibold text-foreground mb-2">
            {t("notFound.title")}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {t("notFound.message")}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center font-mono text-xs uppercase px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {t("notFound.backHome")}
          </Link>
        </Surface>
      </main>
    </div>
  );
};

export default NotFound;
