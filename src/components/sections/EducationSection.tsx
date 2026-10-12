import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Surface } from "@/components/ds";
import { education } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";

const EducationSection = () => {
  const { t } = useLanguage();

  return (
    <Section id="education" index={sectionIndex("education")} title={t("edu.title")}>
      <div className="space-y-3.5 sm:space-y-4">
        {education.map((item) => (
          <Surface key={item.school} interactive>
            <h3 className="font-display font-semibold text-foreground text-base sm:text-lg mb-1">{item.school}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{t(item.degreeKey)}</p>
            <p className="font-mono text-[11px] sm:text-xs text-muted-foreground/70 mt-2">{item.period}</p>
          </Surface>
        ))}
      </div>
    </Section>
  );
};

export default EducationSection;
