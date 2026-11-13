import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal } from "@/components/ds";
import { Counter } from "@/components/motion/Counter";
import { ScrubText } from "@/components/motion/ScrubText";
import { sectionIndex } from "@/data/navigation";
import { portfolioStats } from "@/data/portfolio";
import { useProgress } from "@/motion/useProgress";

/**
 * Pinned scene. The viewport holds still while the statement lights up word
 * by word with the scroll, next to a portrait assembled from particles in
 * the WebGL layer (the `[data-portrait-stage]` box tells the engine where).
 * Without WebGL, or with reduced motion, the same box shows the photo
 * through a CSS halftone mask.
 */
const AboutSection = () => {
  const { t } = useLanguage();
  const pinRef = useRef<HTMLDivElement>(null);
  useProgress(pinRef, { mode: "contain" });

  const base = import.meta.env.BASE_URL || "/";
  const avatar = `${base.endsWith("/") ? base : `${base}/`}images/profile-avatar.jpg`;

  const stats = [
    { value: portfolioStats.roles, label: t("about.statRoles", { year: portfolioStats.firstYear }) },
    { value: portfolioStats.companies, label: t("about.statCompanies") },
    { value: portfolioStats.repos, label: t("about.statRepos") },
    { value: portfolioStats.stars, label: t("about.statStars") },
  ];

  return (
    <section id="about" aria-labelledby="about-title" data-scene="1" className="relative z-10">
      <div ref={pinRef} className="scrub-scene relative h-[230svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-clip pt-16 lg:pt-0">
          <div className="shell grid w-full items-center gap-x-14 gap-y-4 lg:grid-cols-12">
            <div className="lg:order-last lg:col-span-5">
              <div
                data-portrait-stage
                className="relative mx-auto aspect-square w-[min(58vw,29svh)] lg:w-full lg:max-w-[36rem]"
              >
                <img
                  src={avatar}
                  alt={t("about.portraitAlt")}
                  width={620}
                  height={620}
                  loading="lazy"
                  decoding="async"
                  className="portrait-fallback halftone h-full w-full rounded-full object-cover opacity-90 transition-opacity duration-slow"
                />
              </div>
              <p className="label mx-auto mt-5 hidden max-w-[34ch] text-center normal-case tracking-normal lg:block">
                <span className="text-signal">fig. 01</span> — {t("about.portraitCaption")}
              </p>
            </div>

            <div className="lg:col-span-7">
              <h2 id="about-title" className="label mb-4 flex items-center gap-3 lg:mb-8">
                <span aria-hidden="true" className="text-signal">
                  {String(sectionIndex("about")).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-border" />
                {t("about.title")}
              </h2>
              <ScrubText
                text={t("about.text")}
                className="font-display text-[clamp(1rem,min(4.4vw,2.45svh),1.3rem)] font-medium leading-[1.34] tracking-tight text-foreground lg:text-[clamp(1.45rem,2.3vw,2.55rem)] lg:leading-[1.2]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="shell pb-section pt-10">
        <Reveal
          as="dl"
          variant="stagger"
          className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border/60 pt-10 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-2">
              <dt className="label normal-case tracking-normal">{stat.label}</dt>
              <dd className="font-display text-display-xl font-semibold tabular-nums text-foreground">
                <Counter value={stat.value} />
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default AboutSection;
