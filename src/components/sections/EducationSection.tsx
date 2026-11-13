import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, Section } from "@/components/ds";
import { certifications, education, spokenLanguages } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";

/** Degrees as full-width rows. On hover a row opens up and a signal wash rises behind it. */
const EducationSection = () => {
  const { language, t } = useLanguage();

  return (
    <Section id="education" index={sectionIndex("education")} title={t("edu.title")} scene={3}>
      <Reveal as="ul" variant="stagger" className="border-t border-border/60">
        {education.map((item, index) => (
          <li
            key={item.school}
            className="row-link grid items-baseline gap-x-8 gap-y-2 border-b border-border/60 py-8 sm:py-10 md:grid-cols-12"
          >
            <span aria-hidden="true" className="font-mono text-xs text-signal md:col-span-1">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-display-md font-semibold text-foreground md:col-span-5">{item.school}</h3>
            <p className="font-serif text-xl italic text-foreground/75 sm:text-2xl md:col-span-3">{t(item.degreeKey)}</p>
            <div className="flex items-center justify-between gap-4 md:col-span-3 md:justify-end">
              <div className="md:text-right">
                <p className="font-mono text-xs text-muted-foreground">{item.period[language]}</p>
                {item.current && (
                  <p className="label mt-2 inline-flex items-center gap-2 text-signal">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal animate-signal-pulse" />
                    {t("edu.inProgress")}
                  </p>
                )}
              </div>
              <ArrowUpRight aria-hidden="true" size={22} className="row-arrow shrink-0 text-signal" />
            </div>
          </li>
        ))}
      </Reveal>

      <Reveal as="dl" variant="stagger" className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        <div>
          <dt className="label mb-3">{t("edu.languages")}</dt>
          {spokenLanguages.map((item) => (
            <dd key={item.code} className="flex items-baseline justify-between gap-4 border-b border-border/60 py-3">
              <span className="font-display text-display-sm font-medium text-foreground">{item.name[language]}</span>
              <span className="font-mono text-xs text-muted-foreground">{item.level[language]}</span>
            </dd>
          ))}
        </div>
        <div>
          <dt className="label mb-3">{t("edu.certifications")}</dt>
          {certifications.map((item) => (
            <dd key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border/60 py-3">
              <span className="font-display text-display-sm font-medium text-foreground">{item.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{item.detail[language]}</span>
            </dd>
          ))}
        </div>
      </Reveal>
    </Section>
  );
};

export default EducationSection;
