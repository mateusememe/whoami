import { useRef, type CSSProperties } from "react";
import { ArrowDown, FileDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { socialLinks } from "@/data/portfolio";
import { LocalClock } from "@/components/LocalClock";
import ProfileCarousel from "@/components/ProfileCarousel";
import { renderSocialIcon } from "@/components/SocialIcons";
import { IconButton } from "@/components/ds";
import { Magnetic } from "@/components/motion/Magnetic";
import { useProgress } from "@/motion/useProgress";
import { CV_FILES } from "@/seo/files";

const NAME = "Mateus Mendonça Monteiro";
const NAME_LINES = NAME.split(" ");

/**
 * Opening scene. The name sets the scale of the page: three lines of display
 * type that rise letter by letter on first paint (CSS only, so it also runs
 * from the prerendered HTML). As the page scrolls, each layer recedes at its
 * own speed.
 */
const HeroSection = () => {
  const { language, t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  useProgress(ref, { mode: "exit" });

  const facts = t("hero.subtitle")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section ref={ref} id="top" data-scene="0" className="relative z-10 flex min-h-[100svh] flex-col">
      {/* Scrim: keeps the copy legible over the WebGL mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_22%_48%,hsl(var(--background)/0.86),transparent)]"
      />

      <div className="shell flex flex-1 flex-col pb-6 pt-24 lg:pt-[clamp(5.5rem,11svh,7rem)]">
        <div className="hero-fade label flex items-center justify-between gap-4" style={{ "--i": 0 } as CSSProperties}>
          <span>~/whoami</span>
          <span className="flex items-center gap-3">
            <span className="hidden sm:inline">{t("hero.location")}</span>
            <span aria-hidden="true" className="hidden h-px w-6 bg-border sm:inline-block" />
            <LocalClock />
          </span>
        </div>

        <div className="grid flex-1 items-center gap-x-10 gap-y-8 py-6 lg:grid-cols-12 lg:py-8">
          <div className="hero-parallax hero-name-box lg:col-span-8" style={{ "--shift": "-140px", "--fade": 1.5 } as CSSProperties}>
            <p aria-hidden="true" className="hero-fade mb-3 font-mono text-sm text-signal sm:mb-5 sm:text-base">
              <span className="text-muted-foreground/70">$</span> whoami
              <span className="ml-1.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-signal/80 animate-caret-blink" />
            </p>

            <h1 className="hero-name font-display text-display-2xl font-semibold text-foreground">
              <span className="sr-only">{NAME}</span>
              <span aria-hidden="true">
                {NAME_LINES.map((line, lineIndex) => (
                  <span key={line} className="hero-line" style={{ "--line": lineIndex } as CSSProperties}>
                    {Array.from(line).map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className="hero-char hover:-translate-y-[0.04em] hover:text-signal"
                        style={{ "--c": charIndex } as CSSProperties}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          <div
            className="hero-parallax mx-auto w-full max-w-[17rem] sm:max-w-xs lg:col-span-4 lg:max-w-[min(23rem,40svh)] lg:justify-self-end"
            style={{ "--shift": "-60px", "--fade": 1.1 } as CSSProperties}
          >
            <div className="hero-photo">
              <ProfileCarousel />
            </div>
          </div>
        </div>

        <div className="hero-parallax" style={{ "--shift": "-30px", "--fade": 2.2 } as CSSProperties}>
          {/* Rule with the scroll cue sitting on it */}
          <div className="relative">
            <div aria-hidden="true" className="hairline hero-rule" />
            {/* The positioning wrapper is separate: the entrance animation owns `transform` on the link. */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a
                href="#about"
                aria-label={t("a11y.scrollToAbout")}
                className="hero-fade label group flex items-center gap-3 rounded-full bg-background py-1 pl-4 pr-1 text-muted-foreground transition-colors duration-base hover:text-foreground"
                style={{ "--i": 4 } as CSSProperties}
              >
                <span className="whitespace-nowrap">{t("hero.scroll")}</span>
                <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border">
                  <ArrowDown size={13} className="animate-scroll-cue" />
                </span>
              </a>
            </div>
          </div>

          <div className="grid gap-x-10 gap-y-6 pt-8 md:grid-cols-12">
            <div className="hero-fade md:col-span-4" style={{ "--i": 1 } as CSSProperties}>
              <p className="font-serif text-2xl italic leading-tight text-foreground sm:text-3xl">{t("hero.title")}</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                {facts.map((fact) => (
                  <li key={fact} className="whitespace-nowrap font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            <p
              className="hero-fade text-body-lg text-muted-foreground text-pretty md:col-span-4"
              style={{ "--i": 2 } as CSSProperties}
            >
              {t("hero.summary")}
            </p>

            <div className="hero-fade flex flex-col gap-3 md:col-span-4 md:items-end" style={{ "--i": 3 } as CSSProperties}>
              <ul className="flex flex-wrap content-start gap-1.5 md:justify-end" aria-label={t("a11y.socialLinks")}>
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <Magnetic strength={0.3}>
                      <IconButton
                        asChild
                        tone="outline"
                        size="lg"
                        aria-label={social.label}
                        className="rounded-full hover:border-signal/40 sm:h-10 sm:w-10"
                      >
                        <a href={social.href} target="_blank" rel="noopener noreferrer">
                          {renderSocialIcon(social.iconName, 17)}
                        </a>
                      </IconButton>
                    </Magnetic>
                  </li>
                ))}
              </ul>
              {/* The résumé as a PDF in the page language, laid out for applicant tracking systems. */}
              <a
                href={`${import.meta.env.BASE_URL}${CV_FILES[language]}`}
                download
                type="application/pdf"
                className="label inline-flex h-10 items-center gap-2 self-start rounded-full border border-border px-4 text-foreground transition-colors duration-base hover:border-signal/50 hover:text-signal md:self-end"
              >
                <FileDown size={14} aria-hidden="true" />
                {t("cv.download")}
                <span className="text-muted-foreground">PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
