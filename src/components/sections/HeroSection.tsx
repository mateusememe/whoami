import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { socialLinks } from "@/data/portfolio";
import ProfileCarousel from "@/components/ProfileCarousel";
import { renderSocialIcon } from "@/components/SocialIcons";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 pt-16 sm:pt-20 pb-12">
      <div className="text-center max-w-3xl mx-auto animate-fade-in my-auto">
        {/* Profile Avatar & Teaching Carousel */}
        <ProfileCarousel />

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-2 sm:mb-3">
          Mateus Mendonça Monteiro
        </h1>

        <p className="font-mono text-xs sm:text-sm text-muted-foreground tracking-wider uppercase mb-2">
          {t("hero.title")}
        </p>

        <p className="font-mono text-[11px] sm:text-xs text-muted-foreground/70 mb-4 sm:mb-5 max-w-2xl mx-auto leading-relaxed px-2">
          {t("hero.subtitle")}
        </p>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto px-2">
          {t("hero.summary")}
        </p>

        {/* Channels / Profiles Links */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap" aria-label="Links de redes sociais e perfis acadêmicos">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all focus:outline-none focus:ring-2 focus:ring-ring border border-border/30"
              aria-label={social.label}
            >
              {renderSocialIcon(social.iconName, 18)}
            </a>
          ))}
        </div>
      </div>

      {/* Subtle animated scroll down indicator */}
      <a
        href="#about"
        aria-label="Rolar para a seção sobre mim"
        className="mt-auto pt-4 flex flex-col items-center text-muted-foreground/50 hover:text-foreground transition-colors group focus:outline-none"
      >
        <span className="sr-only">Scroll down</span>
        <ChevronDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
};

export default HeroSection;
