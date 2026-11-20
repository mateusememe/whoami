import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { profile, socialLinks } from "@/data/portfolio";
import { HAS_NOTES, pagePath, type Page } from "@/i18n/routes";
import { CV_FILES } from "@/seo/files";
import { trackEvent } from "@/lib/analytics";
import type { SectionId } from "@/data/navigation";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";

const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));

interface PageFooterProps {
  /** Where the back link goes: a home page section, or another page (a note goes back to /notes/). */
  back: { section: SectionId } | { page: Page };
  backLabel: string;
}

/** Footer of the inner pages: the year and name, the other pages, the email and a link back to their section. */
/** The pages outside the home page, and the résumé PDF. */
export const SiteLinks = () => {
  const { language, t } = useLanguage();
  return (
    <>
      {HAS_NOTES && (
        <Link to={pagePath(language, { kind: "notes" })} className="link-underline inline-block min-w-6 py-1.5 text-center hover:text-foreground">
          {t("pages.notes")}
        </Link>
      )}
      <Link to={pagePath(language, { kind: "now" })} className="link-underline inline-block min-w-6 py-1.5 text-center hover:text-foreground">
        {t("pages.now")}
      </Link>
      <Link to={pagePath(language, { kind: "uses" })} className="link-underline inline-block min-w-6 py-1.5 text-center hover:text-foreground">
        {t("pages.uses")}
      </Link>
      <a href={`${import.meta.env.BASE_URL}${CV_FILES[language]}`} download type="application/pdf" onClick={() => trackEvent("cv-download")} className="link-underline inline-block min-w-6 py-1.5 text-center hover:text-foreground">
        CV (PDF)
      </a>
    </>
  );
};

export const PageFooter = ({ back, backLabel }: PageFooterProps) => {
  const { language } = useLanguage();
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
        {"page" in back ? (
          <Link to={pagePath(language, back.page)} className="link-underline inline-block py-1.5 hover:text-foreground">
            ← {backLabel}
          </Link>
        ) : (
          <a href={sectionHref(back.section)} onClick={onSectionClick(back.section)} className="link-underline inline-block py-1.5 hover:text-foreground">
            ← {backLabel}
          </a>
        )}
      </span>
    </footer>
  );
};
