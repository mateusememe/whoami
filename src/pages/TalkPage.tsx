import type { CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, FolderGit2, Github, PlayCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageText } from "@/i18n/pageText";
import { Reveal, TagList } from "@/components/ds";
import { Magnetic } from "@/components/motion/Magnetic";
import { PageFooter } from "@/components/PageFooter";
import { talkPages } from "@/data/talkPages";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";
import { PROJECT_PAGE_IDS, TALK_PAGE_IDS, pagePath } from "@/i18n/routes";
import { formatDate } from "@/lib/text";
import { projectById, talkById } from "@/seo/meta";
import NotFound from "./NotFound";

const chip =
  "glass-card inline-flex h-11 items-center gap-2.5 rounded-full px-5 font-mono text-xs text-foreground transition-colors duration-base hover:text-signal";

/**
 * One talk or workshop: when and where it happened, who taught it with
 * Mateus, what it covered, what attendees needed and the open material.
 * Prerendered per language at /talks/<id>/ (and /pt/, /es/), over the same
 * sound-wave formation as the talks section.
 */
const TalkPage = () => {
  const { id = "" } = useParams();
  const { language } = useLanguage();
  const t = usePageText();
  const { sectionHref, onSectionClick, homePath } = useSiteNavigation();
  const talk = talkById(id);
  const content = talkPages[id];
  const position = TALK_PAGE_IDS.indexOf(id);

  if (!talk || !content || position === -1) return <NotFound />;

  const total = TALK_PAGE_IDS.length;
  const prev = talkById(TALK_PAGE_IDS[(position - 1 + total) % total]);
  const next = talkById(TALK_PAGE_IDS[(position + 1) % total]);
  const project = talk.projectId && PROJECT_PAGE_IDS.includes(talk.projectId) ? projectById(talk.projectId) : undefined;
  const index = String(position + 1).padStart(2, "0");

  const facts: Array<[string, string]> = [
    [t("talk.date"), formatDate(talk.date, language)],
    [t("talk.place"), talk.online ? t("talks.online") : talk.city],
    [t("talk.organizer"), talk.organizer],
    ...(content.hours ? [[t("talk.length"), t("talk.hours", { hours: content.hours })] as [string, string]] : []),
    ...(talk.coSpeakers?.length ? [[t("talk.coSpeakers"), talk.coSpeakers.join(", ")] as [string, string]] : []),
  ];

  const material = [
    { href: talk.links.slides, label: t("talks.slides") },
    { href: talk.links.notebook, label: t("talks.notebook") },
    { href: talk.links.event, label: t("talks.event") },
    { href: content.video, label: t("talk.video") },
  ].filter((item): item is { href: string; label: string } => !!item.href);

  return (
    <main data-scene="5" className="relative z-10">
      <article aria-labelledby="talk-title" className="shell pb-16 pt-28 sm:pt-32 lg:pt-36">
        <nav aria-label={t("a11y.breadcrumb")} className="page-fade label flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link to={homePath} className="link-underline inline-block py-1.5 hover:text-foreground">
            ~/whoami
          </Link>
          <span aria-hidden="true">/</span>
          <a href={sectionHref("talks")} onClick={onSectionClick("talks")} className="link-underline inline-block py-1.5 hover:text-foreground">
            {t("nav.talks")}
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-foreground [overflow-wrap:anywhere]">
            {talk.id}
          </span>
        </nav>

        <header className="mt-8 grid gap-x-10 gap-y-8 lg:mt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="page-fade label flex flex-wrap items-center gap-x-2 gap-y-1" style={{ "--i": 1 } as CSSProperties}>
              <span className="font-mono tabular-nums">
                <span className="text-signal">{index}</span> / {String(total).padStart(2, "0")}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-signal">{t(`talks.${talk.kind}`)}</span>
              <span aria-hidden="true">·</span>
              <span>{talk.event[language]}</span>
            </p>
            <Reveal variant="mask">
              <h1
                id="talk-title"
                lang={talk.titleLang ?? "pt-BR"}
                className="mt-3 font-display text-display-lg font-semibold text-foreground text-balance [overflow-wrap:anywhere]"
              >
                {talk.title}
              </h1>
            </Reveal>
          </div>
          <dl
            className="page-fade grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border/60 pt-5 lg:col-span-4"
            style={{ "--i": 2 } as CSSProperties}
          >
            {facts.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="label">{label}</dt>
                <dd className="mt-1 font-mono text-sm text-foreground [overflow-wrap:anywhere]">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-14 grid gap-x-10 gap-y-10 lg:mt-20 lg:grid-cols-12">
          <Reveal as="p" className="text-display-sm text-foreground text-pretty lg:col-span-7">
            {talk.desc[language]}
          </Reveal>

          <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:col-start-9">
            {talk.links.repo && (
              <Magnetic>
                <a
                  href={talk.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-foreground px-6 font-mono text-xs uppercase tracking-[0.12em] text-background transition-opacity duration-base hover:opacity-85"
                >
                  <Github size={15} aria-hidden="true" />
                  {t("talks.repo")}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </Magnetic>
            )}
            {material.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={chip}>
                {item.label === t("talk.video") && <PlayCircle size={14} aria-hidden="true" />}
                {item.label}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ))}
            {project && (
              <Link
                to={pagePath(language, { kind: "project", id: project.id })}
                className="group mt-2 flex items-start gap-3 text-sm text-muted-foreground transition-colors duration-base hover:text-foreground"
              >
                <FolderGit2 size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-signal" />
                <span>
                  <span className="label block">{t("project.page")}</span>
                  <span className="mt-1 block text-foreground">{project.name}</span>
                </span>
              </Link>
            )}
          </div>
        </div>

        <section aria-labelledby="talk-topics" className="mt-16 lg:mt-24">
          <h2 id="talk-topics" className="label">
            {t("talk.topics")}
          </h2>
          <Reveal as="ol" variant="stagger" className="mt-5 grid gap-x-10 border-t border-border/60 md:grid-cols-2">
            {content.topics[language].map((text, i) => (
              <li key={i} className="flex gap-5 border-b border-border/60 py-6">
                <span aria-hidden="true" className="font-serif text-2xl italic leading-none text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-body-lg text-muted-foreground text-pretty">{text}</p>
              </li>
            ))}
          </Reveal>
        </section>

        <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {content.prerequisites && (
            <section aria-labelledby="talk-prerequisites">
              <h2 id="talk-prerequisites" className="label mb-3">
                {t("talk.prerequisites")}
              </h2>
              <p className="max-w-[60ch] text-body-lg text-muted-foreground text-pretty">{content.prerequisites[language]}</p>
            </section>
          )}
          <section aria-labelledby="talk-stack">
            <h2 id="talk-stack" className="label mb-4">
              {t("project.stack")}
            </h2>
            <TagList items={talk.tech} label={t("a11y.talkTech", { title: talk.title })} tone="outline" />
          </section>
        </div>
      </article>

      <nav aria-label={t("a11y.talkNav")} className="shell grid gap-px pb-16 md:grid-cols-2">
        {[
          { item: prev, label: t("project.prev"), Icon: ArrowLeft, align: "start" as const },
          { item: next, label: t("project.next"), Icon: ArrowRight, align: "end" as const },
        ].map(({ item, label, Icon, align }) =>
          item ? (
            <Link
              key={align}
              to={pagePath(language, { kind: "talk", id: item.id })}
              className={`row-link group flex flex-col gap-2 border-t border-border/60 py-8 ${align === "end" ? "md:items-end md:text-right" : ""}`}
            >
              <span className="label inline-flex items-center gap-2">
                {align === "start" && <Icon size={13} aria-hidden="true" />}
                {label}
                {align === "end" && <Icon size={13} aria-hidden="true" />}
              </span>
              <span lang={item.titleLang ?? "pt-BR"} className="font-display text-display-sm font-semibold text-foreground transition-colors duration-base group-hover:text-signal text-balance">
                {item.title}
              </span>
            </Link>
          ) : null,
        )}
      </nav>

      <PageFooter back={{ section: "talks" }} backLabel={t("talk.back")} />
    </main>
  );
};

export default TalkPage;
