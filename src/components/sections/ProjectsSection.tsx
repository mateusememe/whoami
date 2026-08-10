import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/data/portfolio";

const ProjectsSection = () => {
  const { language, t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    const cardWidth = el.querySelector<HTMLElement>(".project-card")?.offsetWidth || 320;
    const gap = 16;
    const currentIndex = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(currentIndex, 0), projects.length - 1));
  }, []);

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

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const cards = el.querySelectorAll<HTMLElement>(".project-card");
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handlePrev = () => {
    const target = Math.max(activeIndex - 1, 0);
    scrollToIndex(target);
  };

  const handleNext = () => {
    const target = Math.min(activeIndex + 1, projects.length - 1);
    scrollToIndex(target);
  };

  return (
    <section id="projects" className="relative z-10 py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            {t("projects.title")}
          </h2>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Controles do carrossel de projetos">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canScrollLeft}
              aria-label="Projeto anterior"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/40 hover:bg-accent disabled:opacity-30 disabled:pointer-events-none text-muted-foreground hover:text-foreground transition-all border border-border/30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canScrollRight}
              aria-label="Próximo projeto"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/40 hover:bg-accent disabled:opacity-30 disabled:pointer-events-none text-muted-foreground hover:text-foreground transition-all border border-border/30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Fluid Carousel Slider Container */}
        <div
          ref={scrollContainerRef}
          role="region"
          aria-label="Carrossel de projetos"
          tabIndex={0}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 -mx-1 focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((p, idx) => (
            <article
              key={p.id}
              className="project-card flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] snap-center sm:snap-start glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-border/40 hover:border-border/70 hover:bg-accent/20 transition-all group select-none min-h-[220px]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-mono font-semibold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-1.5">
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
        <div className="flex items-center justify-center gap-1.5 mt-3 mb-6" role="tablist" aria-label="Navegação dos projetos">
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
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors font-mono px-4 py-2.5 rounded-xl bg-accent/40 hover:bg-accent border border-border/30"
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
