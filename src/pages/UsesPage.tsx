import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageText } from "@/i18n/pageText";
import { Reveal } from "@/components/ds";
import { InnerPageHeader } from "@/components/InnerPageHeader";
import { PageFooter } from "@/components/PageFooter";
import { uses, usesCheckedAt } from "@/data/uses";
import { formatDate } from "@/lib/text";

/** /uses: the machine and the tools in daily use, grouped by area. */
const UsesPage = () => {
  const { language } = useLanguage();
  const t = usePageText();

  return (
    <main data-scene="0" className="relative z-10">
      <article aria-labelledby="uses-title" className="shell pb-16 pt-28 sm:pt-32 lg:pt-36">
        <InnerPageHeader
          id="uses-title"
          crumb="uses"
          title={t("pages.uses")}
          lead={t("uses.lead", { date: formatDate(usesCheckedAt, language) })}
        />

        <div className="mt-12 lg:mt-16">
          {uses.map((group) => (
            <section
              key={group.id}
              aria-labelledby={`uses-${group.id}`}
              className="grid gap-x-10 gap-y-4 border-t border-border/60 py-8 sm:py-10 md:grid-cols-12"
            >
              <h2 id={`uses-${group.id}`} className="label text-signal md:col-span-3 md:pt-1.5">
                {group.title[language]}
              </h2>
              <Reveal as="ul" variant="stagger" className="grid gap-x-10 gap-y-6 sm:grid-cols-2 md:col-span-9">
                {group.items.map((item) => (
                  <li key={item.name} className="min-w-0">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline inline-flex items-center gap-1.5 py-0.5 transition-colors duration-base hover:text-signal"
                        >
                          {item.name}
                          <ArrowUpRight size={15} aria-hidden="true" className="text-muted-foreground" />
                        </a>
                      ) : (
                        item.name
                      )}
                    </h3>
                    <p className="mt-1.5 text-body-lg text-muted-foreground text-pretty">{item.note[language]}</p>
                  </li>
                ))}
              </Reveal>
            </section>
          ))}
        </div>
      </article>

      <PageFooter section="skills" backLabel={t("nav.skills")} />
    </main>
  );
};

export default UsesPage;
