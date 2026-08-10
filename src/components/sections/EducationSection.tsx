import { useLanguage } from "@/contexts/LanguageContext";
import { education } from "@/data/portfolio";

const EducationSection = () => {
  const { t } = useLanguage();

  return (
    <section id="education" className="relative z-10 py-8 sm:py-10 md:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4 sm:mb-6">
          {t("edu.title")}
        </h2>
        <div className="space-y-3.5 sm:space-y-4">
          {education.map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-border/40 hover:border-border/70 transition-all"
            >
              <h3 className="font-display font-semibold text-foreground text-base sm:text-lg mb-1">{item.school}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t(item.degreeKey)}</p>
              <p className="font-mono text-[11px] sm:text-xs text-muted-foreground/70 mt-2">{item.period}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
