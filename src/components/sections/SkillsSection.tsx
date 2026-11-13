import { Fragment, useId } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, SectionHeading } from "@/components/ds";
import { Marquee } from "@/components/motion/Marquee";
import { Tilt } from "@/components/motion/Tilt";
import { topSkills, techGroups } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";

/** Rotating award seal: the text runs around a circle, the figure sits still in the middle. */
const Seal = ({ text }: { text: string }) => {
  const pathId = useId();
  return (
    <div aria-hidden="true" className="relative h-36 w-36 shrink-0 sm:h-44 sm:w-44">
      <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slow text-foreground/80">
        <defs>
          <path id={pathId} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeOpacity="0.2" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeOpacity="0.2" />
        {/* textLength stretches one copy of the text over exactly one turn (2π·78 ≈ 490). */}
        <text className="fill-current font-mono uppercase" fontSize="12.5">
          <textPath href={`#${pathId}`} textLength="484" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-4xl italic text-signal sm:text-5xl">
        100%
      </span>
    </div>
  );
};

/**
 * Achievement, top skills and the stack. The skills run as two bands of
 * outlined display type that speed up with the scroll; the stack reads as a
 * spec sheet, one row per area.
 */
const SkillsSection = () => {
  const { language, t } = useLanguage();
  const skills = topSkills.map((skill) => skill[language] || skill.en);
  const half = Math.ceil(skills.length / 2);

  return (
    <section id="skills" aria-labelledby="skills-title" data-scene="3" className="relative z-10 py-section">
      <div className="shell">
        <SectionHeading id="skills-title" index={sectionIndex("skills")} title={t("skills.title")} />

        {/* ProUni scholarship */}
        <Reveal variant="scale">
          <Tilt max={4}>
            <div className="glass-card spotlight relative flex flex-col items-center gap-8 overflow-hidden rounded-[2rem] p-8 sm:flex-row sm:gap-12 sm:p-12">
              <Seal text={t("skills.sealText")} />
              <div>
                <p className="label mb-3 text-signal">{t("skills.achievement")}</p>
                <p className="font-display text-display-md font-semibold text-foreground">{t("skills.scholarship")}</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">{t("skills.scholarshipIssuer")}</p>
                <p className="mt-4 max-w-[58ch] text-body-lg text-muted-foreground text-pretty">
                  {t("skills.scholarshipDesc")}
                </p>
              </div>
              <div aria-hidden="true" className="tilt-glare" />
            </div>
          </Tilt>
        </Reveal>
      </div>

      {/* Top skills: two bands running in opposite directions */}
      <div className="my-section" role="group" aria-label={t("skills.topSkills")}>
        <p className="shell label mb-6">{t("skills.topSkills")}</p>
        {[skills.slice(0, half), skills.slice(half)].map((row, rowIndex) => (
          <Marquee key={rowIndex} reverse={rowIndex === 1} duration={rowIndex === 1 ? 46 : 38} className="py-1">
            {row.map((skill) => (
              <Fragment key={skill}>
                <span className="text-outline whitespace-nowrap px-5 font-display text-display-xl font-semibold">
                  {skill}
                </span>
                <span aria-hidden="true" className="font-serif text-display-lg italic text-signal">
                  /
                </span>
              </Fragment>
            ))}
          </Marquee>
        ))}
      </div>

      {/* Stack, one row per area */}
      <div className="shell">
        <p className="label mb-6">{t("skills.stack")}</p>
        <Reveal as="dl" variant="stagger" className="border-t border-border/60">
          {techGroups.map((group, index) => (
            <div
              key={group.id}
              className="row-link grid items-baseline gap-x-8 gap-y-3 border-b border-border/60 py-6 md:grid-cols-12"
            >
              <dt className="label flex items-baseline gap-4 md:col-span-3">
                <span aria-hidden="true" className="text-signal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {t(group.labelKey)}
              </dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-1.5 md:col-span-9">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="font-display text-display-sm font-medium text-foreground/85 transition-colors duration-base hover:text-signal"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default SkillsSection;
