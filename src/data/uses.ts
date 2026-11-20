/**
 * The /uses page: the machine and the tools in daily use, by area. Loaded
 * with the page chunk. Checked against the machine on `usesCheckedAt`;
 * update both when the setup changes.
 */
import type { LocalizedString } from "@/data/portfolio";

export interface UsesItem {
  name: string;
  /** What it is used for. */
  note: LocalizedString;
  url?: string;
}

export interface UsesGroup {
  id: string;
  title: LocalizedString;
  items: UsesItem[];
}

/** ISO date of the last check against the machine. */
export const usesCheckedAt = "2026-11-20";

export const uses: UsesGroup[] = [
  {
    id: "machine",
    title: { pt: "Máquina", en: "Machine", es: "Máquina" },
    items: [
      {
        name: "MacBook Pro",
        note: {
          pt: "Apple M3 Pro com 11 núcleos e 18 GB de memória.",
          en: "Apple M3 Pro with 11 cores and 18 GB of memory.",
          es: "Apple M3 Pro con 11 núcleos y 18 GB de memoria.",
        },
      },
      {
        name: "macOS + Homebrew",
        note: {
          pt: "Pacotes e linguagens instalados pelo Homebrew; o Node.js em várias versões pelo nvm.",
          en: "Packages and languages installed with Homebrew; Node.js in several versions through nvm.",
          es: "Paquetes y lenguajes instalados con Homebrew; Node.js en varias versiones con nvm.",
        },
        url: "https://brew.sh",
      },
    ],
  },
  {
    id: "editor",
    title: { pt: "Editor e terminal", en: "Editor & terminal", es: "Editor y terminal" },
    items: [
      {
        name: "Visual Studio Code",
        note: {
          pt: "Editor do dia a dia, com JetBrains Mono em 14 px e o tema Material High Contrast.",
          en: "The everyday editor, with JetBrains Mono at 14 px and the Material High Contrast theme.",
          es: "El editor de todos los días, con JetBrains Mono en 14 px y el tema Material High Contrast.",
        },
        url: "https://code.visualstudio.com",
      },
      {
        name: "IntelliJ IDEA",
        note: {
          pt: "Para Java e Spring, instalado pelo JetBrains Toolbox.",
          en: "For Java and Spring, installed through JetBrains Toolbox.",
          es: "Para Java y Spring, instalado con JetBrains Toolbox.",
        },
        url: "https://www.jetbrains.com/idea/",
      },
      {
        name: "Antigravity",
        note: {
          pt: "IDE com agentes de IA.",
          en: "IDE with AI agents.",
          es: "IDE con agentes de IA.",
        },
      },
      {
        name: "iTerm2 + zsh",
        note: {
          pt: "Terminal com zsh e Oh My Zsh.",
          en: "Terminal with zsh and Oh My Zsh.",
          es: "Terminal con zsh y Oh My Zsh.",
        },
        url: "https://iterm2.com",
      },
    ],
  },
  {
    id: "ai",
    title: { pt: "IA", en: "AI", es: "IA" },
    items: [
      {
        name: "Claude + Claude Code",
        note: {
          pt: "Assistente e agente de código no terminal.",
          en: "Assistant, and coding agent in the terminal.",
          es: "Asistente, y agente de código en la terminal.",
        },
        url: "https://claude.com/claude-code",
      },
      {
        name: "ChatGPT + Gemini",
        note: {
          pt: "Outros assistentes, para comparar respostas.",
          en: "Other assistants, to compare answers.",
          es: "Otros asistentes, para comparar respuestas.",
        },
      },
      {
        name: "Ollama",
        note: {
          pt: "Modelos abertos rodando localmente, pela linha de comando.",
          en: "Open models running locally, from the command line.",
          es: "Modelos abiertos corriendo en local, desde la línea de comandos.",
        },
        url: "https://ollama.com",
      },
      {
        name: "LM Studio",
        note: {
          pt: "Modelos locais com interface gráfica, para testar antes de usar no código.",
          en: "Local models with a graphical interface, to try them before using them in code.",
          es: "Modelos locales con interfaz gráfica, para probarlos antes de usarlos en el código.",
        },
        url: "https://lmstudio.ai",
      },
    ],
  },
  {
    id: "backend",
    title: { pt: "Containers, APIs e dados", en: "Containers, APIs & data", es: "Contenedores, APIs y datos" },
    items: [
      {
        name: "OrbStack",
        note: {
          pt: "Containers Docker no Mac.",
          en: "Docker containers on the Mac.",
          es: "Contenedores Docker en el Mac.",
        },
        url: "https://orbstack.dev",
      },
      {
        name: "Postman + Insomnia",
        note: {
          pt: "Chamadas a APIs REST e GraphQL durante o desenvolvimento.",
          en: "Calls to REST and GraphQL APIs during development.",
          es: "Llamadas a APIs REST y GraphQL durante el desarrollo.",
        },
      },
      {
        name: "DBeaver",
        note: {
          pt: "Cliente de banco de dados.",
          en: "Database client.",
          es: "Cliente de base de datos.",
        },
        url: "https://dbeaver.io",
      },
      {
        name: "draw.io",
        note: {
          pt: "Diagramas de arquitetura.",
          en: "Architecture diagrams.",
          es: "Diagramas de arquitectura.",
        },
        url: "https://www.drawio.com",
      },
    ],
  },
  {
    id: "research",
    title: { pt: "Pesquisa e escrita", en: "Research & writing", es: "Investigación y escritura" },
    items: [
      {
        name: "Obsidian",
        note: {
          pt: "Notas em Markdown.",
          en: "Notes in Markdown.",
          es: "Notas en Markdown.",
        },
        url: "https://obsidian.md",
      },
      {
        name: "Zotero + Mendeley",
        note: {
          pt: "Referências bibliográficas.",
          en: "Bibliographic references.",
          es: "Referencias bibliográficas.",
        },
      },
      {
        name: "LaTeX (MacTeX)",
        note: {
          pt: "Textos acadêmicos.",
          en: "Academic writing.",
          es: "Textos académicos.",
        },
        url: "https://www.tug.org/mactex/",
      },
      {
        name: "Keynote + OBS",
        note: {
          pt: "Slides das palestras e gravação de tela.",
          en: "Talk slides and screen recording.",
          es: "Diapositivas de las charlas y grabación de pantalla.",
        },
      },
    ],
  },
];
