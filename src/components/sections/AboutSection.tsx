import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative z-10 py-8 sm:py-10 md:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4 sm:mb-6">
          {t("about.title")}
        </h2>
        <div className="glass-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/40 hover:border-border/70 transition-colors">
          <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
            {t("about.text")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
