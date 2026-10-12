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
  default: { on: "bg-signal", off: "bg-muted-foreground/30 hover:bg-muted-foreground/60" },
  inverse: { on: "bg-white shadow-sm", off: "bg-white/40 hover:bg-white/70" },
};

/** Carousel position dots. The hit area extends past the 6px dot. */
export const PaginationDots = ({
  count,
  active,
  onSelect,
  label,
  getItemLabel,
  tone = "default",
  className,
}: PaginationDotsProps) => (
  <div role="tablist" aria-label={label} className={cn("flex items-center gap-1.5", className)}>
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
            "relative h-1.5 rounded-full transition-all duration-base ease-expo before:absolute before:-inset-x-1 before:-inset-y-2.5",
            selected ? cn("w-6", TONES[tone].on) : cn("w-1.5", TONES[tone].off),
          )}
        />
      );
    })}
  </div>
);
