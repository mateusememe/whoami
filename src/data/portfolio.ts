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
  role: LocalizedString;
  period: LocalizedString;
  desc: LocalizedString;
  tech: string[];
}

export interface EducationItem {
  school: string;
  degreeKey: string;
  period: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  desc: LocalizedString;
  stars?: number;
  tech?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

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
      pt: "Desenvolvimento de ferramentas para migração de dados entre contas AWS e plataformas de dados de clientes (CDP). Criação de microsserviços em Python e Go usando arquitetura orientada a eventos e Data Mesh. Construção de pipelines ETL com AWS Step Functions, Glue e Lambda, com monitoramento via CloudWatch, X-Ray, Datadog e Grafana.",
      en: "Built tools for data migration between AWS accounts and Customer Data Platforms (CDP). Wrote microservices in Python and Go using event-driven architecture and Data Mesh. Built ETL pipelines with AWS Step Functions, Glue, and Lambda, monitored via CloudWatch, X-Ray, Datadog, and Grafana.",
      es: "Desarrollo de herramientas para migración de datos entre cuentas AWS y plataformas de dados de clientes (CDP). Creación de microservicios en Python e Go usando arquitectura orientada a eventos y Data Mesh. Construcción de pipelines ETL con AWS Step Functions, Glue y Lambda, monitoreados con CloudWatch, X-Ray, Datadog y Grafana.",
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
      pt: "Atuação no motor de busca e em microsserviços com alto volume de acessos. Stack com Java (Spring Boot, Quarkus), Node.js (Fastify) e TypeScript, integrando com MongoDB, Redis e Elasticsearch. Desenvolvimento de APIs GraphQL (Apollo Federation) e REST, mensageria com RabbitMQ e Google Pub/Sub, e deploy em Kubernetes e GCP via ArgoCD.",
      en: "Worked on search engines and high-throughput microservices. Stack: Java (Spring Boot, Quarkus), Node.js (Fastify), and TypeScript, backed by MongoDB, Redis, and Elasticsearch. Built GraphQL (Apollo Federation) and REST APIs, async messaging with RabbitMQ and Pub/Sub, deployed to Kubernetes and GCP via ArgoCD.",
      es: "Trabajo en el motor de búsqueda y en microservicios de alto tráfico. Stack con Java (Spring Boot, Quarkus), Node.js (Fastify) y TypeScript, integrando con MongoDB, Redis y Elasticsearch. Desarrollo de APIs GraphQL (Apollo Federation) y REST, mensajería con RabbitMQ y Pub/Sub, y despliegues en Kubernetes y GCP vía ArgoCD.",
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
      pt: "Desenvolvimento e sustentação de microsserviços Java com Spring e Quarkus rodando em Kubernetes. Otimização de tempo de inicialização e consumo de memória em 10%. Construção de APIs REST, autenticação com Spring Security e JWT, bancos MySQL e MongoDB, e automação de CI/CD com Docker, Jenkins, SonarQube e Bitbucket.",
      en: "Maintained and deployed Java microservices with Spring and Quarkus on Kubernetes. Lowered startup time and memory use by 10%. Built REST APIs, authentication with Spring Security and JWT, MySQL and MongoDB storage, with CI/CD on Docker, Jenkins, SonarQube, and Bitbucket.",
      es: "Desarrollo y mantenimiento de microservicios Java con Spring y Quarkus en Kubernetes. Optimización de tiempo de inicio y memoria en 10%. Construcción de APIs REST, autenticación con Spring Security y JWT, bases MySQL y MongoDB, y automatización de CI/CD con Docker, Jenkins, SonarQube y Bitbucket.",
    },
    tech: [
      "Java",
      "Spring",
      "Quarkus",
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
      pt: "Manutenção e evolução do SRO (Sistema de Registro de Ofertas) integrado à CVM. Frontend com AngularJS e jQuery; backend em Java EE (VRaptor, EJB, Quartz, Liquibase). Migração do sistema de Java 8 para Java 11 e administração de banco SQL Server.",
      en: "Maintained and updated the Offer Registration System (SRO) for the CVM. Frontend in AngularJS and jQuery; backend in Java EE (VRaptor, EJB, Quartz, Liquibase). Migrated the codebase from Java 8 to Java 11 and managed the SQL Server database.",
      es: "Mantenimiento y evolución del SRO (Sistema de Registro de Ofertas) para la CVM. Frontend con AngularJS y jQuery; backend en Java EE (VRaptor, EJB, Quartz, Liquibase). Migración del código de Java 8 a Java 11 y administración de base de datos SQL Server.",
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

export const techStack: string[] = [
  "Python",
  "Go",
  "Java",
  "TypeScript",
  "Node.js",
  "Spring Boot",
  "Quarkus",
  "Kubernetes",
  "Docker",
  "Kafka",
  "RabbitMQ",
  "Pub/Sub",
  "AWS",
  "GCP",
  "Magalu Cloud",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "MySQL",
  "PostgreSQL",
  "SQL Server",
  "Firestore",
  "GraphQL",
  "Apollo Federation",
  "REST",
  "Next.js",
  "React",
  "Angular.js",
  "Step Functions",
  "Glue",
  "Lambda",
  "KMS",
  "CloudTrail",
  "CloudWatch",
  "X-Ray",
  "Datadog",
  "Grafana",
  "ArgoCD",
  "Jenkins",
  "SonarQube",
  "Bitbucket",
  "Git",
  "CI/CD",
];

export const education: EducationItem[] = [
  {
    school: "UNESP",
    degreeKey: "edu.masters",
    period: "Set 2025 – Mar 2028",
  },
  {
    school: "Universidade do Oeste Paulista",
    degreeKey: "edu.bachelors",
    period: "Fev 2019 – Jun 2023",
  },
];

export const projects: ProjectItem[] = [
  {
    id: "8-puzzle",
    name: "8-puzzle",
    stars: 17,
    desc: {
      pt: "Resolução do quebra-cabeça 8-puzzle utilizando busca heurística com os algoritmos A* e Best-First Search baseados na distância de Manhattan.",
      en: "8-puzzle solver using heuristic search with A* and Best-First Search algorithms based on Manhattan distance.",
      es: "Resolución del rompecabezas 8-puzzle mediante búsqueda heurística con algoritmos A* y Best-First Search basados en distancia de Manhattan.",
    },
    tech: ["Python", "A* Algorithm", "Heuristics", "BFS"],
    githubUrl: "https://github.com/mateusememe/8-puzzle",
  },
  {
    id: "git-github-in-action",
    name: "git-github-in-action",
    stars: 5,
    desc: {
      pt: "Material e exemplos práticos do minicurso 'Git e GitHub em Ação' ministrado na 35ª Infoeste, cobrindo controle de versão e fluxos colaborativos.",
      en: "Code examples and resources for the 'Git and GitHub in Action' workshop at 35th Infoeste, covering version control and workflows.",
      es: "Ejemplos de código y recursos del taller 'Git y GitHub en Acción' en la 35ª Infoeste, cubriendo control de versiones y flujos colaborativos.",
    },
    tech: ["Git", "GitHub", "Workflows", "C++"],
    githubUrl: "https://github.com/mateusememe/git-github-in-action",
  },
  {
    id: "codecash",
    name: "codecash",
    stars: 4,
    desc: {
      pt: "API transacional desenvolvida para o minicurso 'API Hero' no DevFest 2025. Utiliza Spring Boot, consultas em GraphQL, banco PostgreSQL e cache em Redis.",
      en: "Transactional API built for the 'API Hero' workshop at DevFest 2025. Uses Spring Boot, GraphQL queries, PostgreSQL storage, and Redis caching.",
      es: "API transaccional desarrollada para el taller 'API Hero' en DevFest 2025. Utiliza Spring Boot, consultas en GraphQL, base PostgreSQL y caché en Redis.",
    },
    tech: ["Java", "Spring Boot", "GraphQL", "PostgreSQL", "Redis"],
    githubUrl: "https://github.com/mateusememe/codecash",
  },
  {
    id: "matarazzoProject",
    name: "matarazzoProject",
    stars: 4,
    desc: {
      pt: "Plataforma web para gestão e agendamento de espaços culturais com interface interativa e serviços backend em JavaScript e Node.js.",
      en: "Web platform for cultural space management and booking, with interactive frontend and backend services in JavaScript and Node.js.",
      es: "Plataforma web para gestión y reserva de espacios culturales, con frontend interactivo y servicios backend en JavaScript y Node.js.",
    },
    tech: ["JavaScript", "Node.js", "Express", "Full Stack"],
    githubUrl: "https://github.com/mateusememe/matarazzoProject",
  },
  {
    id: "algorithm-forest",
    name: "AlgorithmForest",
    stars: 2,
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
    desc: {
      pt: "Implementação em Python do algoritmo morfológico de esqueletização e afinamento de imagens binárias de Zhang-Suen.",
      en: "Python implementation of the Zhang-Suen morphological thinning and skeletonization algorithm for binary images.",
      es: "Implementación en Python del algoritmo morfológico de esqueletización y afinamiento de imágenes binarias de Zhang-Suen.",
    },
    tech: ["Python", "Computer Vision", "Algorithms", "Image Processing"],
    githubUrl: "https://github.com/mateusememe/zhang-suen-thinning",
  },
  {
    id: "transaction-ledger",
    name: "transaction.ledger",
    desc: {
      pt: "Serviço financeiro de registro de ordens em arquitetura serverless AWS. Implementa escrita condicional para idempotência, padrão outbox com CDC, circuit breakers e observabilidade via CloudWatch.",
      en: "Financial order registration service on AWS serverless. Implements conditional writes for idempotency, outbox pattern with CDC, circuit breakers, and CloudWatch observability.",
      es: "Servicio financiero de registro de órdenes en arquitectura serverless de AWS. Implementa escrituras condicionales para idempotencia, patrón outbox con CDC, circuit breakers y observabilidad en CloudWatch.",
    },
    tech: ["Python", "AWS Lambda", "DynamoDB", "SQS", "Clean Arch"],
    githubUrl: "https://github.com/mateusememe/transaction.ledger",
  },
  {
    id: "lime-stability",
    name: "lime.stability.imputation",
    desc: {
      pt: "Pesquisa experimental de mestrado sobre a estabilidade do método LIME com técnicas de imputação de dados em modelos RandomForest e GradientBoosting.",
      en: "MSc experimental research on LIME stability with data imputation techniques across RandomForest and GradientBoosting models.",
      es: "Investigación experimental de maestría sobre la estabilidad del método LIME con técnicas de imputación de dados en modelos RandomForest e GradientBoosting.",
    },
    tech: ["Python", "Machine Learning", "XAI", "LIME", "Research"],
    githubUrl: "https://github.com/mateusememe/lime.stability.imputation",
  },
];
