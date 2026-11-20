/**
 * Strings used only by the lazily loaded pages (talk, now, uses). They live
 * here instead of translations.ts so they load with those pages, not with
 * every visit. usePageText() reads them first and falls back to the shared
 * dictionary.
 */
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/i18n/translations";

type Params = Record<string, string | number>;

export const pageTranslations: Record<string, Record<Language, string>> = {
  "terminal.title": { pt: "Terminal", en: "Terminal", es: "Terminal" },
  "terminal.close": { pt: "Fechar o terminal", en: "Close the terminal", es: "Cerrar el terminal" },
  "terminal.output": { pt: "Saída do terminal", en: "Terminal output", es: "Salida del terminal" },
  "terminal.command": { pt: "Comando", en: "Command", es: "Comando" },
  "notes.lead": {
    pt: "Notas sobre o que construo e estudo, com o código e os números.",
    en: "Notes on what I build and study, with the code and the numbers.",
    es: "Notas sobre lo que construyo y estudio, con el código y los números.",
  },
  "notes.updated": { pt: "atualizado em {date}", en: "updated {date}", es: "actualizado el {date}" },
  "notes.draft": { pt: "rascunho", en: "draft", es: "borrador" },
  "notes.back": { pt: "Todas as notas", en: "All notes", es: "Todas las notas" },
  "talk.date": { pt: "Data", en: "Date", es: "Fecha" },
  "talk.place": { pt: "Local", en: "Place", es: "Lugar" },
  "talk.length": { pt: "Duração", en: "Length", es: "Duración" },
  "talk.hours": { pt: "{hours} horas", en: "{hours} hours", es: "{hours} horas" },
  "talk.organizer": { pt: "Organização", en: "Organizer", es: "Organización" },
  "talk.coSpeakers": { pt: "Com", en: "With", es: "Con" },
  "talk.topics": { pt: "O que foi visto", en: "What it covered", es: "Qué se vio" },
  "talk.prerequisites": { pt: "Pré-requisitos", en: "Prerequisites", es: "Requisitos previos" },
  "talk.material": { pt: "Material", en: "Material", es: "Material" },
  "talk.video": { pt: "Gravação", en: "Recording", es: "Grabación" },
  "talk.back": { pt: "Todas as palestras", en: "All talks", es: "Todas las charlas" },
  "now.lead": {
    pt: "O que estou fazendo agora, montado a partir dos dados deste site. Atualizado em {date}.",
    en: "What I am doing now, built from the data on this site. Updated {date}.",
    es: "Lo que estoy haciendo ahora, armado a partir de los datos de este sitio. Actualizado el {date}.",
  },
  "now.work": { pt: "Trabalho", en: "Work", es: "Trabajo" },
  "now.study": { pt: "Estudo", en: "Study", es: "Estudio" },
  "now.build": { pt: "Construindo", en: "Building", es: "Construyendo" },
  "now.building": { pt: "{count} projetos em {year}", en: "{count} projects in {year}", es: "{count} proyectos en {year}" },
  "now.talk": { pt: "Última palestra", en: "Latest talk", es: "Última charla" },
  "now.contribute": { pt: "Última contribuição", en: "Latest contribution", es: "Última contribución" },
  "now.since": { pt: "desde {date}", en: "since {date}", es: "desde {date}" },
  "now.notes": { pt: "Também", en: "Also", es: "También" },
  "uses.lead": {
    pt: "A máquina e as ferramentas que uso no dia a dia. Conferido em {date}.",
    en: "The machine and the tools I use every day. Checked on {date}.",
    es: "La máquina y las herramientas que uso a diario. Revisado el {date}.",
  },
  "a11y.talkTech": { pt: "Tecnologias de {title}", en: "Technologies in {title}", es: "Tecnologías de {title}" },
  "a11y.talkNav": { pt: "Outras palestras", en: "Other talks", es: "Otras charlas" },
};

/** t() for the lazy pages: their own strings first, then the shared ones. */
export function usePageText(): (key: string, params?: Params) => string {
  const { language, t } = useLanguage();
  return (key, params) => {
    const template = pageTranslations[key]?.[language];
    if (template === undefined) return t(key, params);
    return params ? template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match)) : template;
  };
}
