import React, { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Github, GitPullRequest, Lock, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconButton, PaginationDots, Reveal, TagList } from "@/components/ds";
import { ProjectCover } from "@/components/covers/ProjectCover";
import { Magnetic } from "@/components/motion/Magnetic";
import { Scramble } from "@/components/motion/Scramble";
import { contributions, portfolioStats, projects } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";
import { damp } from "@/lib/motion";
import { prefersReducedMotion } from "@/motion/env";
import { trackProgress } from "@/motion/progress";
import { scrollState, scrollToTarget } from "@/motion/scroll";
import { addTick, TICK } from "@/motion/ticker";
import { cn } from "@/lib/utils";

const PINNED_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** Gallery cards (with covers) and the plain list under them. */
const featured = projects.filter((project) => project.featured);
const others = projects.filter((project) => !project.featured);

const MONTHS: Record<string, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

/** `2026-10` → `Oct 2026`. A fixed table, so server and browser always agree. */
function formatMonth(month: string, language: string): string {
  const [year, index] = month.split("-").map(Number);
  return `${(MONTHS[language] ?? MONTHS.en)[index - 1]} ${year}`;
}

/**
 * Selected work as a gallery. Two modes share one markup:
 *
 *   pinned  (desktop with a mouse) the section sticks to the viewport and
 *           vertical scrolling moves the track sideways, with a slight skew
 *           from scroll speed and a parallax drift inside each cover
 *   native  (touch, small screens, reduced motion, no JS) a horizontal
 *           scroll-snap strip
 *
 * The server and the first client render use native mode; the pinned mode
 * is switched on after mount.
 */
/** Renders `code` spans written with backticks in the data as <code>. */
const withCode = (text: string): ReactNode =>
  text.split("`").map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="font-mono text-[0.92em] text-foreground">
        {part}
      </code>
    ) : (
      part
    ),
  );

const ProjectsSection = () => {
  const { language, t } = useLanguage();
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(PINNED_QUERY);
    const apply = () => setPinned(query.matches && !prefersReducedMotion());
    apply();
    query.addEventListener?.("change", apply);
    return () => query.removeEventListener?.("change", apply);
  }, []);

  /** Distance between the left edges of two neighbouring cards. */
  const cardStep = useCallback(() => {
    const cards = trackRef.current?.querySelectorAll<HTMLElement>(".project-card");
    if (!cards || cards.length < 2) return 1;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }, []);

  // Pinned mode: how far the track has to travel.
  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  // Pinned mode: scroll progress → track position, skew and cover parallax.
  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pinned || !pin || !track || distance === 0) return;

    let progress = 0;
    let skew = 0;
    let near = false;
    const covers = Array.from(track.querySelectorAll<HTMLElement>("[data-cover]"));

    const stopProgress = trackProgress(pin, {
      mode: "contain",
      cssVar: null,
      onChange: (value) => {
        progress = value;
        near = true;
        setActiveIndex(Math.min(Math.round((value * distance) / cardStep()), featured.length - 1));
      },
    });

    const stopTick = addTick((_time, delta) => {
      if (!near) return;
      skew = damp(skew, Math.max(-1, Math.min(1, scrollState.velocity / 2600)) * -2.4, 8, delta);
      const x = -progress * distance;
      track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) skewX(${skew.toFixed(3)}deg)`;

      const center = window.innerWidth / 2;
      for (const cover of covers) {
        const card = cover.closest<HTMLElement>(".project-card");
        if (!card) continue;
        const offset = (card.offsetLeft + card.offsetWidth / 2 + x - center) / window.innerWidth;
        cover.style.transform = `translate3d(${(offset * -34).toFixed(1)}px, 0, 0) scale(1.08)`;
      }
      if (Math.abs(skew) < 0.005 && Math.abs(scrollState.velocity) < 1) near = false;
    }, TICK.ui);

    return () => {
      stopProgress();
      stopTick();
      track.style.transform = "";
      covers.forEach((cover) => (cover.style.transform = ""));
    };
  }, [pinned, distance, cardStep]);

  // Native mode: active card from the strip's own scroll position.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (pinned || !viewport) return;
    const update = () => {
      setActiveIndex(Math.min(Math.max(Math.round(viewport.scrollLeft / cardStep()), 0), featured.length - 1));
    };
    update();
    viewport.addEventListener("scroll", update, { passive: true });
    return () => viewport.removeEventListener("scroll", update);
  }, [pinned, cardStep]);

  const goTo = useCallback(
    (index: number) => {
      const target = (index + featured.length) % featured.length;
      const offset = target * cardStep();
      if (pinned) {
        const pin = pinRef.current;
        if (!pin) return;
        scrollToTarget(pin.getBoundingClientRect().top + window.scrollY + Math.min(offset, distance));
      } else {
        viewportRef.current?.scrollTo({ left: offset, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
    },
    [pinned, distance, cardStep],
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") goTo(activeIndex + 1);
    if (event.key === "ArrowLeft") goTo(activeIndex - 1);
  };

  // Pinned mode: keyboard focus on a card that is off screen brings it into view.
  const handleFocus = (event: React.FocusEvent) => {
    if (!pinned) return;
    const card = (event.target as HTMLElement).closest<HTMLElement>(".project-card");
    const index = card ? Number(card.dataset.index) : Number.NaN;
    if (!Number.isNaN(index) && index !== activeIndex) goTo(index);
  };

  // Pinned mode: a sideways trackpad swipe scrolls the page, which moves the track.
  const handleWheel = (event: React.WheelEvent) => {
    if (pinned && Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      scrollToTarget(window.scrollY + event.deltaX, { immediate: true });
    }
  };

  return (
    <section id="projects" aria-labelledby="projects-title" data-scene="4" className="relative z-10">
      <div ref={pinRef} className="relative" style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}>
        <div
          className={cn(
            pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-clip pb-5 pt-[4.5rem]" : "py-section",
          )}
        >
          <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <Reveal variant="mask">
              <h2 id="projects-title" className="section-title font-display text-display-lg font-semibold text-foreground">
                <span aria-hidden="true" className="section-index">
                  {String(sectionIndex("projects")).padStart(2, "0")}
                </span>
                {t("projects.title")}
              </h2>
            </Reveal>
            <p className="max-w-[44ch] text-sm text-muted-foreground text-pretty lg:text-base">
              {t("projects.lead", { repos: portfolioStats.repos, stars: portfolioStats.stars })}
            </p>
            <div className="flex items-center gap-4">
              <p aria-hidden="true" className="font-mono text-xs tabular-nums text-muted-foreground">
                <span className="text-signal">{String(activeIndex + 1).padStart(2, "0")}</span> /{" "}
                {String(featured.length).padStart(2, "0")}
              </p>
              <div className="flex items-center gap-1.5" role="group" aria-label={t("a11y.projectsControls")}>
                <IconButton onClick={() => goTo(activeIndex - 1)} aria-label={t("a11y.prevProject")} className="rounded-full">
                  <ChevronLeft size={16} />
                </IconButton>
                <IconButton onClick={() => goTo(activeIndex + 1)} aria-label={t("a11y.nextProject")} className="rounded-full">
                  <ChevronRight size={16} />
                </IconButton>
              </div>
            </div>
          </div>

          <div
            ref={viewportRef}
            role="region"
            aria-label={t("a11y.projectsCarousel")}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onWheel={handleWheel}
            data-lenis-prevent={pinned ? undefined : true}
            className={cn(
              "mt-7 focus:outline-none lg:mt-8",
              pinned ? "min-h-0 flex-1" : "snap-x snap-mandatory overflow-x-auto scrollbar-none",
            )}
          >
            <div ref={trackRef} className={cn("flex w-max gap-5 px-gutter will-change-transform", pinned && "h-full")}>
              {featured.map((project, index) => (
                <article
                  key={project.id}
                  data-index={index}
                  className={cn(
                    "project-card glass-card group/card relative flex w-[min(84vw,25rem)] shrink-0 snap-start scroll-ml-[var(--gutter)] flex-col overflow-hidden rounded-[1.75rem] lg:w-[clamp(24rem,33vw,33rem)]",
                    pinned && "h-full max-h-[36rem]",
                  )}
                >
                  <div className={cn("relative overflow-hidden", pinned ? "min-h-[9rem] flex-1" : "aspect-[16/10]")}>
                    <div data-cover className="absolute inset-0 scale-[1.08] will-change-transform">
                      <ProjectCover id={project.id} className="h-full w-full" />
                    </div>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("a11y.viewRepo", { name: project.name })}
                        data-cursor-label={t("projects.open")}
                        className="absolute inset-0 z-20"
                      />
                    ) : (
                      <span className="label absolute bottom-3 left-4 z-10 inline-flex items-center gap-1.5 normal-case tracking-normal">
                        <Lock size={11} aria-hidden="true" />
                        {t("projects.private")}
                      </span>
                    )}
                  </div>

                  <div className="relative border-t border-border/50 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-baseline gap-3">
                        <span aria-hidden="true" className="font-serif text-2xl italic leading-none text-signal">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="truncate font-mono text-base font-semibold tracking-tight text-foreground transition-colors duration-base group-hover/card:text-signal sm:text-lg">
                          {project.name}
                        </h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5 text-muted-foreground">
                        {typeof project.stars === "number" && (
                          <span
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground"
                            aria-label={t("projects.stars", { n: project.stars })}
                          >
                            <Star size={11} className="fill-signal text-signal" />
                            {project.stars}
                          </span>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t("a11y.viewDemo", { name: project.name })}
                            className="transition-colors duration-base hover:text-foreground"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <ArrowUpRight
                            aria-hidden="true"
                            size={18}
                            className="transition-transform duration-slow ease-expo group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-signal"
                          />
                        )}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-3 min-h-[4.875em] text-sm leading-relaxed text-muted-foreground">
                      {project.desc[language]}
                    </p>
                    {project.tech && project.tech.length > 0 && (
                      <TagList items={project.tech} label={t("a11y.projectTech")} tone="outline" className="mt-4" />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="shell mt-6 flex flex-wrap items-center justify-between gap-4">
            <PaginationDots
              count={featured.length}
              active={activeIndex}
              onSelect={goTo}
              label={t("a11y.projectsPagination")}
              getItemLabel={(idx) => t("a11y.goToProject", { n: idx + 1, name: featured[idx].name })}
            />
            <Magnetic>
              <a
                href="https://github.com/mateusememe"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 font-mono text-xs text-foreground transition-colors duration-base hover:text-signal"
                style={{ "--surface-blur": "10px" } as CSSProperties}
              >
                <Github size={15} />
                <Scramble text={t("projects.viewGithub")} />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="shell pb-section pt-12 lg:pt-20">
        {/* The rest of the repositories, as rows */}
        <h3 className="label mb-5">{t("projects.more")}</h3>
        <Reveal as="ul" variant="stagger" className="border-t border-border/60">
          {others.map((project) => (
            <li key={project.id}>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="row-link grid items-baseline gap-x-8 gap-y-2 border-b border-border/60 py-6 md:grid-cols-12"
              >
                <span className="flex items-baseline gap-3 md:col-span-4">
                  <span className="font-mono text-base font-semibold text-foreground sm:text-lg">{project.name}</span>
                  {typeof project.stars === "number" && (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground">
                      <Star size={11} className="fill-signal text-signal" aria-hidden="true" />
                      {project.stars}
                    </span>
                  )}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground md:col-span-5">{withCode(project.desc[language])}</span>
                <span className="flex items-center justify-between gap-4 md:col-span-3 md:justify-end">
                  <span className="font-mono text-[11px] text-muted-foreground md:text-right">
                    {(project.tech ?? []).join(" · ")}
                  </span>
                  <ArrowUpRight aria-hidden="true" size={20} className="row-arrow shrink-0 text-signal" />
                </span>
              </a>
            </li>
          ))}
        </Reveal>

        {/* Merged pull requests in other people's repositories */}
        <div className="mt-16 lg:mt-24">
          <h3 className="label mb-2 flex items-center gap-2.5">
            <GitPullRequest size={13} className="text-signal" aria-hidden="true" />
            {t("projects.contributions")}
          </h3>
          <p className="mb-5 text-sm text-muted-foreground">{t("projects.contributionsLead")}</p>
          <Reveal as="ul" variant="stagger" className="border-t border-border/60">
            {contributions.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="row-link grid items-baseline gap-x-8 gap-y-2 border-b border-border/60 py-6 md:grid-cols-12"
                >
                  <span className="md:col-span-4">
                    <span className="block font-mono text-base font-semibold text-foreground sm:text-lg">{item.repo}</span>
                    <span className="mt-1 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                      <span className="text-signal">{t("projects.merged", { date: formatMonth(item.merged, language) })}</span>
                      {typeof item.stars === "number" && (
                        <span className="inline-flex items-center gap-1">
                          <Star size={11} className="fill-signal text-signal" aria-hidden="true" />
                          {item.stars}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground md:col-span-5">{withCode(item.desc[language])}</span>
                  <span className="flex items-center justify-between gap-4 md:col-span-3 md:justify-end">
                    <span className="font-mono text-[11px] text-muted-foreground md:text-right">{item.tech.join(" · ")}</span>
                    <ArrowUpRight aria-hidden="true" size={20} className="row-arrow shrink-0 text-signal" />
                  </span>
                </a>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
