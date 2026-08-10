import { Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { topSkills, techStack } from "@/data/portfolio";

const SkillsSection = () => {
  const { language, t } = useLanguage();

  return (
    <section id="skills" className="relative z-10 py-8 sm:py-10 md:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4 sm:mb-6">
          {t("skills.title")}
        </h2>

        {/* ProUni Scholarship Card */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4 flex items-start gap-3.5 sm:gap-4 border border-border/40 hover:border-border/70 transition-all">
          <div className="w-10 h-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0 mt-0.5">
            <Award size={20} className="text-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-xs sm:text-sm">
              {t("skills.scholarship")}
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-mono mt-0.5">
              {t("skills.scholarshipIssuer")}
            </p>
            <p className="text-xs text-muted-foreground/90 mt-1.5 leading-relaxed">
              {t("skills.scholarshipDesc")}
            </p>
          </div>
        </div>

        {/* Top Skills */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4 border border-border/40">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2.5 sm:mb-3">
            {t("skills.topSkills")}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {topSkills.map((s, idx) => {
              const label = typeof s === "string" ? s : s[language] || s.en;
              return (
                <span
                  key={typeof s === "string" ? s : s.en || idx}
                  className="text-xs px-2.5 sm:px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium border border-border/20"
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border/40">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2.5 sm:mb-3">
            {t("skills.stack")}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {techStack.map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full bg-accent/70 text-accent-foreground border border-border/20 hover:bg-accent transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
