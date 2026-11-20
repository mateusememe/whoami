import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal } from "@/components/ds";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";

interface InnerPageHeaderProps {
  /** id of the h1, for the article's aria-labelledby. */
  id: string;
  /** Last breadcrumb segment, as in the URL. */
  crumb: string;
  title: string;
  lead: ReactNode;
}

/** Breadcrumb, title and lead of a single page (/now, /uses, /notes). */
export const InnerPageHeader = ({ id, crumb, title, lead }: InnerPageHeaderProps) => {
  const { t } = useLanguage();
  const { homePath } = useSiteNavigation();
  return (
    <header>
      <nav aria-label={t("a11y.breadcrumb")} className="page-fade label flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link to={homePath} className="link-underline inline-block py-1.5 hover:text-foreground">
          ~/whoami
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-foreground">
          {crumb}
        </span>
      </nav>
      <Reveal variant="mask">
        <h1 id={id} className="mt-8 font-display text-display-xl font-semibold text-foreground lg:mt-12">
          {title}
        </h1>
      </Reveal>
      <p className="page-fade mt-5 max-w-[62ch] text-body-lg text-muted-foreground text-pretty" style={{ "--i": 1 } as CSSProperties}>
        {lead}
      </p>
    </header>
  );
};
