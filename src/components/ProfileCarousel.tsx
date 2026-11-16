import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, User, Presentation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaginationDots } from "@/components/ds";
import { Tilt } from "@/components/motion/Tilt";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface PhotoSlide {
  id: string;
  /** JPEG fallback. */
  src: string;
  /** Smaller formats, best first; the browser takes the first it supports. */
  sources: Array<{ type: string; srcSet: string }>;
  labelKey: string;
  icon: React.ReactNode;
}

/**
 * Hero photo card. Two photos cross-wipe every few seconds; the card tilts
 * in 3D toward the pointer and carries a moving glare, like a print held
 * under a light.
 */
export const ProfileCarousel: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const basePath = import.meta.env.BASE_URL || "/";
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;

  const slides: PhotoSlide[] = [
    {
      id: "profile",
      src: `${normalizedBase}images/profile-avatar.jpg`,
      sources: [
        { type: "image/avif", srcSet: `${normalizedBase}images/profile-avatar.avif` },
        { type: "image/webp", srcSet: `${normalizedBase}images/profile-avatar.webp` },
      ],
      labelKey: "hero.photoProfile",
      icon: <User size={12} className="inline mr-1" />,
    },
    {
      id: "teaching",
      src: `${normalizedBase}images/profile-teaching.jpg`,
      sources: [{ type: "image/webp", srcSet: `${normalizedBase}images/profile-teaching.webp` }],
      labelKey: "hero.photoTeaching",
      icon: <Presentation size={12} className="inline mr-1" />,
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play timer (off when the user prefers reduced motion)
  useEffect(() => {
    if (isPaused || reducedMotion) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, reducedMotion, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  };

  const arrow =
    "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-opacity duration-base hover:bg-black/70 focus-visible:opacity-100 opacity-80 sm:opacity-0 sm:group-hover:opacity-100";

  return (
    <div
      className={cn("group relative select-none", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={t("a11y.photoCarousel")}
    >
      {/* Light behind the card */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,hsl(var(--signal)/0.28),transparent)] opacity-70 blur-2xl transition-opacity duration-slow group-hover:opacity-100"
      />

      <Tilt className="relative aspect-[4/5] w-full">
        <div className="glass-card absolute inset-0 overflow-hidden rounded-[2rem] p-1.5">
          <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-muted/40">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={slide.id}
                  className={cn(
                    "absolute inset-0 transition-[clip-path,transform,opacity] duration-slower ease-expo",
                    isActive
                      ? "z-10 opacity-100 [clip-path:inset(0_0_0_0)]"
                      : "pointer-events-none z-0 scale-105 opacity-0 [clip-path:inset(0_0_100%_0)]",
                  )}
                  aria-hidden={!isActive}
                >
                  <picture className="contents">
                    {slide.sources.map((source) => (
                      <source key={source.type} type={source.type} srcSet={source.srcSet} />
                    ))}
                    <img
                      src={slide.src}
                      alt={`Mateus Mendonça Monteiro - ${t(slide.labelKey)}`}
                      width={620}
                      height={775}
                      className="h-full w-full object-cover object-center transition-transform duration-slower ease-expo group-hover:scale-[1.04]"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      // Lowercase on purpose: React 18 passes it through as the HTML attribute.
                      {...(index === 0 ? { fetchpriority: "high" } : {})}
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                </div>
              );
            })}

            <button type="button" onClick={prevSlide} aria-label={t("a11y.prevPhoto")} className={cn(arrow, "left-2.5")}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={nextSlide} aria-label={t("a11y.nextPhoto")} className={cn(arrow, "right-2.5")}>
              <ChevronRight size={18} />
            </button>

            <div className="absolute inset-x-0 bottom-3.5 z-20 flex items-center justify-between gap-3 px-4">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[11px] font-medium text-white/90 backdrop-blur-md">
                {slides[currentIndex].icon}
                {t(slides[currentIndex].labelKey)}
              </span>
              <PaginationDots
                count={slides.length}
                active={currentIndex}
                onSelect={setCurrentIndex}
                label={t("a11y.photoTabs")}
                getItemLabel={(idx) => t("a11y.goToPhoto", { n: idx + 1, label: t(slides[idx].labelKey) })}
                tone="inverse"
              />
            </div>
          </div>
          <div aria-hidden="true" className="tilt-glare" />
        </div>
      </Tilt>
    </div>
  );
};

export default ProfileCarousel;
