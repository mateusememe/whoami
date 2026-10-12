/** Page sections in nav order. Section headings derive their `01`..`06` index from this list. */
export const NAV_ITEMS = ["about", "experience", "education", "skills", "projects", "contact"] as const;

export type SectionId = (typeof NAV_ITEMS)[number];

export function sectionIndex(id: SectionId): number {
  return NAV_ITEMS.indexOf(id) + 1;
}
