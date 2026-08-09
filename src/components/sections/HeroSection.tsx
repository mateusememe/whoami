import { Instagram, Mail, Linkedin, User, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { socialLinks, type SocialLink } from "@/data/portfolio";

const renderSocialIcon = (iconName: SocialLink["iconName"]) => {
  switch (iconName) {
    case "Instagram":
      return <Instagram size={18} />;
    case "X":
      return <span className="text-sm font-bold leading-none">𝕏</span>;
    case "Discord":
      return <span className="text-xs font-mono font-bold leading-none">DC</span>;
    case "Linkedin":
      return <Linkedin size={18} />;
    case "Mail":
      return <Mail size={18} />;
    case "Github":
      return <Github size={18} />;
    default:
      return null;
  }
};

const HeroSection = () => {
  const { t } = useLanguage();

  // Social links for the hero section
  const heroSocials = socialLinks.filter((s) =>
    ["Instagram", "X", "Discord", "Linkedin", "Mail"].includes(s.iconName)
  );

  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-6 pt-16">
      <div className="text-center max-w-3xl mx-auto animate-fade-in">
        <div
          role="img"
          aria-label="Avatar de Mateus Mendonça Monteiro"
          className="w-36 h-36 rounded-2xl mx-auto mb-8 flex items-center justify-center overflow-hidden glass-card backdrop-blur-xl shadow-lg border border-border/40"
        >
          <User size={48} className="text-muted-foreground" aria-hidden="true" />
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-3">
          Mateus Mendonça Monteiro
        </h1>

        <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase mb-2">
          {t("hero.title")}
        </p>

        <p className="font-mono text-xs text-muted-foreground/70 mb-6 max-w-2xl mx-auto leading-relaxed">
          {t("hero.subtitle")}
        </p>

        <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          {t("hero.summary")}
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap" aria-label="Links de redes sociais">
          {heroSocials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={social.label}
            >
              {renderSocialIcon(social.iconName)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
