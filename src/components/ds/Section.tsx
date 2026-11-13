import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ds/Reveal";

interface SectionHeadingProps {
  id: string;
  index: number;
  title: string;
  /** One factual line under the title. */
  description?: string;
  actions?: ReactNode;
  align?: "start" | "center";
  /** `xl` for full-width sections, `lg` when the heading shares a row or a narrow column. */
  size?: "xl" | "lg";
  className?: string;
}

/**
 * Display heading: the title in large type with its index (`01`) set small
 * in signal color at the cap line. The title rises out of a mask the first
 * time it scrolls into view.
 */
export const SectionHeading = ({
  id,
  index,
  title,
  description,
  actions,
  align = "start",
  size = "xl",
  className,
}: SectionHeadingProps) => (
  <div className={cn("mb-10 sm:mb-14", align === "center" && "text-center", className)}>
    <div className={cn("flex flex-wrap items-end gap-x-8 gap-y-4", align === "center" ? "justify-center" : "justify-between")}>
      <Reveal variant="mask">
        <h2
          id={id}
          className={cn(
            "section-title font-display font-semibold text-foreground text-balance",
            size === "xl" ? "text-display-xl" : "text-display-lg",
          )}
        >
          <span aria-hidden="true" className="section-index">
            {String(index).padStart(2, "0")}
          </span>
          {title}
        </h2>
      </Reveal>
      {actions}
    </div>
    {description && (
      <Reveal delay={120}>
        <p className={cn("mt-5 max-w-[46ch] text-body-lg text-muted-foreground", align === "center" && "mx-auto")}>
          {description}
        </p>
      </Reveal>
    )}
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
  /** Particle formation shown behind this section (see sceneState.morph). */
  scene?: number;
  className?: string;
  children: ReactNode;
}

/** Page section shell: anchor id, full-width shell, display heading. */
export const Section = ({
  id,
  index,
  title,
  description,
  actions,
  align,
  as: Element = "section",
  scene,
  className,
  children,
}: SectionProps) => (
  <Element
    id={id}
    aria-labelledby={`${id}-title`}
    data-scene={scene}
    className={cn("relative z-10 py-section", className)}
  >
    <div className="shell">
      <SectionHeading
        id={`${id}-title`}
        index={index}
        title={title}
        description={description}
        actions={actions}
        align={align}
      />
      {children}
    </div>
  </Element>
);
