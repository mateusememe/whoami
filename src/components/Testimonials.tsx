import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal } from "@/components/ds";
import { HTML_LANG } from "@/i18n/routes";
import { testimonials as allTestimonials, type Testimonial } from "@/data/portfolio";
import { formatMonth } from "@/lib/dates";

/**
 * Recommendations from people Mateus worked with, below the roles. Renders
 * nothing while the list is empty. A quote shows in the page language when
 * a translation exists, marked as translated, else in its own language
 * (with `lang` set, so screen readers switch voice).
 */
export const Testimonials = ({ items = allTestimonials }: { items?: Testimonial[] }) => {
  const { language, t } = useLanguage();
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-title" className="mt-16 lg:col-span-7 lg:col-start-6">
      <h3 id="testimonials-title" className="label mb-6">
        {t("testimonials.title")}
      </h3>
      <Reveal as="ul" variant="stagger" className="grid gap-6">
        {items.map((item) => {
          const translated = item.quoteLanguage !== language ? item.translations?.[language] : undefined;
          const quoteLanguage = translated ? language : item.quoteLanguage;
          return (
            <li key={item.id}>
              <figure className="glass-card rounded-[1.5rem] p-6 sm:p-8">
                <blockquote lang={HTML_LANG[quoteLanguage]} className="text-body-lg text-foreground text-pretty">
                  “{translated ?? item.quote}”
                </blockquote>
                <figcaption className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                  <span>
                    <span className="block font-display text-lg font-semibold text-foreground">{item.name}</span>
                    <span className="block font-mono text-xs text-muted-foreground">
                      {item.role[language]} · {item.company} · {formatMonth(item.date, language)}
                    </span>
                    <span className="mt-1 block font-mono text-xs text-muted-foreground">{item.relation[language]}</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                    {translated && <span>{t("testimonials.translated")}</span>}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline inline-flex items-center gap-1 py-1.5 hover:text-foreground"
                      >
                        {t("testimonials.source")}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    )}
                  </span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
};
