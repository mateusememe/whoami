import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, Section } from "@/components/ds";
import { talks } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";
import { pagePath, PROJECT_PAGE_IDS } from "@/i18n/routes";
import { formatMonth } from "@/lib/text";

const years = talks.map((talk) => Number(talk.date.slice(0, 4)));
const firstYear = Math.min(...years);
const lastYear = Math.max(...years);

const chip =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 font-mono text-[11px] text-foreground transition-colors duration-base hover:border-signal/50 hover:text-signal";

/**
 * Talks and workshops as a timeline: the year and month in a narrow column,
 * the talk on the right with its event, co-speakers and links to the open
 * material (or to the activity page in the event program). Behind it, the particle field forms a sound wave.
 */
const TalksSection = () => {
  const { language, t } = useLanguage();

  return (
    <Section
      id="talks"
      index={sectionIndex("talks")}
      title={t("talks.title")}
      description={t("talks.lead", { count: talks.length, first: firstYear, last: lastYear })}
      scene={5}
    >
      <Reveal as="ol" variant="stagger" className="talk-timeline border-t border-border/60">
        {talks.map((talk) => {
          const [year, month] = formatMonth(talk.date, language).split(" ").reverse();
          const projectPage = talk.projectId && PROJECT_PAGE_IDS.includes(talk.projectId);
          return (
            <li key={talk.id} className="talk-item grid gap-x-8 gap-y-4 border-b border-border/60 py-8 sm:py-10 md:grid-cols-12">
              <p className="flex items-baseline gap-3 md:col-span-2 md:flex-col md:gap-1">
                <span className="font-display text-display-md font-semibold tabular-nums leading-none text-foreground">
                  {year}
                </span>
                {month && <span className="label">{month}</span>}
              </p>

              <div className="md:col-span-7">
                <p className="label flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-signal">{t(`talks.${talk.kind}`)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{talk.event[language]}</span>
                </p>
                <h3 lang={talk.titleLang ?? "pt-BR"} className="mt-3 font-display text-display-sm font-semibold text-foreground">
                  <Link
                    to={pagePath(language, { kind: "talk", id: talk.id })}
                    className="link-underline inline-block py-0.5 transition-colors duration-base hover:text-signal"
                  >
                    {talk.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-[62ch] text-body-lg text-muted-foreground text-pretty">{talk.desc[language]}</p>
                <p className="mt-3 font-mono text-[11px] text-muted-foreground sm:text-xs">
                  {talk.organizer} · {talk.online ? t("talks.online") : talk.city}
                  {talk.coSpeakers?.length ? ` · ${t("talks.with", { names: talk.coSpeakers.join(", ") })}` : ""}
                </p>
              </div>

              <ul
                aria-label={t("a11y.talkLinks", { title: talk.title })}
                className="flex flex-wrap content-start gap-2 md:col-span-3 md:justify-end"
              >
                {talk.links.repo && (
                  <li>
                    <a href={talk.links.repo} target="_blank" rel="noopener noreferrer" className={chip}>
                      {t("talks.repo")}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  </li>
                )}
                {talk.links.slides && (
                  <li>
                    <a href={talk.links.slides} target="_blank" rel="noopener noreferrer" className={chip}>
                      {t("talks.slides")}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  </li>
                )}
                {talk.links.notebook && (
                  <li>
                    <a href={talk.links.notebook} target="_blank" rel="noopener noreferrer" className={chip}>
                      {t("talks.notebook")}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  </li>
                )}
                {talk.links.event && (
                  <li>
                    <a href={talk.links.event} target="_blank" rel="noopener noreferrer" className={chip}>
                      {t("talks.event")}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  </li>
                )}
                {projectPage && talk.projectId && (
                  <li>
                    <Link to={pagePath(language, { kind: "project", id: talk.projectId })} className={chip}>
                      {t("talks.project")}
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          );
        })}
      </Reveal>
    </Section>
  );
};

export default TalksSection;
