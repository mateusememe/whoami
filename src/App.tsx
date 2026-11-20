import { useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { LanguageProvider, useLanguage, type Language } from "@/contexts/LanguageContext";
import { languageFromPath, pagePath, parseRoute, stripBase } from "@/i18n/routes";
import SiteLayout from "@/components/SiteLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LazyPage } from "./pages/lazyPages";

interface AppProvidersProps {
  children: ReactNode;
  /** Language named by the URL, when there is one. */
  routeLanguage?: Language | null;
}

/** Context providers shared by the browser app and the build-time prerender (entry-server.tsx). */
export const AppProviders = ({ children, routeLanguage }: AppProvidersProps) => (
  <LanguageProvider routeLanguage={routeLanguage ?? undefined}>{children}</LanguageProvider>
);

const sameUrl = (a: string, b: string) => a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

/**
 * Keeps the URL and the language in step. Switching language in the header
 * moves to the same page in that language (replacing the history entry,
 * keeping the hash and the scroll position), so every URL always shows its
 * own language.
 */
const LanguageRouteSync = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { page } = parseRoute(location.pathname);
    if (!page) return;
    const target = pagePath(language, page);
    if (!sameUrl(location.pathname, target)) {
      navigate({ pathname: target, hash: location.hash }, { replace: true });
    }
  }, [language, location.pathname, location.hash, navigate]);

  return null;
};

/**
 * Pages answer in three languages (src/i18n/routes.ts); the language comes
 * from the path. The sync component is part of this tree on purpose: the
 * server and the browser must render the same component tree, or `useId`
 * values differ and hydration fails.
 */
export const AppRoutes = () => (
  <>
    <LanguageRouteSync />
    <Routes>
      <Route element={<SiteLayout />}>
        {["", "/pt", "/es"].map((prefix) => [
          <Route key={`${prefix}/`} path={prefix || "/"} element={<Index />} />,
          <Route key={`${prefix}/projects`} path={`${prefix}/projects/:id`} element={<LazyPage kind="project" />} />,
          <Route key={`${prefix}/talks`} path={`${prefix}/talks/:id`} element={<LazyPage kind="talk" />} />,
          <Route key={`${prefix}/now`} path={`${prefix}/now`} element={<LazyPage kind="now" />} />,
          <Route key={`${prefix}/uses`} path={`${prefix}/uses`} element={<LazyPage kind="uses" />} />,
        ])}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </>
);

const App = () => {
  const base = import.meta.env.BASE_URL;
  // Read once: the URL the page was loaded at decides the first render.
  const [routeLanguage] = useState(() => languageFromPath(stripBase(window.location.pathname, base)));

  return (
    <AppProviders routeLanguage={routeLanguage}>
      <BrowserRouter basename={base}>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
