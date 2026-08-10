import { Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { topSkills, techStack } from "@/data/portfolio";

const SkillsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="relative z-10 py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6 sm:mb-8">
          {t("skills.title")}
        </h2>

        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-4 flex items-center gap-3.5 sm:gap-4 border border-border/40 hover:border-border/70 transition-all">
          <div className="w-10 h-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
            <Award size={20} className="text-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-xs sm:text-sm">{t("skills.scholarship")}</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground">UNESP — 2025</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 sm:p-6 mb-4 border border-border/40">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
            {t("skills.topSkills")}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {topSkills.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 sm:px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium border border-border/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-border/40">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
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
