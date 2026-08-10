import { Instagram, Mail, Linkedin, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { socialLinks, type SocialLink } from "@/data/portfolio";
import ProfileCarousel from "@/components/ProfileCarousel";

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
    <section className="min-h-screen flex items-center justify-center relative z-10 px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="text-center max-w-3xl mx-auto animate-fade-in">
        {/* Profile Avatar & Teaching Carousel */}
        <ProfileCarousel />

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-3">
          Mateus Mendonça Monteiro
        </h1>

        <p className="font-mono text-xs sm:text-sm text-muted-foreground tracking-wider uppercase mb-2">
          {t("hero.title")}
        </p>

        <p className="font-mono text-[11px] sm:text-xs text-muted-foreground/70 mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
          {t("hero.subtitle")}
        </p>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto px-2">
          {t("hero.summary")}
        </p>

        <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap" aria-label="Links de redes sociais">
          {heroSocials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all focus:outline-none focus:ring-2 focus:ring-ring border border-border/30"
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
