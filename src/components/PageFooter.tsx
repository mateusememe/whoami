import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { profile, socialLinks } from "@/data/portfolio";
import { pagePath } from "@/i18n/routes";
import { CV_FILES } from "@/seo/files";
import type { SectionId } from "@/data/navigation";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";

const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));

interface PageFooterProps {
  /** Home page section the page belongs to; the back link lands there. */
  section: SectionId;
  backLabel: string;
}

/** Footer of the inner pages: the year and name, the other pages, the email and a link back to their section. */
/** The pages outside the home page, and the résumé PDF. */
export const SiteLinks = () => {
  const { language, t } = useLanguage();
  return (
    <>
      <Link to={pagePath(language, { kind: "now" })} className="link-underline inline-block min-w-6 py-1.5 text-center hover:text-foreground">
        {t("pages.now")}
      </Link>
      <Link to={pagePath(language, { kind: "uses" })} className="link-underline inline-block min-w-6 py-1.5 text-center hover:text-foreground">
        {t("pages.uses")}
      </Link>
      <a href={`${import.meta.env.BASE_URL}${CV_FILES[language]}`} download type="application/pdf" className="link-underline inline-block min-w-6 py-1.5 text-center hover:text-foreground">
        CV (PDF)
      </a>
    </>
  );
};

export const PageFooter = ({ section, backLabel }: PageFooterProps) => {
  const { sectionHref, onSectionClick } = useSiteNavigation();
  return (
    <footer className="shell flex flex-wrap items-center justify-between gap-4 border-t border-border/60 py-8 font-mono text-xs text-muted-foreground">
      <span>
        © {profile.updatedAt.slice(0, 4)} {profile.name}
      </span>
      <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <SiteLinks />
        {mail && (
          <a href={mail.href} className="link-underline inline-block py-1.5 hover:text-foreground">
            {mail.displayText}
          </a>
        )}
        <a href={sectionHref(section)} onClick={onSectionClick(section)} className="link-underline inline-block py-1.5 hover:text-foreground">
          ← {backLabel}
        </a>
      </span>
    </footer>
  );
};
