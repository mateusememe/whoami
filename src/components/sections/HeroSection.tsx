import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { socialLinks } from "@/data/portfolio";
import ProfileCarousel from "@/components/ProfileCarousel";
import { renderSocialIcon } from "@/components/SocialIcons";
import { IconButton } from "@/components/ds";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 pt-16 sm:pt-20 pb-12">
      {/* Scrim: keeps hero copy legible over the WebGL mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_42%_40%_at_50%_52%,hsl(var(--background)/0.82),transparent)]"
      />
      <div className="text-center max-w-3xl mx-auto animate-fade-in my-auto">
        {/* Profile Avatar & Teaching Carousel */}
        <ProfileCarousel />

        <p aria-hidden="true" className="font-mono text-xs sm:text-sm text-signal mb-2 sm:mb-3">
          <span className="text-muted-foreground/70">$</span> whoami
          <span className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-signal/80 animate-caret-blink" />
        </p>

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
        <ul className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap" aria-label={t("a11y.socialLinks")}>
          {socialLinks.map((social) => (
            <li key={social.label}>
              <IconButton asChild tone="outline" size="lg" aria-label={social.label} className="hover:border-signal/30">
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {renderSocialIcon(social.iconName, 18)}
                </a>
              </IconButton>
            </li>
          ))}
        </ul>
      </div>

      {/* Subtle animated scroll down indicator */}
      <a
        href="#about"
        aria-label={t("a11y.scrollToAbout")}
        className="mt-auto pt-4 flex flex-col items-center text-muted-foreground/50 hover:text-foreground transition-colors group focus:outline-none"
      >
        <ChevronDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
};

export default HeroSection;
