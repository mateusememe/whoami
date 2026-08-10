import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, User, Presentation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoSlide {
  id: string;
  src: string;
  labelKey: string;
  icon: React.ReactNode;
}

export const ProfileCarousel: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const basePath = import.meta.env.BASE_URL || "/";
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;

  const slides: PhotoSlide[] = [
    {
      id: "profile",
      src: `${normalizedBase}images/profile-avatar.jpg`,
      labelKey: "hero.photoProfile",
      icon: <User size={12} className="inline mr-1" />,
    },
    {
      id: "teaching",
      src: `${normalizedBase}images/profile-teaching.jpg`,
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

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  };

  return (
    <div
      className="relative mx-auto mb-6 sm:mb-8 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Carrossel de fotos de Mateus Mendonça Monteiro"
    >
      {/* Outer ambient glow and glass border */}
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-primary/40 via-accent/30 to-primary/20 opacity-70 group-hover:opacity-100 blur-md transition-all duration-700 -z-10" />

      <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden glass-card backdrop-blur-2xl border border-border/50 shadow-2xl p-1">
        {/* Slides container */}
        <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden bg-muted/40">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-out ${
                  isActive
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-105 -z-10 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.src}
                  alt={`Mateus Mendonça Monteiro - ${t(slide.labelKey)}`}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </div>
            );
          })}

          {/* Navigation overlay arrows (visible on touch mobile and hover desktop) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronRight size={18} />
          </button>

          {/* Bottom badge and indicator dots */}
          <div className="absolute bottom-2.5 inset-x-0 z-20 flex flex-col items-center gap-1.5 px-3">
            {/* Label badge hidden on mobile, visible on sm: (>=640px) */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-mono font-medium text-white/90 border border-white/10 shadow-sm transition-all">
              {slides[currentIndex].icon}
              {t(slides[currentIndex].labelKey)}
            </span>

            {/* Dots with comfortable touch target */}
            <div className="flex items-center gap-1.5 py-0.5" role="tablist" aria-label="Slides">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === currentIndex}
                  aria-label={`Slide ${idx + 1}: ${t(slide.labelKey)}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 focus:outline-none ${
                    idx === currentIndex
                      ? "w-6 bg-white shadow-sm"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCarousel;
