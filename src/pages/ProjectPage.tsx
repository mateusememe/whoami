import { useRef, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, ExternalLink, Github, Lock, Presentation, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, TagList } from "@/components/ds";
import { ProjectCover, type CoverClock } from "@/components/covers/ProjectCover";
import { CoverControls } from "@/components/covers/CoverControls";
import { Magnetic } from "@/components/motion/Magnetic";
import { publications, talks } from "@/data/portfolio";
import { projectPages } from "@/data/projectPages";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";
import { PROJECT_PAGE_IDS, pagePath } from "@/i18n/routes";
import { formatMonth, withCode } from "@/lib/text";
import { projectById } from "@/seo/meta";
import { PageFooter } from "@/components/PageFooter";
import { usePageText } from "@/i18n/pageText";
import { githubRepos } from "@/data/github-repos";
import NotFound from "./NotFound";

interface RepoDetails {
  pushedAt: string;
  languages: Record<string, number>;
}

/** Last push and languages of a public repository, from the GitHub snapshot (scripts/sync-github.ts). */
function repoDetails(url: string | undefined): RepoDetails | undefined {
  const repo = url?.match(/^https:\/\/github\.com\/([^/]+\/[^/?#]+)/)?.[1];
  return repo ? githubRepos[repo] : undefined;
}

/** Share of each language in the repository, as GitHub counts it: the top four and the rest. */
const LanguageBar = ({ languages }: { languages: Record<string, number> }) => {
  const t = usePageText();
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  if (total === 0) return null;
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 4);
  const rest = sorted.slice(4).reduce((sum, [, bytes]) => sum + bytes, 0);
  const parts = [...top, ...(rest > 0 ? [[t("project.otherLanguages"), rest] as [string, number]] : [])].map(([name, bytes]) => ({
    name,
    share: (bytes / total) * 100,
  }));
  const shades = [1, 0.62, 0.42, 0.28, 0.18];

  return (
    <section aria-labelledby="project-languages" className="mt-12">
      <h2 id="project-languages" className="label mb-4">
        {t("project.languages")}
      </h2>
      <div aria-hidden="true" className="flex h-2.5 w-full overflow-hidden rounded-full bg-border/40">
        {parts.map((part, index) => (
          <span
            key={part.name}
            className={index === 0 ? "bg-signal" : "bg-foreground"}
            style={{ width: `${part.share}%`, opacity: index === 0 ? 1 : shades[index] }}
          />
        ))}
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-xs">
        {parts.map((part) => (
          <div key={part.name} className="flex gap-1.5">
            <dt className="text-foreground">{part.name}</dt>
            <dd className="tabular-nums text-muted-foreground">{part.share < 0.1 ? "<0.1" : part.share.toFixed(1)}%</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

/**
 * The live cover with its controls and caption. Keyed by project, so moving
 * to the next project starts a fresh clock at zero.
 */
const CoverFigure = ({ id, index, caption }: { id: string; index: string; caption: string }) => {
  const { t } = useLanguage();
  const clock = useRef<CoverClock>({ t: 0, playing: true, speed: 1 });
  return (
    <figure className="page-fade mt-10 lg:mt-14" style={{ "--i": 3 } as CSSProperties}>
      <div
        className="glass-card relative aspect-[4/3] overflow-hidden rounded-[1.75rem] sm:aspect-[16/9] lg:aspect-[21/9] lg:rounded-[2.25rem]"
        style={{ viewTransitionName: "project-cover" } as CSSProperties}
      >
        <ProjectCover id={id} clock={clock} className="absolute inset-0 h-full w-full" />
      </div>
      <CoverControls clock={clock} />
      <figcaption className="mt-3 max-w-[70ch] font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
        <span className="text-signal">
          {t("project.figure")} {index}
        </span>{" "}
        — {withCode(caption)}
      </figcaption>
    </figure>
  );
};

/**
 * One featured project: the live cover at full width, the facts, the
 * details and links to the neighbouring projects. Prerendered per language
 * at /projects/<id>/ (and /pt/, /es/). The page keeps the projects
 * section's particle formation (the tunnel), so arriving from the gallery
 * feels like moving deeper into it.
 */
const ProjectPage = () => {
  const { id = "" } = useParams();
  const { language, t } = useLanguage();
  const pageT = usePageText();
  const { sectionHref, onSectionClick, homePath } = useSiteNavigation();
  const project = projectById(id);
  const content = projectPages[id];
  const position = PROJECT_PAGE_IDS.indexOf(id);

  if (!project || !content || position === -1) return <NotFound />;

  const total = PROJECT_PAGE_IDS.length;
  const prev = projectById(PROJECT_PAGE_IDS[(position - 1 + total) % total]);
  const next = projectById(PROJECT_PAGE_IDS[(position + 1) % total]);
  const talk = project.talkId ? talks.find((item) => item.id === project.talkId) : undefined;
  const publication = publications.find((item) => item.projectId === project.id);
  const index = String(position + 1).padStart(2, "0");
  const repo = repoDetails(project.githubUrl);

  const facts: Array<[string, string]> = [
    [t("project.year"), String(project.year)],
    ...(project.language ? [[t("project.language"), project.language] as [string, string]] : []),
    ...(typeof project.stars === "number" && project.stars > 0
      ? [[t("project.stars"), String(project.stars)] as [string, string]]
      : []),
    ...(repo ? [[pageT("project.pushed"), formatMonth(repo.pushedAt, language)] as [string, string]] : []),
    ...(project.license ? [[t("project.license"), project.license] as [string, string]] : []),
    ...(project.coAuthors?.length ? [[t("project.coAuthors"), project.coAuthors.join(", ")] as [string, string]] : []),
  ];

  return (
    <main data-scene="4" className="relative z-10">
      <article aria-labelledby="project-title" className="shell pb-16 pt-28 sm:pt-32 lg:pt-36">
        <nav aria-label={t("a11y.breadcrumb")} className="page-fade label flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link to={homePath} className="link-underline inline-block py-1.5 hover:text-foreground">
            ~/whoami
          </Link>
          <span aria-hidden="true">/</span>
          <a href={sectionHref("projects")} onClick={onSectionClick("projects")} className="link-underline inline-block py-1.5 hover:text-foreground">
            {t("nav.projects")}
          </a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-foreground">
            {project.id}
          </span>
        </nav>

        <header className="mt-8 grid gap-x-10 gap-y-8 lg:mt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="page-fade font-mono text-sm tabular-nums text-muted-foreground" style={{ "--i": 1 } as CSSProperties}>
              <span className="text-signal">{index}</span> / {String(total).padStart(2, "0")}
            </p>
            <Reveal variant="mask">
              <h1
                id="project-title"
                className="mt-3 font-display text-display-xl font-semibold text-foreground [overflow-wrap:anywhere]"
              >
                {project.name}
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
                <dd className="mt-1 flex items-center gap-1.5 font-mono text-sm text-foreground">
                  {label === t("project.stars") && <Star size={12} aria-hidden="true" className="fill-signal text-signal" />}
                  <span className="min-w-0 [overflow-wrap:anywhere]">{value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <CoverFigure key={project.id} id={project.id} index={index} caption={content.cover[language]} />

        <div className="mt-14 grid gap-x-10 gap-y-10 lg:mt-20 lg:grid-cols-12">
          <Reveal as="p" className="text-display-sm text-foreground text-pretty lg:col-span-7">
            {withCode(project.desc[language])}
          </Reveal>

          <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:col-start-9">
            {project.githubUrl ? (
              <Magnetic>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-foreground px-6 font-mono text-xs uppercase tracking-[0.12em] text-background transition-opacity duration-base hover:opacity-85"
                >
                  <Github size={15} aria-hidden="true" />
                  {t("project.repo")}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </Magnetic>
            ) : (
              <span className="label inline-flex h-12 items-center gap-2 normal-case tracking-normal">
                <Lock size={13} aria-hidden="true" />
                {t("projects.private")}
              </span>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card inline-flex h-11 items-center gap-2.5 rounded-full px-5 font-mono text-xs text-foreground transition-colors duration-base hover:text-signal"
              >
                <ExternalLink size={14} aria-hidden="true" />
                {t("project.live")}
              </a>
            )}
            {publication && (
              <a
                // The proceedings PDF when it is online, else the publications list on the home page.
                {...(publication.url
                  ? { href: publication.url, target: "_blank", rel: "noopener noreferrer" }
                  : { href: sectionHref("education"), onClick: onSectionClick("education") })}
                className="group mt-2 flex items-start gap-3 text-sm text-muted-foreground transition-colors duration-base hover:text-foreground"
              >
                <BookOpen size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-signal" />
                <span>
                  <span className="label block">{t("project.published")}</span>
                  <span lang="pt-BR" className="mt-1 block text-foreground">
                    {publication.title}
                  </span>
                  <span className="block">
                    {publication.venue.split(" — ")[0]} {publication.year}
                    {publication.pages ? `, p. ${publication.pages}` : ""}
                  </span>
                </span>
              </a>
            )}
            {talk && (
              <Link
                to={pagePath(language, { kind: "talk", id: talk.id })}
                className="group mt-2 flex items-start gap-3 text-sm text-muted-foreground transition-colors duration-base hover:text-foreground"
              >
                <Presentation size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-signal" />
                <span>
                  <span className="label block">{t("project.talk")}</span>
                  <span className="mt-1 block text-foreground">{talk.title}</span>
                  <span className="block">
                    {talk.event[language]} · {formatMonth(talk.date, language)}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>

        <section aria-labelledby="project-details" className="mt-16 lg:mt-24">
          <h2 id="project-details" className="label">
            {t("project.details")}
          </h2>
          <Reveal as="ol" variant="stagger" className="mt-5 grid gap-x-10 border-t border-border/60 md:grid-cols-2">
            {content.highlights[language].map((text, i) => (
              <li key={i} className="flex gap-5 border-b border-border/60 py-6">
                <span aria-hidden="true" className="font-serif text-2xl italic leading-none text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-body-lg text-muted-foreground text-pretty">{withCode(text)}</p>
              </li>
            ))}
          </Reveal>
        </section>

        {repo && <LanguageBar languages={repo.languages} />}

        {project.tech && project.tech.length > 0 && (
          <section aria-labelledby="project-stack" className="mt-12">
            <h2 id="project-stack" className="label mb-4">
              {t("project.stack")}
            </h2>
            <TagList items={project.tech} label={t("a11y.projectTech")} tone="outline" />
          </section>
        )}
      </article>

      <nav aria-label={t("a11y.projectNav")} className="shell grid gap-px pb-16 md:grid-cols-2">
        {[
          { item: prev, label: t("project.prev"), Icon: ArrowLeft, align: "start" as const },
          { item: next, label: t("project.next"), Icon: ArrowRight, align: "end" as const },
        ].map(({ item, label, Icon, align }) =>
          item ? (
            <Link
              key={align}
              to={pagePath(language, { kind: "project", id: item.id })}
              className={`row-link group flex flex-col gap-2 border-t border-border/60 py-8 ${align === "end" ? "md:items-end md:text-right" : ""}`}
            >
              <span className="label inline-flex items-center gap-2">
                {align === "start" && <Icon size={13} aria-hidden="true" />}
                {label}
                {align === "end" && <Icon size={13} aria-hidden="true" />}
              </span>
              <span className="font-display text-display-sm font-semibold text-foreground transition-colors duration-base group-hover:text-signal [overflow-wrap:anywhere]">
                {item.name}
              </span>
            </Link>
          ) : null,
        )}
      </nav>

      <PageFooter back={{ section: "projects" }} backLabel={t("project.back")} />
    </main>
  );
};

export default ProjectPage;
