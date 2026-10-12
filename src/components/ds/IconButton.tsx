import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center text-muted-foreground transition-colors duration-fast ease-expo hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      tone: {
        soft: "bg-accent/40 hover:bg-accent border border-border/30",
        outline: "border border-border/30 hover:bg-accent",
        ghost: "hover:bg-accent",
      },
      size: {
        sm: "h-8 w-8 rounded-lg",
        md: "h-9 w-9 sm:h-8 sm:w-8 rounded-lg",
        lg: "h-10 w-10 sm:h-11 sm:w-11 rounded-xl",
      },
    },
    defaultVariants: { tone: "soft", size: "sm" },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Icon-only controls need an accessible name. */
  "aria-label": string;
  /** Render the child element (e.g. an <a>) with icon button styles. */
  asChild?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tone, size, asChild = false, className, type, ...props }, ref) => {
    const Element = asChild ? Slot : "button";
    return (
      <Element
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        className={cn(iconButtonVariants({ tone, size }), className)}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";
