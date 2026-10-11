import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Github, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconButton, PaginationDots, Section, Surface, Tag, TagList } from "@/components/ds";
import { projects } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ProjectsSection = () => {
  const { language, t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>(".project-card");
    const cardWidth = card ? card.offsetWidth + 16 : 336;
    const currentIndex = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(currentIndex, 0), projects.length - 1));
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const targetIndex = (index + projects.length) % projects.length;
    const card = el.querySelector<HTMLElement>(".project-card");
    const cardWidth = card ? card.offsetWidth + 16 : 336;

    el.scrollTo({
      left: targetIndex * cardWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [reducedMotion]);

  const handlePrev = () => {
    const target = (activeIndex - 1 + projects.length) % projects.length;
    scrollToIndex(target);
  };

  const handleNext = useCallback(() => {
    const target = (activeIndex + 1) % projects.length;
    scrollToIndex(target);
  }, [activeIndex, scrollToIndex]);

  // Auto-scroll loop (off when the user prefers reduced motion)
  useEffect(() => {
    if (isPaused || reducedMotion) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, reducedMotion, handleNext]);

  // Scroll listener for updating active index
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
  };

  const actions = (
    <div className="flex items-center gap-1.5">
      <Tag tone="subtle" shape="box" className="mr-1">
        {projects.length} repos
      </Tag>
      <div className="flex items-center gap-1.5" role="group" aria-label={t("a11y.projectsControls")}>
        <IconButton onClick={handlePrev} aria-label={t("a11y.prevProject")}>
          <ChevronLeft size={16} />
        </IconButton>
        <IconButton onClick={handleNext} aria-label={t("a11y.nextProject")}>
          <ChevronRight size={16} />
        </IconButton>
      </div>
    </div>
  );

  return (
    <Section id="projects" index={sectionIndex("projects")} title={t("projects.title")} actions={actions}>
      {/* Fluid Carousel Slider Container */}
      <div
        ref={scrollContainerRef}
        role="region"
        aria-label={t("a11y.projectsCarousel")}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pt-1 px-1 -mx-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/50 rounded-2xl scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {projects.map((p) => (
          <Surface
            as="article"
            key={p.id}
            interactive
            className="project-card flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] snap-center sm:snap-start flex flex-col justify-between hover:bg-accent/20 group select-none min-h-[220px]"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-mono font-semibold text-foreground text-sm tracking-tight group-hover:text-signal transition-colors duration-base">
                    {p.name}
                  </h3>
                  {typeof p.stars === "number" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                      <Star size={11} className="fill-amber-500 dark:fill-amber-400" />
                      {p.stars}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {p.githubUrl && (
                    <IconButton asChild tone="ghost" aria-label={t("a11y.viewRepo", { name: p.name })}>
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github size={15} />
                      </a>
                    </IconButton>
                  )}
                  {p.liveUrl && (
                    <IconButton asChild tone="ghost" aria-label={t("a11y.viewDemo", { name: p.name })}>
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={15} />
                      </a>
                    </IconButton>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-4">{p.desc[language]}</p>
            </div>

            {p.tech && p.tech.length > 0 && (
              <TagList
                items={p.tech}
                label={t("a11y.projectTech")}
                tone="subtle"
                shape="box"
                className="pt-3 border-t border-border/30"
              />
            )}
          </Surface>
        ))}
      </div>

      <PaginationDots
        count={projects.length}
        active={activeIndex}
        onSelect={scrollToIndex}
        label={t("a11y.projectsPagination")}
        getItemLabel={(idx) => t("a11y.goToProject", { n: idx + 1, name: projects[idx].name })}
        className="justify-center mt-2.5 mb-5"
      />

      {/* View all on GitHub button */}
      <div className="text-center">
        <a
          href="https://github.com/mateusememe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast font-mono px-4 py-2 rounded-xl bg-accent/40 hover:bg-accent border border-border/30"
        >
          <Github size={16} />
          {t("projects.viewGithub")}
        </a>
      </div>
    </Section>
  );
};

export default ProjectsSection;
