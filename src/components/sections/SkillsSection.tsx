import { Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Surface, TagList } from "@/components/ds";
import { topSkills, techStack } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";

const SkillsSection = () => {
  const { language, t } = useLanguage();
  const topSkillLabels = topSkills.map((skill) => skill[language] || skill.en);

  return (
    <Section id="skills" index={sectionIndex("skills")} title={t("skills.title")}>
      {/* ProUni Scholarship Card */}
      <Surface padding="sm" interactive className="mb-3 sm:mb-4 flex items-start gap-3.5 sm:gap-4">
        <div className="w-10 h-10 rounded-xl bg-signal/10 border border-signal/20 flex items-center justify-center shrink-0 mt-0.5">
          <Award size={20} className="text-signal" />
        </div>
        <div>
          <p className="font-display font-semibold text-foreground text-xs sm:text-sm">{t("skills.scholarship")}</p>
          <p className="text-[11px] sm:text-xs text-muted-foreground font-mono mt-0.5">{t("skills.scholarshipIssuer")}</p>
          <p className="text-xs text-muted-foreground/90 mt-1.5 leading-relaxed">{t("skills.scholarshipDesc")}</p>
        </div>
      </Surface>

      {/* Top Skills */}
      <Surface padding="sm" className="mb-3 sm:mb-4">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2.5 sm:mb-3">
          {t("skills.topSkills")}
        </p>
        <TagList items={topSkillLabels} label={t("skills.topSkills")} size="sm" className="gap-1.5 sm:gap-2" />
      </Surface>

      {/* Tech Stack */}
      <Surface padding="sm">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2.5 sm:mb-3">
          {t("skills.stack")}
        </p>
        <TagList items={techStack} label={t("skills.stack")} className="gap-1.5 sm:gap-2" />
      </Surface>
    </Section>
  );
};

export default SkillsSection;
