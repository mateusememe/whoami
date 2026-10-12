import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Surface, TagList } from "@/components/ds";
import { experiences } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Timeline. The rail and node markers echo the WebGL service mesh: the
 * current role is a live (signal) node, past roles are muted.
 */
const ExperienceSection = () => {
  const { language, t } = useLanguage();

  return (
    <Section id="experience" index={sectionIndex("experience")} title={t("exp.title")}>
      <ol className="relative space-y-3.5 sm:space-y-4 before:absolute before:left-[5px] before:top-3 before:bottom-3 before:w-px before:bg-gradient-to-b before:from-signal/60 before:via-border before:to-transparent">
        {experiences.map((exp, i) => {
          const isCurrent = exp.period.en.endsWith("Present");
          return (
            <li key={`${exp.company}-${i}`} className="relative pl-6 sm:pl-8">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-7 sm:top-8 h-[11px] w-[11px] rounded-full ring-4 ring-background",
                  isCurrent ? "bg-signal animate-signal-pulse" : "bg-muted-foreground/40",
                )}
              />
              <Surface as="article" padding="lg" interactive className="hover:bg-accent/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                  <h3 className="font-display font-semibold text-foreground text-base sm:text-lg">{exp.company}</h3>
                  <span className={cn("font-mono text-xs", isCurrent ? "text-signal" : "text-muted-foreground")}>
                    {exp.period[language]}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground/90 font-medium mb-2">{exp.role[language]}</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">{exp.desc[language]}</p>
                <TagList items={exp.tech} label="Tecnologias utilizadas" />
              </Surface>
            </li>
          );
        })}
      </ol>
    </Section>
  );
};

export default ExperienceSection;
