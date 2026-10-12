import type { ComponentPropsWithoutRef, ElementType, PointerEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const surfaceVariants = cva("glass-card rounded-2xl border border-border/40", {
  variants: {
    padding: {
      sm: "p-4 sm:p-5",
      md: "p-5 sm:p-6",
      lg: "p-5 sm:p-6 md:p-8",
    },
    interactive: {
      true: "spotlight transition-colors duration-base ease-expo hover:border-border/70",
      false: "",
    },
  },
  defaultVariants: { padding: "md", interactive: false },
});

type SurfaceProps<T extends ElementType> = {
  as?: T;
} & VariantProps<typeof surfaceVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Glass card. `interactive` adds the hover border and a signal-tinted
 * spotlight that follows the pointer.
 */
export function Surface<T extends ElementType = "div">({
  as,
  padding,
  interactive,
  className,
  onPointerMove,
  ...props
}: SurfaceProps<T>) {
  const Element: ElementType = as ?? "div";

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (interactive) {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    }
    onPointerMove?.(event);
  };

  return (
    <Element
      className={cn(surfaceVariants({ padding, interactive }), className)}
      onPointerMove={interactive || onPointerMove ? handlePointerMove : undefined}
      {...props}
    />
  );
}
