import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal } from "@/components/ds";
import { InnerPageHeader } from "@/components/InnerPageHeader";
import { PageFooter } from "@/components/PageFooter";
import { publishedNotes } from "@/content/notes";
import { usePageText } from "@/i18n/pageText";
import { pagePath } from "@/i18n/routes";
import { formatDate } from "@/lib/text";

/** /notes: every published note, newest first. */
const NotesPage = () => {
  const { language } = useLanguage();
  const t = usePageText();

  return (
    <main data-scene="0" className="relative z-10">
      <article aria-labelledby="notes-title" className="shell pb-16 pt-28 sm:pt-32 lg:pt-36">
        <InnerPageHeader id="notes-title" crumb="notes" title={t("pages.notes")} lead={t("notes.lead")} />
        <Reveal as="ol" variant="stagger" className="mt-12 border-t border-border/60 lg:mt-16">
          {publishedNotes.map((note) => (
            <li key={note.slug} className="grid gap-x-10 gap-y-2 border-b border-border/60 py-8 md:grid-cols-12">
              <p className="font-mono text-xs text-muted-foreground md:col-span-3 md:pt-2">
                <time dateTime={note.date}>{formatDate(note.date, language)}</time>
              </p>
              <div className="min-w-0 md:col-span-9">
                <h2 className="font-display text-display-sm font-semibold text-foreground">
                  <Link
                    to={pagePath(language, { kind: "note", id: note.slug })}
                    className="link-underline inline-block py-0.5 transition-colors duration-base hover:text-signal"
                  >
                    {note.title[language]}
                  </Link>
                </h2>
                <p className="mt-3 max-w-[62ch] text-body-lg text-muted-foreground text-pretty">{note.summary[language]}</p>
                {note.tags.length > 0 && <p className="mt-3 font-mono text-[11px] text-muted-foreground">{note.tags.join(" · ")}</p>}
              </div>
            </li>
          ))}
        </Reveal>
      </article>
      <PageFooter back={{ section: "about" }} backLabel={t("nav.about")} />
    </main>
  );
};

export default NotesPage;
