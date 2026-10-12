import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Surface } from "@/components/ds";
import { sectionIndex } from "@/data/navigation";

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <Section id="about" index={sectionIndex("about")} title={t("about.title")}>
      <Surface padding="lg" interactive>
        <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">{t("about.text")}</p>
      </Surface>
    </Section>
  );
};

export default AboutSection;
