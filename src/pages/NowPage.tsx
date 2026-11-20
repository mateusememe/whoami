import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageText } from "@/i18n/pageText";
import { Reveal } from "@/components/ds";
import { InnerPageHeader } from "@/components/InnerPageHeader";
import { PageFooter } from "@/components/PageFooter";
import { nowItems, nowNotes } from "@/data/now";
import { profile, talks } from "@/data/portfolio";
import { pagePath } from "@/i18n/routes";
import { formatDate, formatMonth } from "@/lib/text";

const chip =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 font-mono text-[11px] text-foreground transition-colors duration-base hover:border-signal/50 hover:text-signal";

/**
 * /now: what Mateus is doing at the moment, derived from the same data as
 * the rest of the site (role, degree, newest projects, latest talk and
 * contribution), dated by the last content update.
 */
const NowPage = () => {
  const { language } = useLanguage();
  const t = usePageText();
  const items = nowItems(language, {
    degree: (key) => t(key),
    building: (count, year) => t("now.building", { count, year }),
  });
  const notes = nowNotes[language];

  const meta = (id: string, value?: string) => {
    if (!value) return null;
    if (id === "work") return t("now.since", { date: value });
    if (id === "contribute") return formatMonth(value, language);
    return value;
  };

  return (
    <main data-scene="2" className="relative z-10">
      <article aria-labelledby="now-title" className="shell pb-16 pt-28 sm:pt-32 lg:pt-36">
        <InnerPageHeader
          id="now-title"
          crumb="now"
          title={t("pages.now")}
          lead={t("now.lead", { date: formatDate(profile.updatedAt, language) })}
        />

        <Reveal as="ol" variant="stagger" className="mt-12 border-t border-border/60 lg:mt-16">
          {items.map((item) => (
            <li key={item.id} className="grid gap-x-10 gap-y-3 border-b border-border/60 py-8 sm:py-10 md:grid-cols-12">
              <p className="label text-signal md:col-span-3 md:pt-1.5">{t(`now.${item.id}`)}</p>
              <div className="min-w-0 md:col-span-9">
                <h2
                  lang={item.id === "talk" ? (talks[0].titleLang ?? "pt-BR") : undefined}
                  className="font-display text-display-sm font-semibold text-foreground [overflow-wrap:anywhere]"
                >
                  {item.title}
                </h2>
                {item.meta && (
                  <p className="mt-1.5 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">{meta(item.id, item.meta)}</p>
                )}
                {item.detail && <p className="mt-4 max-w-[62ch] text-body-lg text-muted-foreground text-pretty">{item.detail}</p>}
                {item.links.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.links.map((link) => (
                      <li key={link.label}>
                        {link.page ? (
                          <Link to={pagePath(language, link.page)} className={chip}>
                            {link.label}
                            <ArrowRight size={13} aria-hidden="true" />
                          </Link>
                        ) : (
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className={chip}>
                            {link.label}
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </Reveal>

        {notes.length > 0 && (
          <section aria-labelledby="now-notes" className="mt-12">
            <h2 id="now-notes" className="label mb-4">
              {t("now.notes")}
            </h2>
            <ul className="max-w-[62ch] list-disc space-y-2 pl-5 text-body-lg text-muted-foreground">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <PageFooter back={{ section: "about" }} backLabel={t("nav.about")} />
    </main>
  );
};

export default NowPage;
