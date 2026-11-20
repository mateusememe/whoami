import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, Section } from "@/components/ds";
import { certifications, education, publicationReference, publications, spokenLanguages } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";
import { PROJECT_PAGE_IDS, pagePath } from "@/i18n/routes";

/** `https://www.unoeste.br/.../Computa%c3%a7%c3%a3o.pdf?v=1` → `unoeste.br/…/Computação.pdf`. */
const shortUrl = (url: string) => {
  const { hostname, pathname } = new URL(url);
  const file = decodeURIComponent(pathname.split("/").pop() ?? "");
  return `${hostname.replace(/^www\./, "")}/…/${file}`;
};

/**
 * Degrees as full-width rows (on hover a row opens up and a signal wash rises
 * behind it), then languages and certifications, then publications.
 */
const EducationSection = () => {
  const { language, t } = useLanguage();

  return (
    <Section id="education" index={sectionIndex("education")} title={t("edu.title")} scene={3}>
      <Reveal as="ul" variant="stagger" className="border-t border-border/60">
        {education.map((item, index) => (
          <li
            key={item.school}
            className="row-link grid items-baseline gap-x-8 gap-y-2 border-b border-border/60 py-8 sm:py-10 md:grid-cols-12"
          >
            <span aria-hidden="true" className="font-mono text-xs text-signal md:col-span-1">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-display-md font-semibold text-foreground md:col-span-5">{item.school}</h3>
            <p className="font-serif text-xl italic text-foreground/75 sm:text-2xl md:col-span-3">{t(item.degreeKey)}</p>
            <div className="flex items-center justify-between gap-4 md:col-span-3 md:justify-end">
              <div className="md:text-right">
                <p className="font-mono text-xs text-muted-foreground">{item.period[language]}</p>
                {item.current && (
                  <p className="label mt-2 inline-flex items-center gap-2 text-signal">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal animate-signal-pulse" />
                    {t("edu.inProgress")}
                  </p>
                )}
              </div>
              <ArrowUpRight aria-hidden="true" size={22} className="row-arrow shrink-0 text-signal" />
            </div>
          </li>
        ))}
      </Reveal>

      <Reveal as="dl" variant="stagger" className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        <div>
          <dt className="label mb-3">{t("edu.languages")}</dt>
          {spokenLanguages.map((item) => (
            <dd key={item.code} className="flex items-baseline justify-between gap-4 border-b border-border/60 py-3">
              <span className="font-display text-display-sm font-medium text-foreground">{item.name[language]}</span>
              <span className="font-mono text-xs text-muted-foreground">{item.level[language]}</span>
            </dd>
          ))}
        </div>
        <div>
          <dt className="label mb-3">{t("edu.certifications")}</dt>
          {certifications.map((item) => (
            <dd key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border/60 py-3">
              <span className="font-display text-display-sm font-medium text-foreground">{item.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{item.detail[language]}</span>
            </dd>
          ))}
        </div>
      </Reveal>

      {publications.length > 0 && (
        <div className="mt-12">
          <h3 className="label mb-3">{t("edu.publications")}</h3>
          <Reveal as="ul" variant="stagger" className="border-t border-border/60">
            {publications.map((item) => {
              const reference = publicationReference(item);
              return (
                <li key={item.id} className="grid gap-x-8 gap-y-3 border-b border-border/60 py-6 md:grid-cols-12">
                  <p className="flex items-baseline gap-3 font-mono text-xs tabular-nums md:col-span-1 md:flex-col md:gap-1">
                    <span className="text-signal">{item.year}</span>
                    <span className="label">{t(item.kind === "abstract" ? "edu.abstract" : "edu.paper")}</span>
                  </p>
                  <div className="md:col-span-8">
                    <p lang="pt-BR" className="font-display text-display-sm font-medium text-foreground text-pretty">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground text-pretty">{item.summary[language]}</p>
                    {/* ABNT reference, in Portuguese like the publication. */}
                    <p lang="pt-BR" className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:text-xs">
                      {reference.main}
                      {reference.url && (
                        <>
                          {" "}Disponível em:{" "}
                          <a href={reference.url} target="_blank" rel="noopener noreferrer" className="link-underline text-foreground">
                            {shortUrl(reference.url)}
                          </a>
                          .{reference.accessed ? ` Acesso em: ${reference.accessed}.` : ""}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 md:col-span-3 md:justify-end">
                    {item.projectId && PROJECT_PAGE_IDS.includes(item.projectId) && (
                      <Link
                        to={pagePath(language, { kind: "project", id: item.projectId })}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 font-mono text-[11px] text-foreground transition-colors duration-base hover:border-signal/50 hover:text-signal"
                      >
                        {t("talks.project")}
                        <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 font-mono text-[11px] text-foreground transition-colors duration-base hover:border-signal/50 hover:text-signal"
                      >
                        {t("edu.proceedings")}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    )}
                    {item.sameAs?.map((entry) => (
                      <a
                        key={entry.url}
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 font-mono text-[11px] text-foreground transition-colors duration-base hover:border-signal/50 hover:text-signal"
                      >
                        {entry.label}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </li>
              );
            })}
          </Reveal>
        </div>
      )}
    </Section>
  );
};

export default EducationSection;
