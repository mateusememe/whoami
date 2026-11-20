import { Link, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageFooter } from "@/components/PageFooter";
import { publishedNotes } from "@/content/notes";
import { noteMarkdown, renderMarkdown } from "@/content/notes/bodies";
import { usePageText } from "@/i18n/pageText";
import { pagePath } from "@/i18n/routes";
import { formatDate } from "@/lib/text";
import NotFound from "./NotFound";

/** One note: title, dates, tags and the Markdown body in the page language. */
const NotePage = () => {
  const { id = "" } = useParams();
  const { language } = useLanguage();
  const t = usePageText();
  const note = publishedNotes.find((item) => item.slug === id);
  const markdown = note ? noteMarkdown(note.slug, language) : undefined;

  if (!note || markdown === undefined) return <NotFound />;

  return (
    <main data-scene="0" className="relative z-10">
      <article aria-labelledby="note-title" className="shell pb-16 pt-28 sm:pt-32 lg:pt-36">
        <nav aria-label={t("a11y.breadcrumb")} className="page-fade label flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link to={pagePath(language, { kind: "home" })} className="link-underline inline-block py-1.5 hover:text-foreground">
            ~/whoami
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={pagePath(language, { kind: "notes" })} className="link-underline inline-block py-1.5 hover:text-foreground">
            notes
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-foreground [overflow-wrap:anywhere]">
            {note.slug}
          </span>
        </nav>

        <header className="mx-auto mt-8 max-w-[70ch] lg:mt-12">
          <p className="font-mono text-xs text-muted-foreground">
            <time dateTime={note.date}>{formatDate(note.date, language)}</time>
            {note.updated && (
              <>
                {" · "}
                {t("notes.updated", { date: formatDate(note.updated, language) })}
              </>
            )}
            {note.draft && <span className="ml-3 text-signal">{t("notes.draft")}</span>}
          </p>
          <h1 id="note-title" className="mt-3 font-display text-display-lg font-semibold text-foreground text-balance">
            {note.title[language]}
          </h1>
          <p className="mt-4 text-body-lg text-muted-foreground text-pretty">{note.summary[language]}</p>
        </header>

        <div className="note-body mx-auto mt-10 max-w-[70ch]" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />

        {note.tags.length > 0 && (
          <p className="mx-auto mt-10 max-w-[70ch] font-mono text-[11px] text-muted-foreground">{note.tags.join(" · ")}</p>
        )}
      </article>
      <PageFooter back={{ page: { kind: "notes" } }} backLabel={t("notes.back")} />
    </main>
  );
};

export default NotePage;
