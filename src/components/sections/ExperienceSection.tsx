import { useLanguage } from "@/contexts/LanguageContext";
import { experiences } from "@/data/portfolio";

const ExperienceSection = () => {
  const { language, t } = useLanguage();

  return (
    <section id="experience" className="relative z-10 py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6 sm:mb-8">
          {t("exp.title")}
        </h2>
        <div className="space-y-4 sm:space-y-5">
          {experiences.map((exp, i) => (
            <article
              key={`${exp.company}-${i}`}
              className="glass-card rounded-2xl p-5 sm:p-6 md:p-8 group hover:bg-accent/30 border border-border/40 hover:border-border/70 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                <h3 className="font-display font-semibold text-foreground text-base sm:text-lg">{exp.company}</h3>
                <span className="font-mono text-xs text-muted-foreground">{exp.period[language]}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground/90 font-medium mb-2">{exp.role[language]}</p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">{exp.desc[language]}</p>
              <div className="flex flex-wrap gap-1.5" aria-label="Tecnologias utilizadas">
                {exp.tech.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
