import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva("inline-flex items-center whitespace-nowrap font-medium", {
  variants: {
    tone: {
      solid: "bg-accent text-accent-foreground",
      subtle: "bg-accent/40 text-muted-foreground border border-border/30",
      signal: "bg-signal/10 text-signal border border-signal/25",
    },
    size: {
      /** Mono, for technologies. */
      xs: "font-mono text-[10px] sm:text-[11px] px-2.5 py-0.5",
      /** Sans, for skills and labels. */
      sm: "text-xs px-2.5 sm:px-3 py-1",
    },
    shape: {
      pill: "rounded-full",
      box: "rounded-md",
    },
  },
  defaultVariants: { tone: "solid", size: "xs", shape: "pill" },
});

type TagVariants = VariantProps<typeof tagVariants>;

export interface TagProps extends HTMLAttributes<HTMLSpanElement>, TagVariants {}

export const Tag = ({ tone, size, shape, className, ...props }: TagProps) => (
  <span className={cn(tagVariants({ tone, size, shape }), className)} {...props} />
);

interface TagListProps extends TagVariants {
  items: string[];
  label: string;
  className?: string;
}

/** Labelled list of tags. Renders a real <ul> so screen readers announce the count. */
export const TagList = ({ items, label, className, ...variants }: TagListProps) => (
  <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
    {items.map((item) => (
      <li key={item}>
        <Tag {...variants}>{item}</Tag>
      </li>
    ))}
  </ul>
);
