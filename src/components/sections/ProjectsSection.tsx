import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Github, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/data/portfolio";

const ProjectsSection = () => {
  const { language, t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

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
      behavior: "smooth",
    });
  }, []);

  const handlePrev = () => {
    const target = (activeIndex - 1 + projects.length) % projects.length;
    scrollToIndex(target);
  };

  const handleNext = useCallback(() => {
    const target = (activeIndex + 1) % projects.length;
    scrollToIndex(target);
  }, [activeIndex, scrollToIndex]);

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

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

  return (
    <section id="projects" className="relative z-10 py-8 sm:py-10 md:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              {t("projects.title")}
            </h2>
            <span className="text-xs font-mono text-muted-foreground/80 px-2 py-0.5 rounded-md bg-accent/40 border border-border/30">
              {projects.length} repos
            </span>
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Controles do carrossel de projetos">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Projeto anterior"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/40 hover:bg-accent text-muted-foreground hover:text-foreground transition-all border border-border/30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próximo projeto"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/40 hover:bg-accent text-muted-foreground hover:text-foreground transition-all border border-border/30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Fluid Carousel Slider Container */}
        <div
          ref={scrollContainerRef}
          role="region"
          aria-label="Carrossel de projetos com autorolagem"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pt-1 px-1 -mx-1 focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((p, idx) => (
            <article
              key={p.id}
              className="project-card flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] snap-center sm:snap-start glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-border/40 hover:border-border/70 hover:bg-accent/20 transition-all group select-none min-h-[220px]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-mono font-semibold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    {typeof p.stars === "number" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-500 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                        <Star size={11} className="fill-amber-500 dark:fill-amber-400" />
                        {p.stars}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label={`Ver repositório ${p.name} no GitHub`}
                      >
                        <Github size={15} />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label={`Ver demonstração de ${p.name}`}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                  {p.desc[language]}
                </p>
              </div>

              {p.tech && p.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/30" aria-label="Tecnologias do projeto">
                  {p.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-accent/40 text-muted-foreground border border-border/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-5" role="tablist" aria-label="Navegação dos projetos">
          {projects.map((p, idx) => (
            <button
              key={`dot-${p.id}`}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Ir para projeto ${idx + 1}: ${p.name}`}
              onClick={() => scrollToIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                idx === activeIndex
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>

        {/* View all on GitHub button */}
        <div className="text-center">
          <a
            href="https://github.com/mateusememe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors font-mono px-4 py-2 rounded-xl bg-accent/40 hover:bg-accent border border-border/30"
          >
            <Github size={16} />
            {t("projects.viewGithub")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
