export interface SocialLink {
  iconName: "Instagram" | "X" | "Discord" | "Linkedin" | "Mail" | "Github" | "Orcid" | "Lattes";
  href: string;
  label: string;
  displayText?: string;
}

export interface LocalizedString {
  pt: string;
  en: string;
  es: string;
}

export interface Experience {
  company: string;
  /** City and state, language neutral (e.g. "São Paulo, SP"). */
  location: string;
  role: LocalizedString;
  period: LocalizedString;
  desc: LocalizedString;
  tech: string[];
}

export interface EducationItem {
  school: string;
  /** Official name, for structured data. */
  fullName?: string;
  degreeKey: string;
  period: LocalizedString;
  /** Degree still in progress. */
  current?: boolean;
}

export interface TechGroup {
  id: string;
  /** Translation key for the group label. */
  labelKey: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  desc: LocalizedString;
  stars?: number;
  tech?: string[];
  /** Main programming language, for structured data. */
  language?: string;
  /** Year the repository was created. */
  year: number;
  /** SPDX id, when the repository declares a license. */
  license?: string;
  /** People who wrote the project with Mateus. */
  coAuthors?: string[];
  /** Talk or workshop the project was built for (a `talks` id). */
  talkId?: string;
  /** Omit for private repositories: the card then carries no link. */
  githubUrl?: string;
  liveUrl?: string;
  /**
   * Featured projects get a gallery card with an animated cover and their own
   * page (content in src/data/projectPages.ts); the rest are listed below it.
   */
  featured?: boolean;
}

/** A merged pull request (or set of them) in someone else's repository. */
export interface ContributionItem {
  id: string;
  /** `owner/name` on GitHub. */
  repo: string;
  url: string;
  /** Month of the merge, `YYYY-MM`. */
  merged: string;
  stars?: number;
  desc: LocalizedString;
  tech: string[];
}

/** A talk or workshop given at an event. */
export interface TalkItem {
  id: string;
  /** Title as announced, in the language it was given. */
  title: string;
  kind: "workshop" | "talk";
  event: LocalizedString;
  organizer: string;
  city: string;
  /** Given online instead of in the city. */
  online?: boolean;
  /** `YYYY-MM-DD` when the day is on record, else `YYYY-MM` or `YYYY`. */
  date: string;
  desc: LocalizedString;
  coSpeakers?: string[];
  /** Related project (a `projects` id). */
  projectId?: string;
  /** At least one link. `event` is the activity's page in the event program. */
  links: { repo?: string; slides?: string; notebook?: string; event?: string };
  tech: string[];
}

/** A paper or abstract in proceedings or a journal. */
export interface Publication {
  id: string;
  kind: "abstract" | "paper";
  /** Title as published. */
  title: string;
  /** Authors as cited (ABNT), in the order printed in the publication. */
  authors: string[];
  /** Event or journal, with its full name. */
  venue: string;
  /** Section of the proceedings, as printed. */
  section?: string;
  publisher: string;
  city: string;
  year: number;
  pages?: string;
  summary: LocalizedString;
  /** Project the publication comes from (a `projects` id). */
  projectId?: string;
  /** Where the text is published (the proceedings PDF). */
  url?: string;
  /** Date the URL was last checked, `YYYY-MM-DD` (ABNT "Acesso em"). */
  accessed?: string;
}

export interface SpokenLanguage {
  /** BCP 47 tag. */
  code: string;
  name: LocalizedString;
  level: LocalizedString;
}

export interface Certification {
  name: string;
  issuer: string;
  detail: LocalizedString;
}

/** Facts about the person that are not lists. Bump `updatedAt` whenever this file changes. */
export const profile = {
  name: "Mateus Mendonça Monteiro",
  givenName: "Mateus",
  familyName: "Mendonça Monteiro",
  city: "São Paulo",
  region: "SP",
  countryCode: "BR",
  githubUser: "mateusememe",
  /** ISO date of the last content update. Feeds sitemap lastmod, JSON-LD dateModified and llms.txt. */
  updatedAt: "2026-11-16",
} as const;

export const socialLinks: SocialLink[] = [
  {
    iconName: "Linkedin",
    href: "https://linkedin.com/in/mateus-men",
    label: "LinkedIn",
    displayText: "mateus-men",
  },
  {
    iconName: "Github",
    href: "https://github.com/mateusememe",
    label: "GitHub",
    displayText: "mateusememe",
  },
  {
    iconName: "Orcid",
    href: "https://orcid.org/0009-0009-6468-8493",
    label: "ORCID",
    displayText: "0009-0009-6468-8493",
  },
  {
    iconName: "Lattes",
    href: "http://lattes.cnpq.br/2301165554095558",
    label: "Currículo Lattes",
    displayText: "Lattes CNPq",
  },
  {
    iconName: "Mail",
    href: "mailto:matt.mendon@gmail.com",
    label: "Email",
    displayText: "matt.mendon@gmail.com",
  },
  {
    iconName: "X",
    href: "https://x.com/mateusememe",
    label: "X (Twitter)",
    displayText: "@mateusememe",
  },
  {
    iconName: "Instagram",
    href: "https://instagram.com/mateusememe",
    label: "Instagram",
    displayText: "@mateusememe",
  },
  {
    iconName: "Discord",
    href: "https://discord.com/users/mateusememe",
    label: "Discord",
    displayText: "@mateusememe",
  },
];

export const experiences: Experience[] = [
  {
    company: "Itaú Unibanco",
    location: "São Paulo, SP",
    role: {
      pt: "Engenheiro de Software",
      en: "Software Engineer",
      es: "Ingeniero de Software",
    },
    period: {
      pt: "Mai 2026 – Presente",
      en: "May 2026 – Present",
      es: "May 2026 – Presente",
    },
    desc: {
      pt: "Desenvolvo ferramentas aceleradoras para migração de dados entre ambientes AWS multi-conta e plataformas de dados de clientes (CDP). Escrevo microsserviços serverless em Python e Go com arquitetura hexagonal, design orientado a eventos e domínios de Data Mesh. Construo pipelines ETL com AWS Step Functions, Glue e Lambda. Governança e observabilidade com KMS, CloudTrail, CloudWatch, X-Ray, Datadog e Grafana.",
      en: "Build accelerator tools that migrate data between multi-account AWS environments and Customer Data Platforms (CDP). Write serverless microservices in Python and Go with hexagonal architecture, event-driven design and Data Mesh domains. Build ETL pipelines with AWS Step Functions, Glue, and Lambda. Governance and observability run on KMS, CloudTrail, CloudWatch, X-Ray, Datadog, and Grafana.",
      es: "Desarrollo herramientas aceleradoras para migración de datos entre entornos AWS multicuenta y plataformas de datos de clientes (CDP). Escribo microservicios serverless en Python y Go con arquitectura hexagonal, diseño orientado a eventos y dominios de Data Mesh. Construyo pipelines ETL con AWS Step Functions, Glue y Lambda. Gobernanza y observabilidad con KMS, CloudTrail, CloudWatch, X-Ray, Datadog y Grafana.",
    },
    tech: [
      "Python",
      "Go",
      "AWS",
      "Step Functions",
      "Glue",
      "Lambda",
      "KMS",
      "CloudTrail",
      "CloudWatch",
      "X-Ray",
      "Datadog",
      "Grafana",
    ],
  },
  {
    company: "LuizaLabs",
    location: "São Paulo, SP",
    role: {
      pt: "Engenheiro Backend",
      en: "Backend Engineer",
      es: "Ingeniero Backend",
    },
    period: {
      pt: "Jan 2025 – Abr 2026",
      en: "Jan 2025 – Apr 2026",
      es: "Ene 2025 – Abr 2026",
    },
    desc: {
      pt: "Atuação no motor de busca e em microsserviços de alto volume, usados por milhões de pessoas por dia. Stack com Java (Spring Boot, Quarkus), Node.js (Fastify) e TypeScript, integrando com MongoDB, Redis e Elasticsearch. Implementei circuit breakers e fallbacks e reduzi em 20% o tempo de sincronização de dados de produtos ao otimizar a reindexação no Elasticsearch. APIs GraphQL (Apollo Federation) e REST, mensageria com RabbitMQ e Google Pub/Sub, e deploy em Kubernetes na GCP e na Magalu Cloud via ArgoCD.",
      en: "Worked on the search engine and high-throughput microservices used by millions of people a day. Stack: Java (Spring Boot, Quarkus), Node.js (Fastify), and TypeScript, backed by MongoDB, Redis, and Elasticsearch. Implemented circuit breakers and fallbacks, and cut product data synchronization time by 20% by optimizing Elasticsearch re-indexing. Built GraphQL (Apollo Federation) and REST APIs, async messaging with RabbitMQ and Pub/Sub, deployed to Kubernetes on GCP and Magalu Cloud via ArgoCD.",
      es: "Trabajo en el motor de búsqueda y en microservicios de alto tráfico, usados por millones de personas al día. Stack con Java (Spring Boot, Quarkus), Node.js (Fastify) y TypeScript, integrando con MongoDB, Redis y Elasticsearch. Implementé circuit breakers y fallbacks y reduje en 20% el tiempo de sincronización de datos de productos al optimizar la reindexación en Elasticsearch. APIs GraphQL (Apollo Federation) y REST, mensajería con RabbitMQ y Pub/Sub, y despliegues en Kubernetes sobre GCP y Magalu Cloud vía ArgoCD.",
    },
    tech: [
      "Java",
      "Spring Boot",
      "Quarkus",
      "Node.js",
      "Fastify",
      "TypeScript",
      "MongoDB",
      "Redis",
      "Elasticsearch",
      "GraphQL",
      "Apollo Federation",
      "RabbitMQ",
      "Pub/Sub",
      "GCP",
      "MagaluCloud",
      "Kubernetes",
      "ArgoCD",
      "Datadog",
      "Grafana",
    ],
  },
  {
    company: "Vericode",
    location: "São Paulo, SP",
    role: {
      pt: "Engenheiro de Software",
      en: "Software Engineer",
      es: "Ingeniero de Software",
    },
    period: {
      pt: "Abr 2023 – Dez 2024",
      en: "Apr 2023 – Dec 2024",
      es: "Abr 2023 – Dic 2024",
    },
    desc: {
      pt: "Desenvolvimento e sustentação de microsserviços Java com Spring e Quarkus em Kubernetes, incluindo serviços de alto volume com Kafka. Redução de 10% no tempo de inicialização e no consumo de memória. APIs REST, autenticação com Spring Security e JWT, bancos MySQL e MongoDB, e CI/CD com Docker, Jenkins, SonarQube e Bitbucket. Equipe de 12 pessoas.",
      en: "Maintained and deployed Java microservices with Spring and Quarkus on Kubernetes, including high-throughput services with Kafka. Lowered startup time and memory use by 10%. Built REST APIs, authentication with Spring Security and JWT, MySQL and MongoDB storage, with CI/CD on Docker, Jenkins, SonarQube, and Bitbucket. Team of 12.",
      es: "Desarrollo y mantenimiento de microservicios Java con Spring y Quarkus en Kubernetes, incluidos servicios de alto volumen con Kafka. Reducción de 10% en el tiempo de inicio y en el uso de memoria. APIs REST, autenticación con Spring Security y JWT, bases MySQL y MongoDB, y CI/CD con Docker, Jenkins, SonarQube y Bitbucket. Equipo de 12 personas.",
    },
    tech: [
      "Java",
      "Spring",
      "Quarkus",
      "Kafka",
      "Kubernetes",
      "MySQL",
      "MongoDB",
      "Firestore",
      "Spring Security",
      "JWT",
      "Docker",
      "Jenkins",
      "SonarQube",
      "Bitbucket",
    ],
  },
  {
    company: "Vericode",
    location: "São Paulo, SP",
    role: {
      pt: "Estagiário de Engenharia de Software",
      en: "Software Engineer Intern",
      es: "Pasante de Ingeniería de Software",
    },
    period: {
      pt: "Set 2022 – Abr 2023",
      en: "Sep 2022 – Apr 2023",
      es: "Sep 2022 – Abr 2023",
    },
    desc: {
      pt: "Desenvolvimento de interfaces e aplicações web com Next.js, React e TypeScript. Otimizações de renderização e SEO com ganho de 20% em métricas de performance. Integração com APIs REST e construção de interfaces interativas para configuração de fluxos sem código.",
      en: "Built web applications using Next.js, React, and TypeScript. Improved rendering and SEO metrics by 20%. Integrated REST APIs and created interactive interfaces for no-code workflow builders.",
      es: "Desarrollo de aplicaciones web con Next.js, React y TypeScript. Optimización de renderizado y SEO con 20% de mejora en métricas de rendimiento. Integración de APIs REST y creación de interfaces interactivas para constructores de flujo no-code.",
    },
    tech: ["Next.js", "React", "TypeScript", "API Integration", "SEO"],
  },
  {
    company: "ANBIMA",
    location: "São Paulo, SP",
    role: {
      pt: "Engenheiro de Software",
      en: "Software Engineer",
      es: "Ingeniero de Software",
    },
    period: {
      pt: "Dez 2022 – Jul 2024",
      en: "Dec 2022 – Jul 2024",
      es: "Dic 2022 – Jul 2024",
    },
    desc: {
      pt: "Manutenção e evolução do SRE (Sistema de Registro de Ofertas) da CVM. Frontend com AngularJS e jQuery; backend em Java EE (VRaptor, EJB, Quartz, Liquibase). Liderei a migração de Java 8 para Java 11, que reduziu em 15% os bugs em produção, e refatorei consultas SQL Server para reduzir o tempo de resposta.",
      en: "Maintained and updated the Offer Registration System (SRE) for the CVM. Frontend in AngularJS and jQuery; backend in Java EE (VRaptor, EJB, Quartz, Liquibase). Led the migration from Java 8 to Java 11, which reduced production bugs by 15%, and refactored SQL Server queries to cut response times.",
      es: "Mantenimiento y evolución del SRE (Sistema de Registro de Ofertas) de la CVM. Frontend con AngularJS y jQuery; backend en Java EE (VRaptor, EJB, Quartz, Liquibase). Lideré la migración de Java 8 a Java 11, que redujo en 15% los bugs en producción, y refactoricé consultas SQL Server para reducir el tiempo de respuesta.",
    },
    tech: [
      "Java EE",
      "VRaptor",
      "Quartz",
      "Jacoco",
      "Liquibase",
      "EJB",
      "Angular.js",
      "jQuery",
      "HTML5",
      "CSS3",
      "JavaScript",
      "SQL Server",
    ],
  },
  {
    company: "Prevision",
    location: "Florianópolis, SC",
    role: {
      pt: "Estagiário de Desenvolvimento de Software",
      en: "Software Development Intern",
      es: "Pasante de Desenvolvimento de Software",
    },
    period: {
      pt: "Abr 2022 – Set 2022",
      en: "Apr 2022 – Sep 2022",
      es: "Abr 2022 – Sep 2022",
    },
    desc: {
      pt: "Desenvolvimento de funcionalidades para plataforma SaaS de gestão e planejamento de obras civis, atendendo mais de 200 empresas e 1.000 usuários em 2.600 canteiros. Atuação com React, Node.js e Docker no time de User Insights.",
      en: "Built features for a construction planning SaaS platform used by 200+ companies and 1,000+ users across 2,600 job sites. Worked with React, Node.js, and Docker in the User Insights team.",
      es: "Desarrollo de funciones para plataforma SaaS de planificación de obras civiles, atendiendo a más de 200 empresas y 1.000 usuarios en 2.600 obras. Trabajo com React, Node.js e Docker no time de User Insights.",
    },
    tech: ["JavaScript", "React", "Node.js", "Docker"],
  },
  {
    company: "Inova Prudente",
    location: "Presidente Prudente, SP",
    role: {
      pt: "Estagiário de Desenvolvimento de Software",
      en: "Software Development Intern",
      es: "Pasante de Desenvolvimento de Software",
    },
    period: {
      pt: "Fev 2021 – Mar 2022",
      en: "Feb 2021 – Mar 2022",
      es: "Feb 2021 – Mar 2022",
    },
    desc: {
      pt: "Construção de sistema web para controle de espaços de coworking, reservas de salas e gestão de eventos com check-in. Stack com PHP, MySQL, JavaScript e jQuery, com containerização em Docker e testes com Robot Framework.",
      en: "Created a web system for coworking space management, room booking, and event check-in. Stack: PHP, MySQL, JavaScript, and jQuery, containerized with Docker and tested using Robot Framework.",
      es: "Creación de sistema web para gestión de espaços de coworking, reserva de salas y eventos con check-in. Stack con PHP, MySQL, JavaScript y jQuery, con Docker y pruebas en Robot Framework.",
    },
    tech: ["HTML", "CSS", "JavaScript", "PHP", "jQuery", "MySQL", "Docker", "Robot Framework"],
  },
];

export const topSkills: LocalizedString[] = [
  {
    pt: "Sistemas Distribuídos",
    en: "Distributed Systems",
    es: "Sistemas Distribuidos",
  },
  {
    pt: "Engenharia de Dados",
    en: "Data Engineering",
    es: "Ingeniería de Datos",
  },
  {
    pt: "Arquitetura de Software",
    en: "Software Architecture",
    es: "Arquitectura de Software",
  },
  {
    pt: "Data Mesh & Pipelines",
    en: "Data Mesh & Pipelines",
    es: "Data Mesh & Pipelines",
  },
  {
    pt: "Microsserviços & APIs",
    en: "Microservices & APIs",
    es: "Microservicios & APIs",
  },
  {
    pt: "Infraestrutura Cloud (AWS / GCP)",
    en: "Cloud Infrastructure (AWS / GCP)",
    es: "Infraestructura Cloud (AWS / GCP)",
  },
  {
    pt: "Mensageria & EDA",
    en: "Messaging & Event-Driven",
    es: "Mensajería & Event-Driven",
  },
  {
    pt: "Machine Learning & XAI",
    en: "Machine Learning & XAI",
    es: "Machine Learning & XAI",
  },
];

/** The stack by area. `techStack` below is the same list, flattened. */
export const techGroups: TechGroup[] = [
  { id: "languages", labelKey: "skills.group.languages", items: ["Python", "Go", "Java", "TypeScript"] },
  {
    id: "backend",
    labelKey: "skills.group.backend",
    items: ["Node.js", "Spring Boot", "Quarkus", "GraphQL", "Apollo Federation", "REST"],
  },
  { id: "messaging", labelKey: "skills.group.messaging", items: ["Kafka", "RabbitMQ", "Pub/Sub"] },
  {
    id: "cloud",
    labelKey: "skills.group.cloud",
    items: ["AWS", "GCP", "Magalu Cloud", "Step Functions", "Glue", "Lambda", "KMS"],
  },
  {
    id: "data",
    labelKey: "skills.group.data",
    items: ["MongoDB", "Redis", "Elasticsearch", "MySQL", "PostgreSQL", "SQL Server", "Firestore"],
  },
  {
    id: "platform",
    labelKey: "skills.group.platform",
    items: ["Kubernetes", "Docker", "ArgoCD", "Jenkins", "SonarQube", "Bitbucket", "Git", "CI/CD"],
  },
  {
    id: "observability",
    labelKey: "skills.group.observability",
    items: ["CloudTrail", "CloudWatch", "X-Ray", "Datadog", "Grafana"],
  },
  { id: "frontend", labelKey: "skills.group.frontend", items: ["Next.js", "React", "Angular.js"] },
];

export const techStack: string[] = techGroups.flatMap((group) => group.items);

export const education: EducationItem[] = [
  {
    school: "UNESP",
    fullName: "Universidade Estadual Paulista (UNESP)",
    degreeKey: "edu.masters",
    current: true,
    period: {
      pt: "Set 2025 – Mar 2028",
      en: "Sep 2025 – Mar 2028",
      es: "Sep 2025 – Mar 2028",
    },
  },
  {
    school: "Universidade do Oeste Paulista",
    degreeKey: "edu.bachelors",
    period: {
      pt: "Fev 2019 – Jun 2023",
      en: "Feb 2019 – Jun 2023",
      es: "Feb 2019 – Jun 2023",
    },
  },
];

export const spokenLanguages: SpokenLanguage[] = [
  {
    code: "pt-BR",
    name: { pt: "Português", en: "Portuguese", es: "Portugués" },
    level: { pt: "Nativo", en: "Native", es: "Nativo" },
  },
  {
    code: "en",
    name: { pt: "Inglês", en: "English", es: "Inglés" },
    level: { pt: "Profissional", en: "Full professional", es: "Profesional" },
  },
];

export const certifications: Certification[] = [
  {
    name: "EF SET English Certificate",
    issuer: "EF SET",
    detail: {
      pt: "58/100, nível B2 (intermediário superior)",
      en: "58/100, level B2 (upper intermediate)",
      es: "58/100, nivel B2 (intermedio alto)",
    },
  },
];

/**
 * Projects, most relevant first. `featured` ones appear in the gallery and
 * need a cover sketch under the same id (src/components/covers/sketches.ts).
 */
export const projects: ProjectItem[] = [
  {
    id: "rinha-backend-2026-c",
    name: "rinha-backend-2026-c",
    stars: 1,
    featured: true,
    language: "C",
    year: 2026,
    license: "MIT",
    desc: {
      pt: "Detecção de fraude por busca vetorial para a Rinha de Backend 2026, em C11. KNN sobre 1.000.000 de vetores de referência em memória compartilhada, com SIMD ARM Neon, quantização em ponto fixo de 16 bits e 4.096 buckets espaciais. Latência mediana perto de 250 µs com 1 vCPU e 350 MB.",
      en: "Fraud detection by vector search for Rinha de Backend 2026, in C11. KNN over 1,000,000 reference vectors in shared memory, with ARM Neon SIMD, 16-bit fixed-point quantization and 4,096 spatial buckets. Median latency near 250 µs on 1 vCPU and 350 MB.",
      es: "Detección de fraude por búsqueda vectorial para la Rinha de Backend 2026, en C11. KNN sobre 1.000.000 de vectores de referencia en memoria compartida, con SIMD ARM Neon, cuantización en punto fijo de 16 bits y 4.096 buckets espaciales. Latencia mediana cercana a 250 µs con 1 vCPU y 350 MB.",
    },
    tech: ["C11", "ARM Neon SIMD", "KNN", "POSIX SHM"],
    githubUrl: "https://github.com/mateusememe/rinha-backend-2026-c",
  },
  {
    id: "megabrain-context-protocol",
    name: "megabrain-context-protocol",
    stars: 3,
    featured: true,
    language: "Python",
    year: 2026,
    license: "MIT",
    coAuthors: ["Maria Beatriz França"],
    talkId: "mcp-devfest-2026",
    desc: {
      pt: "Material do minicurso de Model Context Protocol (MCP) no DevFest 2026. Constrói o DevBrain, um servidor MCP em Python que diz a um agente de código se uma branch está pronta para virar pull request. As regras de revisão ficam no código, e o mesmo servidor roda no Claude Code, Gemini CLI, Copilot e Codex.",
      en: "Material for the Model Context Protocol (MCP) workshop at DevFest 2026. Builds DevBrain, an MCP server in Python that tells a coding agent whether a branch is ready for a pull request. Review rules live in code, and the same server runs in Claude Code, Gemini CLI, Copilot and Codex.",
      es: "Material del taller de Model Context Protocol (MCP) en DevFest 2026. Construye DevBrain, un servidor MCP en Python que indica a un agente de código si una rama está lista para un pull request. Las reglas de revisión viven en el código, y el mismo servidor funciona en Claude Code, Gemini CLI, Copilot y Codex.",
    },
    tech: ["Python", "MCP", "AI Agents", "Cloud Run"],
    githubUrl: "https://github.com/mateusememe/megabrain-context-protocol",
  },
  {
    id: "syntroph",
    name: "syntroph",
    featured: true,
    language: "Go",
    year: 2026,
    desc: {
      pt: "Toolkit e orquestrador em Go que conecta ferramentas de desenvolvimento em torno de um núcleo hexagonal. Um barramento de eventos em processo entrega a saída de um adaptador ao próximo, um saga journal append-only registra cada passo, e a memória de sessão fica local, com GitHub Issues ou Wiki como espelho.",
      en: "Go toolkit and orchestrator that connects development tools around a hexagonal core. An in-process event bus hands one adapter's output to the next, an append-only saga journal records each step, and session memory stays local, with GitHub Issues or Wiki as a mirror.",
      es: "Toolkit y orquestador en Go que conecta herramientas de desarrollo alrededor de un núcleo hexagonal. Un bus de eventos en proceso entrega la salida de un adaptador al siguiente, un saga journal append-only registra cada paso, y la memoria de sesión queda local, con GitHub Issues o Wiki como espejo.",
    },
    tech: ["Go", "Hexagonal Architecture", "Event Bus", "MCP"],
    githubUrl: "https://github.com/mateusememe/syntroph",
  },
  {
    id: "transaction-ledger",
    name: "transaction.ledger",
    featured: true,
    language: "Python",
    year: 2026,
    desc: {
      pt: "Serviço financeiro de registro de ordens em arquitetura serverless AWS. Implementa escrita condicional para idempotência, padrão outbox com CDC, circuit breakers e observabilidade via CloudWatch.",
      en: "Financial order registration service on AWS serverless. Implements conditional writes for idempotency, outbox pattern with CDC, circuit breakers, and CloudWatch observability.",
      es: "Servicio financiero de registro de órdenes en arquitectura serverless de AWS. Implementa escrituras condicionales para idempotencia, patrón outbox con CDC, circuit breakers y observabilidad en CloudWatch.",
    },
    tech: ["Python", "AWS Lambda", "DynamoDB", "SQS", "Clean Arch"],
    githubUrl: "https://github.com/mateusememe/transaction.ledger",
  },
  {
    id: "codecash",
    name: "codecash",
    stars: 4,
    featured: true,
    language: "Java",
    year: 2025,
    license: "MIT",
    talkId: "api-hero-devfest-2025",
    desc: {
      pt: "API transacional desenvolvida para o minicurso 'API Hero' no DevFest 2025. Utiliza Spring Boot, consultas em GraphQL, banco PostgreSQL e cache em Redis.",
      en: "Transactional API built for the 'API Hero' workshop at DevFest 2025. Uses Spring Boot, GraphQL queries, PostgreSQL storage, and Redis caching.",
      es: "API transaccional desarrollada para el taller 'API Hero' en DevFest 2025. Utiliza Spring Boot, consultas en GraphQL, base PostgreSQL y caché en Redis.",
    },
    tech: ["Java", "Spring Boot", "GraphQL", "PostgreSQL", "Redis"],
    githubUrl: "https://github.com/mateusememe/codecash",
  },
  {
    id: "8-puzzle",
    name: "8-puzzle",
    stars: 17,
    featured: true,
    language: "Python",
    year: 2021,
    coAuthors: ["Vinicius Santana"],
    desc: {
      pt: "Resolução do quebra-cabeça 8-puzzle utilizando busca heurística com os algoritmos A* e Best-First Search baseados na distância de Manhattan.",
      en: "8-puzzle solver using heuristic search with A* and Best-First Search algorithms based on Manhattan distance.",
      es: "Resolución del rompecabezas 8-puzzle mediante búsqueda heurística con algoritmos A* y Best-First Search basados en distancia de Manhattan.",
    },
    tech: ["Python", "A* Algorithm", "Heuristics", "BFS"],
    githubUrl: "https://github.com/mateusememe/8-puzzle",
  },
  {
    id: "fuzzymeans-ai",
    name: "fuzzymeans-ai",
    featured: true,
    language: "Python",
    year: 2026,
    license: "MIT",
    desc: {
      pt: "Imputação explicável de custos ausentes em registros de acidentes em passagens de nível (dados da FRA). Fuzzy C-Means e Noise Clustering sobre coordenadas e velocidades: cada valor imputado é uma média ponderada pelas pertinências, que pode ser auditada. Validado mascarando 30% dos valores conhecidos em 5 sementes.",
      en: "Explainable imputation of missing costs in highway-rail crossing accident records (FRA data). Fuzzy C-Means and Noise Clustering over coordinates and speeds: each imputed value is a membership-weighted mean that can be audited. Validated by masking 30% of the known values across 5 seeds.",
      es: "Imputación explicable de costos ausentes en registros de accidentes en pasos a nivel (datos de la FRA). Fuzzy C-Means y Noise Clustering sobre coordenadas y velocidades: cada valor imputado es una media ponderada por las pertenencias, que se puede auditar. Validado enmascarando 30% de los valores conocidos en 5 semillas.",
    },
    tech: ["Python", "Fuzzy C-Means", "XAI", "LaTeX"],
    githubUrl: "https://github.com/mateusememe/fuzzymeans-ai",
  },
  {
    id: "lime-stability",
    name: "lime.stability.imputation",
    featured: true,
    language: "Python",
    year: 2025,
    desc: {
      pt: "Pesquisa experimental de mestrado sobre a estabilidade do método LIME com técnicas de imputação de dados em modelos RandomForest e GradientBoosting.",
      en: "MSc experimental research on LIME stability with data imputation techniques across RandomForest and GradientBoosting models.",
      es: "Investigación experimental de maestría sobre la estabilidad del método LIME con técnicas de imputación de datos en modelos RandomForest y GradientBoosting.",
    },
    tech: ["Python", "Machine Learning", "XAI", "LIME", "Research"],
    // Private repository: no public link.
  },
  {
    id: "find-the-fight",
    name: "find-the-fight",
    featured: true,
    language: "Python",
    year: 2022,
    license: "GPL-3.0",
    desc: {
      pt: "Trabalho de conclusão de curso: detecção de brigas em vídeos de câmeras de vigilância. Um classificador lê 10 quadros com um Xception pré-treinado, passa as features por duas camadas LSTM bidirecionais e decide entre violência e não violência; uma segunda abordagem mede a distância entre os centróides das poses de cada pessoa.",
      en: "Bachelor's thesis: fight detection in surveillance camera video. A classifier reads 10 frames through a pretrained Xception, passes the features to two bidirectional LSTM layers and decides between violence and non-violence; a second approach measures the distance between the centroids of each person's pose.",
      es: "Trabajo de conclusión de carrera: detección de peleas en videos de cámaras de vigilancia. Un clasificador lee 10 cuadros con un Xception preentrenado, pasa las features por dos capas LSTM bidireccionales y decide entre violencia y no violencia; un segundo enfoque mide la distancia entre los centroides de las poses de cada persona.",
    },
    tech: ["TensorFlow", "Xception", "Bi-LSTM", "OpenVINO"],
    githubUrl: "https://github.com/mateusememe/find-the-fight",
  },
  {
    id: "git-github-in-action",
    name: "git-github-in-action",
    stars: 5,
    featured: true,
    language: "C++",
    year: 2023,
    license: "MIT",
    talkId: "git-infoeste-2023",
    desc: {
      pt: "Material e exemplos práticos do minicurso 'Git e GitHub em Ação' ministrado na 35ª Infoeste, cobrindo controle de versão e fluxos colaborativos.",
      en: "Code examples and resources for the 'Git and GitHub in Action' workshop at 35th Infoeste, covering version control and workflows.",
      es: "Ejemplos de código y recursos del taller 'Git y GitHub en Acción' en la 35ª Infoeste, cubriendo control de versiones y flujos colaborativos.",
    },
    tech: ["Git", "GitHub", "Workflows", "C++"],
    githubUrl: "https://github.com/mateusememe/git-github-in-action",
  },
  {
    id: "algorithm-forest",
    name: "AlgorithmForest",
    stars: 2,
    featured: true,
    language: "Java",
    year: 2021,
    license: "MIT",
    desc: {
      pt: "Implementação de algoritmos e estruturas de dados de árvores em Java, incluindo Árvores Binárias de Busca (BST) e balanceamento AVL.",
      en: "Implementation of tree data structures and algorithms in Java, including Binary Search Trees (BST) and AVL balancing.",
      es: "Implementación de estructuras de datos y algoritmos de árboles en Java, incluyendo Árboles Binarios de Búsqueda (BST) y balanceo AVL.",
    },
    tech: ["Java", "Data Structures", "BST", "AVL"],
    githubUrl: "https://github.com/mateusememe/AlgorithmForest",
  },
  {
    id: "zhang-suen-thinning",
    name: "zhang-suen-thinning",
    stars: 2,
    featured: true,
    language: "Python",
    year: 2021,
    license: "MIT",
    desc: {
      pt: "Implementação em Python do algoritmo morfológico de afinamento e esqueletização de Zhang-Suen para imagens binárias.",
      en: "Python implementation of the Zhang-Suen morphological thinning and skeletonization algorithm for binary images.",
      es: "Implementación en Python del algoritmo morfológico de adelgazamiento y esqueletización de Zhang-Suen para imágenes binarias.",
    },
    tech: ["Python", "Computer Vision", "Algorithms", "Image Processing"],
    githubUrl: "https://github.com/mateusememe/zhang-suen-thinning",
  },
  {
    id: "ai-autopsy-devfest-2025",
    name: "ai-autopsy-devfest-2025",
    stars: 1,
    language: "Python",
    year: 2025,
    license: "MIT",
    coAuthors: ["Maria Beatriz França"],
    talkId: "ai-autopsy-devfest-2025",
    desc: {
      pt: "Código e slides do workshop 'AI Autopsy' no DevFest 2025. Treina um classificador LightGBM no dataset do Titanic e depois explica previsões individuais e o comportamento global com LIME e SHAP.",
      en: "Code and slides for the 'AI Autopsy' workshop at DevFest 2025. Trains a LightGBM classifier on the Titanic dataset, then explains single predictions and global behavior with LIME and SHAP.",
      es: "Código y diapositivas del taller 'AI Autopsy' en DevFest 2025. Entrena un clasificador LightGBM con el dataset del Titanic y luego explica predicciones individuales y el comportamiento global con LIME y SHAP.",
    },
    tech: ["Python", "LightGBM", "LIME", "SHAP"],
    githubUrl: "https://github.com/mateusememe/ai-autopsy-devfest-2025",
  },
  {
    id: "llm-edu-cards",
    name: "llm-edu-cards",
    language: "Python",
    year: 2025,
    desc: {
      pt: "App em Streamlit que gera cards de estudo com o Meta-Llama-3-8B-Instruct: um resumo para qualquer tema e subtemas relacionados para explorar em árvore. Interface bilíngue. Feito para a disciplina de Aprendizado Profundo do mestrado da UNESP.",
      en: "Streamlit app that generates study cards with Meta-Llama-3-8B-Instruct: a summary for any topic and related subtopics to explore as a tree. Bilingual interface. Built for the Deep Learning course of the UNESP graduate program.",
      es: "App en Streamlit que genera tarjetas de estudio con Meta-Llama-3-8B-Instruct: un resumen para cualquier tema y subtemas relacionados para explorar en árbol. Interfaz bilingüe. Hecho para la asignatura de Aprendizaje Profundo de la maestría de la UNESP.",
    },
    tech: ["Python", "Streamlit", "Llama 3", "Hugging Face"],
    githubUrl: "https://github.com/mateusememe/llm-edu-cards",
  },
  {
    id: "iron-ledger",
    name: "iron.ledger",
    language: "Python",
    year: 2026,
    license: "MIT",
    desc: {
      pt: "SDK e CLI em Python que importam programas de treino para o Hevy pela API oficial. Mapeia exercícios por fuzzy matching, valida antes do envio, repete com backoff exponencial em HTTP 429 e mantém as importações idempotentes.",
      en: "Python SDK and CLI that import workout programs into Hevy through its official API. Maps exercises by fuzzy matching, validates before upload, retries with exponential backoff on HTTP 429 and keeps imports idempotent.",
      es: "SDK y CLI en Python que importan programas de entrenamiento a Hevy por su API oficial. Mapea ejercicios por fuzzy matching, valida antes del envío, reintenta con backoff exponencial en HTTP 429 y mantiene las importaciones idempotentes.",
    },
    tech: ["Python", "REST API", "CLI", "Idempotency"],
    githubUrl: "https://github.com/mateusememe/iron.ledger",
    liveUrl: "https://mateusememe.github.io/iron.ledger/",
  },
  {
    id: "search-it",
    name: "search.it",
    language: "Java",
    year: 2024,
    license: "MIT",
    desc: {
      pt: "Busca por linha de comando em arquivos de filmes, feita para o desafio técnico do time de busca do LuizaLabs. Monta um índice invertido em memória e responde consultas por termo, com limite de resultados e contagem de ocorrências. Compilado para binário nativo com GraalVM.",
      en: "Command-line search over movie files, written for the LuizaLabs search team technical challenge. Builds an in-memory inverted index and answers term queries with a result limit and match counts. Compiled to a native binary with GraalVM.",
      es: "Búsqueda por línea de comandos en archivos de películas, hecha para el desafío técnico del equipo de búsqueda de LuizaLabs. Construye un índice invertido en memoria y responde consultas por término, con límite de resultados y conteo de ocurrencias. Compilado a binario nativo con GraalVM.",
    },
    tech: ["Java 21", "GraalVM", "Inverted Index", "Maven"],
    githubUrl: "https://github.com/mateusememe/search.it",
  },
  {
    id: "kruskal-algorithm",
    name: "kruskal-algorithm",
    language: "Python",
    year: 2021,
    license: "MIT",
    desc: {
      pt: "Implementação em Python do algoritmo guloso de Kruskal para árvore geradora mínima.",
      en: "Python implementation of Kruskal's greedy algorithm for the minimum spanning tree.",
      es: "Implementación en Python del algoritmo voraz de Kruskal para el árbol generador mínimo.",
    },
    tech: ["Python", "Graphs", "Greedy"],
    githubUrl: "https://github.com/mateusememe/kruskal-algorithm",
  },
  {
    id: "whoami",
    name: "whoami",
    language: "TypeScript",
    year: 2026,
    license: "Apache-2.0",
    desc: {
      pt: "Este site. React e TypeScript, pré-renderizado no build, com uma camada three.js em que um campo de partículas muda entre seis formações, capas em canvas que executam o algoritmo de cada projeto, e llms.txt, Markdown e JSON Resume para agentes.",
      en: "This site. React and TypeScript, prerendered at build time, with a three.js layer where a particle field morphs between six formations, canvas covers that run each project's algorithm, and llms.txt, Markdown and JSON Resume for agents.",
      es: "Este sitio. React y TypeScript, prerenderizado en el build, con una capa three.js en la que un campo de partículas cambia entre seis formaciones, portadas en canvas que ejecutan el algoritmo de cada proyecto, y llms.txt, Markdown y JSON Resume para agentes.",
    },
    tech: ["TypeScript", "React", "three.js", "GLSL"],
    githubUrl: "https://github.com/mateusememe/whoami",
    liveUrl: "https://mateusememe.github.io/whoami/",
  },
];

/** Merged pull requests in public repositories owned by other people, newest first. */
export const contributions: ContributionItem[] = [
  {
    id: "go-quality-gate",
    repo: "dmux/go-quality-gate",
    url: "https://github.com/dmux/go-quality-gate/pull/32",
    merged: "2026-10",
    stars: 5,
    desc: {
      pt: "Detecção do runtime e das ferramentas que o projeto precisa, com dicas de instalação por sistema operacional. Comando `doctor` estendido, opção `tools_policy: recommend` e a tool MCP `check_environment` para agentes de IA. 25 arquivos, 1.353 linhas adicionadas.",
      en: "Detection of the runtime and tools a project needs, with install hints per operating system. Extended `doctor` command, a `tools_policy: recommend` setting and the `check_environment` MCP tool for AI agents. 25 files, 1,353 lines added.",
      es: "Detección del runtime y de las herramientas que el proyecto necesita, con sugerencias de instalación por sistema operativo. Comando `doctor` extendido, opción `tools_policy: recommend` y la tool MCP `check_environment` para agentes de IA. 25 archivos, 1.353 líneas añadidas.",
    },
    tech: ["Go", "CLI", "MCP"],
  },
  {
    id: "merkle",
    repo: "leeozaka/Merkle",
    url: "https://github.com/leeozaka/Merkle/pulls?q=is%3Apr+author%3Amateusememe+is%3Amerged",
    merged: "2026-08",
    stars: 1,
    desc: {
      pt: "Dois adaptadores de linguagem para o Protocol 1.0 do Merkle, um para Java e Spring Boot e outro para Python. Cada um roda fora do processo e faz detecção de linguagem, indexação determinística de AST e mapeamento de impacto em testes.",
      en: "Two language adapters for Merkle's Protocol 1.0, one for Java and Spring Boot and one for Python. Each runs out of process and does language detection, deterministic AST indexing and test impact mapping.",
      es: "Dos adaptadores de lenguaje para el Protocol 1.0 de Merkle, uno para Java y Spring Boot y otro para Python. Cada uno corre fuera del proceso y hace detección de lenguaje, indexación determinista de AST y mapeo de impacto en pruebas.",
    },
    tech: ["Java", "Python", "AST"],
  },
  {
    id: "rinha-de-backend-2026",
    repo: "zanfranceschi/rinha-de-backend-2026",
    url: "https://github.com/zanfranceschi/rinha-de-backend-2026/pull/7621",
    merged: "2026-05",
    stars: 785,
    desc: {
      pt: "Submissão aceita na quarta edição da Rinha de Backend: detecção de fraude com busca vetorial, limitada a 1 vCPU e 350 MB. O código é o projeto rinha-backend-2026-c.",
      en: "Submission accepted in the fourth Rinha de Backend: fraud detection with vector search, limited to 1 vCPU and 350 MB. The code is the rinha-backend-2026-c project.",
      es: "Envío aceptado en la cuarta edición de la Rinha de Backend: detección de fraude con búsqueda vectorial, limitada a 1 vCPU y 350 MB. El código es el proyecto rinha-backend-2026-c.",
    },
    tech: ["C", "Docker", "Vector Search"],
  },
];

/** Talks and workshops, newest first. Material is public unless a link is missing. */
export const talks: TalkItem[] = [
  {
    id: "mcp-devfest-2026",
    title: "MCP: MegaBrain Context Protocol",
    kind: "workshop",
    event: { pt: "DevFest Presidente Prudente 2026", en: "DevFest Presidente Prudente 2026", es: "DevFest Presidente Prudente 2026" },
    organizer: "GDG Presidente Prudente",
    city: "Presidente Prudente, SP",
    date: "2026-10",
    coSpeakers: ["Maria Beatriz França"],
    projectId: "megabrain-context-protocol",
    desc: {
      pt: "Minicurso prático de Model Context Protocol. A turma constrói o DevBrain, um servidor MCP em Python que diz a um agente de código se uma branch está pronta para virar pull request, e o conecta a um host real.",
      en: "Hands-on course on the Model Context Protocol. Attendees build DevBrain, an MCP server in Python that tells a coding agent whether a branch is ready for a pull request, and connect it to a real host.",
      es: "Taller práctico de Model Context Protocol. El grupo construye DevBrain, un servidor MCP en Python que le dice a un agente de código si una rama está lista para un pull request, y lo conecta a un host real.",
    },
    links: {
      repo: "https://github.com/mateusememe/megabrain-context-protocol",
      slides: "https://github.com/mateusememe/megabrain-context-protocol/tree/main/apresentacao",
    },
    tech: ["MCP", "Python", "AI Agents"],
  },
  {
    id: "web-infoeste-2025",
    title: "O Incrível mundo mágico da web",
    kind: "workshop",
    event: {
      pt: "37ª Infoeste · DevFest Presidente Prudente 2025",
      en: "37th Infoeste · DevFest Presidente Prudente 2025",
      es: "37ª Infoeste · DevFest Presidente Prudente 2025",
    },
    organizer: "Unoeste",
    city: "Presidente Prudente, SP",
    date: "2025-10-31",
    coSpeakers: ["Leonardo Aniceto das Neves"],
    desc: {
      pt: "Como a web funciona, do clique ao servidor: protocolos (TCP e UDP), APIs e webhooks, frontend e backend, SPA e SSR, monólito e microsserviços, e o caminho para o desenvolvimento full-stack. Sem pré-requisito de programação.",
      en: "How the web works, from a click to the server: protocols (TCP and UDP), APIs and webhooks, frontend and backend, SPA and SSR, monolith and microservices, and the path to full-stack development. No programming background required.",
      es: "Cómo funciona la web, del clic al servidor: protocolos (TCP y UDP), APIs y webhooks, frontend y backend, SPA y SSR, monolito y microservicios, y el camino hacia el desarrollo full-stack. Sin requisitos de programación.",
    },
    links: {
      event: "https://www.unoeste.br/site/controleeventos/VerAtividade.aspx?eve_codigo=1755&atv_codigo=9367",
    },
    tech: ["HTTP", "TCP/UDP", "APIs", "Microservices"],
  },
  {
    id: "ai-autopsy-devfest-2025",
    title: "AI Autopsy",
    kind: "workshop",
    event: { pt: "DevFest Presidente Prudente 2025", en: "DevFest Presidente Prudente 2025", es: "DevFest Presidente Prudente 2025" },
    organizer: "GDG Presidente Prudente",
    city: "Presidente Prudente, SP",
    date: "2025-10",
    coSpeakers: ["Maria Beatriz França"],
    projectId: "ai-autopsy-devfest-2025",
    desc: {
      pt: "Como depurar as decisões de um modelo: treinar um classificador LightGBM no dataset do Titanic e explicar previsões individuais com LIME e o comportamento global com SHAP.",
      en: "How to debug a model's decisions: train a LightGBM classifier on the Titanic dataset, then explain single predictions with LIME and global behaviour with SHAP.",
      es: "Cómo depurar las decisiones de un modelo: entrenar un clasificador LightGBM con el dataset del Titanic y explicar predicciones individuales con LIME y el comportamiento global con SHAP.",
    },
    links: {
      repo: "https://github.com/mateusememe/ai-autopsy-devfest-2025",
      slides: "https://github.com/mateusememe/ai-autopsy-devfest-2025/blob/main/slides/presentation-ai-autopsy.pdf",
      notebook:
        "https://colab.research.google.com/github/mateusememe/ai-autopsy-devfest-2025/blob/main/ai_autopsy_xai_titanic.ipynb",
    },
    tech: ["Python", "LightGBM", "LIME", "SHAP"],
  },
  {
    id: "api-hero-devfest-2025",
    title: "API Hero",
    kind: "workshop",
    event: { pt: "DevFest Presidente Prudente 2025", en: "DevFest Presidente Prudente 2025", es: "DevFest Presidente Prudente 2025" },
    organizer: "GDG Presidente Prudente",
    city: "Presidente Prudente, SP",
    date: "2025-10",
    projectId: "codecash",
    desc: {
      pt: "Construção de uma API transacional com Spring Boot e GraphQL, PostgreSQL para armazenamento e Redis como cache.",
      en: "Building a transactional API with Spring Boot and GraphQL, PostgreSQL for storage and Redis as a cache.",
      es: "Construcción de una API transaccional con Spring Boot y GraphQL, PostgreSQL para el almacenamiento y Redis como caché.",
    },
    links: {
      repo: "https://github.com/mateusememe/codecash",
      slides: "https://github.com/mateusememe/codecash/blob/main/DevFest2025-ApiHero-GDG-Viceri.pdf",
    },
    tech: ["Java", "Spring Boot", "GraphQL", "Redis"],
  },
  {
    id: "time-series-infoeste-2024",
    title: "Do Caos à Previsão: Domando Estruturas Temporais com Machine Learning",
    kind: "workshop",
    event: {
      pt: "36ª Infoeste · DevFest Presidente Prudente 2024",
      en: "36th Infoeste · DevFest Presidente Prudente 2024",
      es: "36ª Infoeste · DevFest Presidente Prudente 2024",
    },
    organizer: "Unoeste",
    city: "Presidente Prudente, SP",
    date: "2024-10-31",
    coSpeakers: ["Maria Beatriz França"],
    desc: {
      pt: "Introdução prática a machine learning para séries temporais: preparar dados de ações (limpeza, valores ausentes, normalização), construir e treinar uma rede LSTM com TensorFlow e Keras, comparar com ARIMA e regressão e avaliar as previsões contra os valores reais.",
      en: "Hands-on introduction to machine learning for time series: prepare stock data (cleaning, missing values, normalization), build and train an LSTM network with TensorFlow and Keras, compare it with ARIMA and regression, and check the forecasts against the real values.",
      es: "Introducción práctica a machine learning para series temporales: preparar datos de acciones (limpieza, valores faltantes, normalización), construir y entrenar una red LSTM con TensorFlow y Keras, compararla con ARIMA y regresión, y evaluar las predicciones frente a los valores reales.",
    },
    links: {
      event: "https://www.unoeste.br/site/controleeventos/VerAtividade.aspx?eve_codigo=1351&atv_codigo=8067",
    },
    tech: ["Python", "TensorFlow", "Keras", "LSTM"],
  },
  {
    id: "git-infoeste-2023",
    title: "Git e GitHub em Ação",
    kind: "workshop",
    event: { pt: "35ª Infoeste", en: "35th Infoeste", es: "35ª Infoeste" },
    organizer: "Unoeste",
    city: "Presidente Prudente, SP",
    date: "2023",
    projectId: "git-github-in-action",
    desc: {
      pt: "Controle de versão com Git e desenvolvimento colaborativo no GitHub, com exercícios sobre um programa em C.",
      en: "Version control with Git and collaborative development on GitHub, with exercises on a C program.",
      es: "Control de versiones con Git y desarrollo colaborativo en GitHub, con ejercicios sobre un programa en C.",
    },
    links: {
      repo: "https://github.com/mateusememe/git-github-in-action",
      slides: "https://github.com/mateusememe/git-github-in-action/blob/master/git-and-github-in-action-day-one.pdf",
    },
    tech: ["Git", "GitHub"],
  },
  {
    id: "git-infoeste-2022",
    title: "O Essencial de GIT e GitHub",
    kind: "workshop",
    event: { pt: "34ª Infoeste", en: "34th Infoeste", es: "34ª Infoeste" },
    organizer: "Unoeste",
    city: "Presidente Prudente, SP",
    online: true,
    date: "2022-10-28",
    coSpeakers: ["José Paulo Lobo Saturnino"],
    desc: {
      pt: "Controle de versão do zero: commits, branches, merge e rebase no Git, repositório remoto no GitHub e casos reais como restaurar uma versão antiga, abrir uma issue e enviar um pull request para um projeto open source.",
      en: "Version control from scratch: commits, branches, merge and rebase in Git, a remote repository on GitHub, and real cases such as restoring an old version, opening an issue and sending a pull request to an open-source project.",
      es: "Control de versiones desde cero: commits, branches, merge y rebase en Git, un repositorio remoto en GitHub y casos reales como restaurar una versión antigua, abrir un issue y enviar un pull request a un proyecto open source.",
    },
    links: {
      event: "https://www.unoeste.br/site/controleeventos/VerAtividade.aspx?eve_codigo=886&atv_codigo=5140",
    },
    tech: ["Git", "GitHub"],
  },
  {
    id: "react-infoeste-2022",
    title: "Intensivo ReactJS e Typescript",
    kind: "workshop",
    event: { pt: "34ª Infoeste", en: "34th Infoeste", es: "34ª Infoeste" },
    organizer: "Unoeste",
    city: "Presidente Prudente, SP",
    date: "2022-10-27",
    coSpeakers: ["José Paulo Lobo Saturnino", "Irineu de Almeida Júnior"],
    desc: {
      pt: "Um dia inteiro (8 horas) de React com TypeScript: configuração do ambiente, componentes e estado, Context API, ciclo de vida, rotas, hooks nativos e customizados, consumo de API e deploy da aplicação pronta em uma hospedagem online.",
      en: "A full day (8 hours) of React with TypeScript: environment setup, components and state, the Context API, lifecycle, routing, built-in and custom hooks, API data, and deploying the finished app to online hosting.",
      es: "Un día completo (8 horas) de React con TypeScript: configuración del entorno, componentes y estado, Context API, ciclo de vida, rutas, hooks nativos y personalizados, consumo de API y deploy de la aplicación terminada en un hosting online.",
    },
    links: {
      event: "https://www.unoeste.br/site/controleeventos/VerAtividade.aspx?eve_codigo=886&atv_codigo=5148",
    },
    tech: ["React", "TypeScript", "Hooks", "Context API"],
  },
  {
    id: "node-infoeste-2022",
    title: "Node.JS com testes unitários e PrismaORM",
    kind: "workshop",
    event: { pt: "34ª Infoeste", en: "34th Infoeste", es: "34ª Infoeste" },
    organizer: "Unoeste",
    city: "Presidente Prudente, SP",
    date: "2022-10-24",
    coSpeakers: ["Jose Antônio Junior Barros Souza", "Igor Xavier"],
    desc: {
      pt: "Uma API REST com CRUD em Node.js e Express, PostgreSQL pelo Prisma ORM e testes unitários com Jest, partindo de HTTP, REST e TDD. Um dia inteiro (8 horas).",
      en: "A CRUD REST API in Node.js and Express, PostgreSQL through Prisma ORM, and unit tests with Jest, starting from HTTP, REST and TDD. A full day (8 hours).",
      es: "Una API REST con CRUD en Node.js y Express, PostgreSQL con Prisma ORM y pruebas unitarias con Jest, partiendo de HTTP, REST y TDD. Un día completo (8 horas).",
    },
    links: {
      event: "https://www.unoeste.br/site/controleeventos/VerAtividade.aspx?eve_codigo=886&atv_codigo=5137",
    },
    tech: ["Node.js", "Express", "Prisma", "Jest"],
  },
];

/** Authors joined as in an ABNT reference, ending with a single period. */
export function publicationAuthors(item: Publication): string {
  const names = item.authors.join("; ");
  return names.endsWith(".") ? names : `${names}.`;
}

const ABNT_MONTHS = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

/**
 * ABNT (NBR 6023) reference for a publication in event proceedings, in
 * Portuguese like the publication itself. `main` ends before the URL, so a
 * page can render the address as a link.
 */
export function publicationReference(item: Publication): { main: string; url?: string; accessed?: string; full: string } {
  const city = item.city.split(",")[0];
  const section = item.section ? `: ${item.section}` : "";
  const pages = item.pages ? ` p. ${item.pages}.` : "";
  const main = `${publicationAuthors(item)} ${item.title}. In: ${item.venue}, ${item.year}, ${city}. Anais [...]${section}. ${city}: ${item.publisher}, ${item.year}.${pages}`;
  const accessed = item.accessed
    ? (([y, m, d]) => `${Number(d)} ${ABNT_MONTHS[Number(m) - 1]} ${y}`)(item.accessed.split("-"))
    : undefined;
  const online = item.url ? ` Disponível em: ${item.url}.${accessed ? ` Acesso em: ${accessed}.` : ""}` : "";
  return { main, url: item.url, accessed, full: `${main}${online}` };
}

/** Papers and abstracts, newest first. */
export const publications: Publication[] = [
  {
    id: "enepe-2022-fight-detection",
    kind: "abstract",
    title: "Detecção de agressão física humana em vídeos de vigilância utilizando deep learning",
    // Order as printed on p. 8 of the proceedings.
    authors: ["MONTEIRO, M. M.", "PAZOTI, M. A.", "SILVA, F. A.", "ALMEIDA, L. L."],
    venue: "ENEPE — Encontro Nacional de Ensino, Pesquisa e Extensão",
    section: "Ciências Exatas e da Terra, Ciência da Computação",
    publisher: "Universidade do Oeste Paulista",
    city: "Presidente Prudente, SP",
    year: 2022,
    pages: "8",
    summary: {
      pt: "Resumo do trabalho de conclusão de curso, apresentado em comunicação oral: Xception com Bi-LSTM sobre a Surveillance Camera Fight Dataset (300 vídeos, 70% para treino e 30% para teste), com 63% de acurácia no resultado preliminar.",
      en: "Abstract of the bachelor's thesis, presented orally: Xception with Bi-LSTM on the Surveillance Camera Fight Dataset (300 videos, 70% for training and 30% for testing), with 63% accuracy in the preliminary result.",
      es: "Resumen del trabajo de conclusión de carrera, presentado en comunicación oral: Xception con Bi-LSTM sobre el Surveillance Camera Fight Dataset (300 videos, 70% para entrenamiento y 30% para prueba), con 63% de exactitud en el resultado preliminar.",
    },
    projectId: "find-the-fight",
    url: "https://www.unoeste.br/Areas/Eventos/Content/documentos/EventosAnais/805/Exatas/Computa%c3%a7%c3%a3o.pdf?v=1",
    accessed: "2026-11-16",
  },
];

/** The link that best represents a talk: the slides, else the code, else the event page. */
export function talkUrl(talk: TalkItem): string | undefined {
  return talk.links.slides ?? talk.links.repo ?? talk.links.event;
}

/** Facts derived from the lists above, so headline numbers never go stale. */
export const portfolioStats = (() => {
  const years = experiences.flatMap((exp) => (exp.period.en.match(/\d{4}/g) ?? []).map(Number));
  return {
    roles: experiences.length,
    companies: new Set(experiences.map((exp) => exp.company)).size,
    firstYear: Math.min(...years),
    lastYear: Math.max(...years),
    repos: projects.length,
    featured: projects.filter((project) => project.featured).length,
    stars: projects.reduce((total, project) => total + (project.stars ?? 0), 0),
    contributions: contributions.length,
    talks: talks.length,
    publications: publications.length,
  };
})();
