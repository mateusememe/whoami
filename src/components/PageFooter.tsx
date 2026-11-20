import { profile, socialLinks } from "@/data/portfolio";
import type { SectionId } from "@/data/navigation";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";

const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));

interface PageFooterProps {
  /** Home page section the page belongs to; the back link lands there. */
  section: SectionId;
  backLabel: string;
}

/** Footer of the inner pages: the year and name, the email and a link back to their section. */
export const PageFooter = ({ section, backLabel }: PageFooterProps) => {
  const { sectionHref, onSectionClick } = useSiteNavigation();
  return (
    <footer className="shell flex flex-wrap items-center justify-between gap-4 border-t border-border/60 py-8 font-mono text-xs text-muted-foreground">
      <span>
        © {profile.updatedAt.slice(0, 4)} {profile.name}
      </span>
      <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
