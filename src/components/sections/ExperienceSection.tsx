import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, SectionHeading, TagList } from "@/components/ds";
import { experiences, portfolioStats } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";
import { useFocusItems } from "@/motion/useFocusItems";
import { useProgress } from "@/motion/useProgress";
import { cn } from "@/lib/utils";
import { Testimonials } from "@/components/Testimonials";

const YEARS = Array.from(
  { length: portfolioStats.lastYear - portfolioStats.firstYear + 1 },
  (_, offset) => portfolioStats.lastYear - offset,
);

/**
 * Trajectory. The heading and a year scale stay pinned on the left while the
 * roles scroll past on the right; the role nearest the middle of the screen
 * is in focus: its company name takes the signal color, its top rule lights
 * up and the block settles into place. Text keeps full contrast in every
 * state. A signal marker travels down the scale with the scroll.
 */
const ExperienceSection = () => {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  useProgress(sectionRef);
  useFocusItems(listRef);

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-labelledby="experience-title"
      data-scene="2"
      className="relative z-10 py-section"
    >
      <div className="shell grid gap-x-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="experience-title"
              index={sectionIndex("experience")}
              title={t("exp.title")}
              size="lg"
              description={t("exp.lead", {
                roles: portfolioStats.roles,
                companies: portfolioStats.companies,
                from: portfolioStats.firstYear,
              })}
            />

            {/* Year scale with a marker driven by the section's scroll progress */}
            <div aria-hidden="true" className="relative hidden h-[34vh] max-h-80 lg:block">
              <div className="absolute inset-y-0 left-[5px] w-px bg-gradient-to-b from-signal/60 via-border to-border/30" />
              <span
                className="absolute left-0 h-[11px] w-[11px] -translate-y-1/2 rounded-full bg-signal animate-signal-pulse"
                style={{ top: "calc(clamp(0, (var(--progress, 0) - 0.2) / 0.6, 1) * 100%)" }}
              />
              <ul className="flex h-full flex-col justify-between pl-8">
                {YEARS.map((year) => (
                  <li key={year} className="font-mono text-xs leading-none text-muted-foreground">
                    {year}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ol ref={listRef} className="lg:col-span-7">
          {experiences.map((exp, i) => {
            const isCurrent = exp.period.en.endsWith("Present");
            return (
              <li
                key={`${exp.company}-${i}`}
                className="focus-item border-t py-10 sm:py-14"
              >
                <article>
                  <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <p className={cn("font-mono text-xs", isCurrent ? "text-signal" : "text-muted-foreground")}>
                      {exp.period[language]}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">{exp.location}</p>
                    {isCurrent && (
                      <p className="label inline-flex items-center gap-2 text-signal">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal animate-signal-pulse" />
                        {t("exp.current")}
                      </p>
                    )}
                  </div>

                  <Reveal variant="mask">
                    <h3 className="font-display text-display-md font-semibold text-foreground">{exp.company}</h3>
                  </Reveal>
                  <p className="mt-1.5 font-serif text-xl italic text-foreground/75 sm:text-2xl">{exp.role[language]}</p>

                  <p className="mt-5 max-w-[62ch] text-body-lg text-muted-foreground text-pretty">{exp.desc[language]}</p>
                  {exp.results?.length ? (
                    <dl aria-label={t("exp.results")} className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                      {exp.results.map((result) => (
                        <div key={result.label.en} className="flex max-w-[15rem] flex-col-reverse gap-1">
                          <dt className="font-mono text-[11px] leading-snug text-muted-foreground sm:text-xs">
                            {result.label[language]}
                          </dt>
                          <dd className="font-display text-display-sm font-semibold tabular-nums leading-none text-signal">
                            {result.value[language]}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <TagList items={exp.tech} label={t("a11y.expTech")} tone="outline" className="mt-6" />
                </article>
              </li>
            );
          })}
        </ol>
        <Testimonials />
      </div>
    </section>
  );
};

export default ExperienceSection;
