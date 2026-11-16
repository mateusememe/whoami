import { cn } from "@/lib/utils";

interface PaginationDotsProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  label: string;
  getItemLabel: (index: number) => string;
  /** `inverse` for dots drawn over photos. */
  tone?: "default" | "inverse";
  className?: string;
}

const TONES = {
  default: { on: "bg-signal", off: "bg-muted-foreground/30 group-hover:bg-muted-foreground/60" },
  inverse: { on: "bg-white shadow-sm", off: "bg-white/40 group-hover:bg-white/70" },
};

/**
 * Carousel position dots. Each button is a 24px target (WCAG 2.5.8) around a
 * 6px dot; the active one stretches into a bar.
 */
export const PaginationDots = ({
  count,
  active,
  onSelect,
  label,
  getItemLabel,
  tone = "default",
  className,
}: PaginationDotsProps) => (
  <div role="tablist" aria-label={label} className={cn("flex items-center", className)}>
    {Array.from({ length: count }, (_, index) => {
      const selected = index === active;
      return (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={selected}
          aria-label={getItemLabel(index)}
          onClick={() => onSelect(index)}
          className={cn(
            "group flex h-6 items-center justify-center transition-[width] duration-base ease-expo",
            selected ? "w-8" : "w-6",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "block h-1.5 rounded-full transition-all duration-base ease-expo",
              selected ? cn("w-6", TONES[tone].on) : cn("w-1.5", TONES[tone].off),
            )}
          />
        </button>
      );
    })}
  </div>
);
