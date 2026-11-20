/**
 * Content of the talk pages (/talks/<id>/), loaded with the page chunk. The
 * topics come from the event program (Unoeste activity pages) or from the
 * README and slides in the talk's repository; the prerequisites and the
 * length are copied from the program. Nothing here is in the main bundle.
 */
import type { LocalizedString } from "@/data/portfolio";
import type { LocalizedList } from "@/data/projectPages";

export interface TalkPageContent {
  /** What the session covered: 2 or 4 points. */
  topics: LocalizedList;
  /** What attendees needed to know, as the program states it. */
  prerequisites?: LocalizedString;
  /** Length in hours, when the program gives the schedule. */
  hours?: number;
  /** Recording of the session, when there is one. */
  video?: string;
}

export const talkPages: Record<string, TalkPageContent> = {
  "mcp-devfest-2026": {
    topics: {
      en: [
        "DevBrain, the server built in class, answers one question for a coding agent: is this branch ready for a pull request?",
        "The review rules live in the server's code, not in the prompt. The agent discovers the tools, calls them, reads the resources and backs its answer with what came back.",
        "The server is split into domain, application and adapters, and its tests drive it through the MCP client with no LLM in between.",
        "The same server runs in Antigravity, Gemini CLI, Claude Code, GitHub Copilot and Codex without changes; an optional workflow deploys it to Google Cloud Run.",
      ],
      pt: [
        "O DevBrain, servidor construído na aula, responde uma pergunta para um agente de código: esta branch está pronta para virar pull request?",
        "As regras de revisão ficam no código do servidor, não no prompt. O agente descobre as tools, chama, lê os resources e justifica a resposta com o que voltou.",
        "O servidor é dividido em domain, application e adapters, e os testes o exercitam pelo client MCP, sem LLM no meio.",
        "O mesmo servidor roda no Antigravity, no Gemini CLI, no Claude Code, no GitHub Copilot e no Codex sem mudanças; um workflow opcional faz o deploy no Google Cloud Run.",
      ],
      es: [
        "DevBrain, el servidor construido en clase, responde una pregunta para un agente de código: ¿esta branch está lista para un pull request?",
        "Las reglas de revisión están en el código del servidor, no en el prompt. El agente descubre las tools, las llama, lee los resources y justifica la respuesta con lo que volvió.",
        "El servidor se divide en domain, application y adapters, y sus pruebas lo ejercitan por el cliente MCP, sin LLM de por medio.",
        "El mismo servidor funciona en Antigravity, Gemini CLI, Claude Code, GitHub Copilot y Codex sin cambios; un workflow opcional lo despliega en Google Cloud Run.",
      ],
    },
    prerequisites: {
      en: "Git, uv and an editor; Node.js only for the MCP Inspector. uv installs Python.",
      pt: "Git, uv e um editor; Node.js só para o MCP Inspector. O uv instala o Python.",
      es: "Git, uv y un editor; Node.js solo para el MCP Inspector. uv instala Python.",
    },
  },

  "web-infoeste-2025": {
    topics: {
      en: [
        "What happens between a click and the server, and how data travels: TCP and UDP.",
        "APIs and webhooks, and the split between frontend and backend.",
        "SPA and SSR, monolith and microservices: what each choice changes.",
        "The path to full-stack development, followed by questions.",
      ],
      pt: [
        "O que acontece entre o clique e o servidor, e como os dados trafegam: TCP e UDP.",
        "APIs e webhooks, e a divisão entre frontend e backend.",
        "SPA e SSR, monólito e microsserviços: o que cada escolha muda.",
        "O caminho para o desenvolvimento full-stack, seguido de perguntas.",
      ],
      es: [
        "Qué pasa entre el clic y el servidor, y cómo viajan los datos: TCP y UDP.",
        "APIs y webhooks, y la división entre frontend y backend.",
        "SPA y SSR, monolito y microservicios: qué cambia cada elección.",
        "El camino al desarrollo full-stack, seguido de preguntas.",
      ],
    },
    prerequisites: {
      en: "No programming background; familiarity with computers and the internet.",
      pt: "Nenhum conhecimento de programação; familiaridade com computador e internet.",
      es: "Ningún conocimiento de programación; familiaridad con la computadora e internet.",
    },
    hours: 4,
  },

  "ai-autopsy-devfest-2025": {
    topics: {
      en: [
        "Train a LightGBM classifier on the Titanic dataset.",
        "Debug its logic to see why it predicts survival or death for each passenger.",
        "Explain single predictions with LIME and the model's global behaviour with SHAP.",
        "Plot both views, so the explanation can be read without the code.",
      ],
      pt: [
        "Treinar um classificador LightGBM na base do Titanic.",
        "Depurar a lógica dele para ver por que prevê sobrevivência ou morte para cada passageiro.",
        "Explicar previsões individuais com LIME e o comportamento global do modelo com SHAP.",
        "Plotar as duas visões, para que a explicação possa ser lida sem o código.",
      ],
      es: [
        "Entrenar un clasificador LightGBM con el dataset del Titanic.",
        "Depurar su lógica para ver por qué predice supervivencia o muerte para cada pasajero.",
        "Explicar predicciones individuales con LIME y el comportamiento global del modelo con SHAP.",
        "Graficar las dos vistas, para que la explicación se lea sin el código.",
      ],
    },
  },

  "api-hero-devfest-2025": {
    topics: {
      en: [
        "A transactional API in Spring Boot with a GraphQL schema.",
        "PostgreSQL for storage and Redis as a read cache, started with Docker Compose; the code and the slides are in the codecash repository.",
      ],
      pt: [
        "Uma API transacional em Spring Boot com schema GraphQL.",
        "PostgreSQL para armazenamento e Redis como cache de leitura, iniciados com Docker Compose; o código e os slides estão no repositório codecash.",
      ],
      es: [
        "Una API transaccional en Spring Boot con schema GraphQL.",
        "PostgreSQL para almacenamiento y Redis como caché de lectura, iniciados con Docker Compose; el código y las diapositivas están en el repositorio codecash.",
      ],
    },
  },

  "time-series-infoeste-2024": {
    topics: {
      en: [
        "Machine learning and time-series basics, then exploring and preparing stock data: cleaning, missing values and normalization.",
        "Neural networks compared with ARIMA and regression models.",
        "Building and training an LSTM network with TensorFlow and Keras, then plotting its predictions against the real values.",
        "Applications and ethics of forecasting, followed by questions.",
      ],
      pt: [
        "Fundamentos de machine learning e séries temporais, depois exploração e preparo de dados de ações: limpeza, valores ausentes e normalização.",
        "Redes neurais comparadas com modelos ARIMA e de regressão.",
        "Construção e treino de uma rede LSTM com TensorFlow e Keras, e o gráfico das previsões contra os valores reais.",
        "Aplicações e ética da previsão, seguidas de perguntas.",
      ],
      es: [
        "Fundamentos de machine learning y series temporales, luego exploración y preparación de datos de acciones: limpieza, valores faltantes y normalización.",
        "Redes neuronales comparadas con modelos ARIMA y de regresión.",
        "Construcción y entrenamiento de una red LSTM con TensorFlow y Keras, y el gráfico de las predicciones contra los valores reales.",
        "Aplicaciones y ética del pronóstico, seguidas de preguntas.",
      ],
    },
    prerequisites: {
      en: "Basic computer skills, programming logic and a Gmail account.",
      pt: "Noções básicas de informática, lógica de programação e uma conta Gmail.",
      es: "Nociones básicas de informática, lógica de programación y una cuenta de Gmail.",
    },
    hours: 4,
  },

  "git-infoeste-2023": {
    topics: {
      en: [
        "Version control with Git and collaborative development on GitHub, practised on a C program.",
        "The repository keeps the day-one slides and a reading list on commit conventions, gitmoji and the Oh My Git! game.",
      ],
      pt: [
        "Controle de versão com Git e desenvolvimento colaborativo no GitHub, praticados em um programa em C.",
        "O repositório guarda os slides do primeiro dia e uma lista de leitura sobre padrões de commit, gitmoji e o jogo Oh My Git!.",
      ],
      es: [
        "Control de versiones con Git y desarrollo colaborativo en GitHub, practicados con un programa en C.",
        "El repositorio guarda las diapositivas del primer día y una lista de lectura sobre convenciones de commit, gitmoji y el juego Oh My Git!.",
      ],
    },
  },

  "git-infoeste-2022": {
    topics: {
      en: [
        "What version control is and why it matters.",
        "Git basics and its core commands: commit, branch and merge.",
        "Remote repositories on GitHub.",
        "Real cases: restore an old version, open an issue and send a pull request.",
      ],
      pt: [
        "O que é controle de versão e por que ele importa.",
        "Fundamentos do Git e seus comandos principais: commit, branch e merge.",
        "Repositórios remotos no GitHub.",
        "Casos reais: restaurar uma versão antiga, abrir uma issue e enviar um pull request.",
      ],
      es: [
        "Qué es el control de versiones y por qué importa.",
        "Fundamentos de Git y sus comandos principales: commit, branch y merge.",
        "Repositorios remotos en GitHub.",
        "Casos reales: restaurar una versión antigua, abrir un issue y enviar un pull request.",
      ],
    },
    prerequisites: {
      en: "None.",
      pt: "Nenhum.",
      es: "Ninguno.",
    },
    hours: 4,
  },

  "react-infoeste-2022": {
    topics: {
      en: [
        "Environment setup, then the basics of React and TypeScript.",
        "Components, state, the Context API and the component lifecycle, applied to one project.",
        "Routing, built-in and custom hooks, and data from an API.",
        "The finished project deployed to online hosting.",
      ],
      pt: [
        "Configuração do ambiente, depois os fundamentos de React e TypeScript.",
        "Componentes, estado, Context API e ciclo de vida dos componentes, aplicados a um projeto.",
        "Rotas, hooks nativos e customizados, e dados de uma API.",
        "O projeto finalizado e publicado em uma hospedagem online.",
      ],
      es: [
        "Configuración del entorno, luego los fundamentos de React y TypeScript.",
        "Componentes, estado, Context API y ciclo de vida de los componentes, aplicados a un proyecto.",
        "Rutas, hooks nativos y personalizados, y datos de una API.",
        "El proyecto terminado y publicado en un hosting en línea.",
      ],
    },
    prerequisites: {
      en: "Basic JavaScript, HTML and CSS, conditionals and loops, and notions of object-oriented programming.",
      pt: "JavaScript, HTML e CSS básicos, estruturas condicionais e de repetição, e noções de POO.",
      es: "JavaScript, HTML y CSS básicos, estructuras condicionales y de repetición, y nociones de POO.",
    },
    hours: 8,
  },

  "node-infoeste-2022": {
    topics: {
      en: [
        "REST APIs and HTTP, then Node.js with Express.",
        "PostgreSQL through Prisma ORM.",
        "TDD and unit tests with Jest.",
        "A CRUD REST API built with those practices and covered by tests.",
      ],
      pt: [
        "APIs REST e HTTP, depois Node.js com Express.",
        "PostgreSQL com Prisma ORM.",
        "TDD e testes unitários com Jest.",
        "Uma API REST de CRUD construída com essas práticas e coberta por testes.",
      ],
      es: [
        "APIs REST y HTTP, luego Node.js con Express.",
        "PostgreSQL con Prisma ORM.",
        "TDD y pruebas unitarias con Jest.",
        "Una API REST de CRUD construida con esas prácticas y cubierta por pruebas.",
      ],
    },
    prerequisites: {
      en: "Basic JavaScript and databases.",
      pt: "Conhecimentos básicos de JavaScript e banco de dados.",
      es: "Conocimientos básicos de JavaScript y bases de datos.",
    },
    hours: 8,
  },
};
