import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ds/Reveal";

interface SectionHeadingProps {
  id: string;
  index: number;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "start" | "center";
}

/** `01  About Me`: a mono index in signal color, then the title. */
export const SectionHeading = ({ id, index, title, description, actions, align = "start" }: SectionHeadingProps) => (
  <div className="mb-4 sm:mb-6">
    <div className={cn("flex items-center gap-3", align === "center" ? "justify-center" : "justify-between")}>
      <h2 id={id} className="flex items-baseline gap-3 text-xl sm:text-2xl font-display font-bold text-foreground">
        <span aria-hidden="true" className="font-mono text-xs font-medium tabular-nums text-signal">
          {String(index).padStart(2, "0")}
        </span>
        {title}
      </h2>
      {actions}
    </div>
    {description && <p className="mt-2 px-2 text-xs sm:text-sm text-muted-foreground">{description}</p>}
  </div>
);

interface SectionProps {
  id: string;
  /** Position in the page nav, shown as `01`, `02`, ... */
  index: number;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "start" | "center";
  as?: "section" | "footer";
  className?: string;
  children: ReactNode;
}

/** Page section shell: anchor id, 3xl reading column, numbered heading, reveal. */
export const Section = ({
  id,
  index,
  title,
  description,
  actions,
  align,
  as: Element = "section",
  className,
  children,
}: SectionProps) => (
  <Element
    id={id}
    aria-labelledby={`${id}-title`}
    className={cn("relative z-10 py-8 sm:py-10 md:py-12 px-4 sm:px-6", className)}
  >
    <Reveal className="container mx-auto max-w-3xl">
      <SectionHeading
        id={`${id}-title`}
        index={index}
        title={title}
        description={description}
        actions={actions}
        align={align}
      />
      {children}
    </Reveal>
  </Element>
);
