export interface SocialLink {
  iconName: "Instagram" | "X" | "Discord" | "Linkedin" | "Mail" | "Github";
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
  githubUrl?: string;
  liveUrl?: string;
}

export const socialLinks: SocialLink[] = [
  {
    iconName: "Instagram",
    href: "https://instagram.com/mateusememe",
    label: "Instagram",
    displayText: "@mateusememe",
  },
  {
    iconName: "X",
    href: "https://x.com/mateusememe",
    label: "X (Twitter)",
    displayText: "@mateusememe",
  },
  {
    iconName: "Discord",
    href: "https://discord.com/users/mateusememe",
    label: "Discord",
    displayText: "@mateusememe",
  },
  {
    iconName: "Linkedin",
    href: "https://linkedin.com/in/mateus-men",
    label: "LinkedIn",
    displayText: "mateus-men",
  },
  {
    iconName: "Mail",
    href: "mailto:matt.mendon@gmail.com",
    label: "Email",
    displayText: "matt.mendon@gmail.com",
  },
  {
    iconName: "Github",
    href: "https://github.com/mateusememe",
    label: "GitHub",
    displayText: "mateusememe",
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
      pt: "Construo ferramentas que simplificam migrações de dados entre contas AWS e Customer Data Platforms. Projeto produtos internos usando Data Mesh e arquitetura orientada a eventos, com microserviços serverless em Python e Go. Monto pipelines de integração e ETL com Step Functions, Glue e Lambda. Monitoramento via CloudWatch, X-Ray, Datadog e Grafana; criptografia e auditoria com KMS e CloudTrail.",
      en: "I build tools that simplify data migrations across multi-account AWS environments and Customer Data Platforms. I design internal products using Data Mesh and event-driven architecture, with serverless microservices in Python and Go. I wire up integration and ETL pipelines with Step Functions, Glue, and Lambda. Monitoring runs on CloudWatch, X-Ray, Datadog, and Grafana; encryption and audit through KMS and CloudTrail.",
      es: "Construyo herramientas que simplifican migraciones de datos entre cuentas AWS y Customer Data Platforms. Diseño productos internos usando Data Mesh y arquitectura orientada a eventos, con microservicios serverless en Python y Go. Armo pipelines de integración y ETL con Step Functions, Glue y Lambda. Monitoreo vía CloudWatch, X-Ray, Datadog y Grafana; cifrado y auditoría con KMS y CloudTrail.",
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
      pt: "Trabalhei no motor de busca e em microserviços que servem milhões de requisições por dia. Stack: Java (Spring Boot, Quarkus), Node.js com Fastify, TypeScript, MongoDB, Redis, Elasticsearch. APIs GraphQL com Apollo Federation e REST. Mensageria assíncrona com RabbitMQ e Google Pub/Sub. Observabilidade com Datadog e Grafana. Infraestrutura rodando em GCP, MagaluCloud, Kubernetes e ArgoCD.",
      en: "I worked on the search engine and on microservices handling millions of daily requests. Stack: Java (Spring Boot, Quarkus), Node.js with Fastify, TypeScript, MongoDB, Redis, Elasticsearch. GraphQL APIs via Apollo Federation and REST. Async messaging with RabbitMQ and Google Pub/Sub. Observability through Datadog and Grafana. Infrastructure on GCP, MagaluCloud, Kubernetes, and ArgoCD.",
      es: "Trabajé en el motor de búsqueda y en microservicios que procesan millones de solicitudes diarias. Stack: Java (Spring Boot, Quarkus), Node.js con Fastify, TypeScript, MongoDB, Redis, Elasticsearch. APIs GraphQL con Apollo Federation y REST. Mensajería asíncrona con RabbitMQ y Google Pub/Sub. Observabilidad con Datadog y Grafana. Infraestructura en GCP, MagaluCloud, Kubernetes y ArgoCD.",
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
      pt: "Mantive e desenvolvi microserviços Java com Spring e Quarkus no Kubernetes. Reduzi tempo de startup, latência e consumo de memória em 10%. Projetei APIs REST para comunicação entre serviços, gerenciei bancos MySQL e trabalhei com MongoDB e Firestore. Segurança com Spring Security e JWT. Pipelines de CI/CD com Docker, Jenkins, SonarQube e Bitbucket. Time de 12 pessoas; melhoramos a velocidade de entrega em 20%.",
      en: "I maintained and built Java microservices with Spring and Quarkus on Kubernetes. Cut startup time, latency, and memory usage by 10%. I designed REST APIs for inter-service communication, managed MySQL databases, and worked with MongoDB and Firestore. Security via Spring Security and JWT. CI/CD pipelines with Docker, Jenkins, SonarQube, and Bitbucket. Team of 12; we improved delivery speed by 20%.",
      es: "Mantuve y desarrollé microservicios Java con Spring y Quarkus en Kubernetes. Reduje tiempo de arranque, latencia y consumo de memoria en un 10%. Diseñé APIs REST para comunicación entre servicios, administré bases MySQL y trabajé con MongoDB y Firestore. Seguridad con Spring Security y JWT. Pipelines de CI/CD con Docker, Jenkins, SonarQube y Bitbucket. Equipo de 12 personas; mejoramos la velocidad de entrega en un 20%.",
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
      pt: "Desenvolvi e mantive aplicações web com Next.js. Performance e SEO melhoraram 20%. Criei interfaces dinâmicas com React, responsivas em diferentes dispositivos. Integrei APIs para exibição de conteúdo em tempo real. Resolvi um problema de UI criando uma interface no-code com pontos e ligaduras que os usuários aprovaram por completo.",
      en: "I built and maintained web applications with Next.js. Performance and SEO improved by 20%. I created dynamic React interfaces, responsive across devices. I integrated APIs for real-time content display. I solved a UI problem by building a no-code interface with dots and ties that users approved without reservations.",
      es: "Desarrollé y mantuve aplicaciones web con Next.js. Rendimiento y SEO mejoraron un 20%. Creé interfaces dinámicas con React, responsivas en distintos dispositivos. Integré APIs para mostrar contenido en tiempo real. Resolví un problema de UI creando una interfaz no-code con puntos y ligaduras que los usuarios aprobaron sin objeciones.",
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
      pt: "Atuei no time de suporte do SRO (Sistema de Registro de Ofertas) para a CVM. Frontend com Angular.js, jQuery, HTML5, CSS3 e JavaScript; backend com Java EE, VRaptor, Quartz, Jacoco, Liquibase, EJB e APIs Javax. Liderei a migração do sistema de Java 8 para Java 11, com refactoring cuidadoso do código legado. Gerenciei o banco SQL Server, garantindo queries eficientes e integridade dos dados.",
      en: "I worked on the SRO (Offer Registration System) support team for the CVM. Frontend: Angular.js, jQuery, HTML5, CSS3, JavaScript. Backend: Java EE, VRaptor, Quartz, Jacoco, Liquibase, EJB, Javax APIs. I led the migration from Java 8 to Java 11, refactoring legacy code throughout. I managed the SQL Server database, keeping queries efficient and data consistent.",
      es: "Trabajé en el equipo de soporte del SRO (Sistema de Registro de Ofertas) para la CVM. Frontend: Angular.js, jQuery, HTML5, CSS3, JavaScript. Backend: Java EE, VRaptor, Quartz, Jacoco, Liquibase, EJB, APIs Javax. Lideré la migración del sistema de Java 8 a Java 11, refactorizando código legado a fondo. Administré la base SQL Server, manteniendo queries eficientes y datos consistentes.",
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
      es: "Pasante de Desarrollo de Software",
    },
    period: {
      pt: "Abr 2022 – Set 2022",
      en: "Apr 2022 – Sep 2022",
      es: "Abr 2022 – Sep 2022",
    },
    desc: {
      pt: "Desenvolvi funcionalidades para uma plataforma de planejamento e monitoramento de obras. O software roda em mais de 200 empresas e serve mais de 1.000 usuários, gerenciando mais de 2.600 canteiros. Trabalhei no time de User Insights. Deploy com Docker.",
      en: "I built features for a construction planning and monitoring platform. The software runs in 200+ companies, serves 1,000+ users, and manages 2,600+ job sites. I worked on the User Insights team. Deployments ran on Docker.",
      es: "Desarrollé funcionalidades para una plataforma de planificación y monitoreo de obras. El software corre en más de 200 empresas, sirve a más de 1.000 usuarios y administra más de 2.600 obras. Trabajé en el equipo de User Insights. Deploy con Docker.",
    },
    tech: ["JavaScript", "React", "Node.js", "Docker"],
  },
  {
    company: "Inova Prudente",
    role: {
      pt: "Estagiário de Desenvolvimento de Software",
      en: "Software Development Intern",
      es: "Pasante de Desarrollo de Software",
    },
    period: {
      pt: "Fev 2021 – Mar 2022",
      en: "Feb 2021 – Mar 2022",
      es: "Feb 2021 – Mar 2022",
    },
    desc: {
      pt: "Criei uma aplicação web para gestão de espaços de co-working, eventos e agendas, com check-in e check-out. Stack: HTML, CSS, JavaScript, PHP, jQuery, MySQL. Colaborei no design e manutenção do banco de dados. Deploy via Docker, testes automatizados com Robot Framework.",
      en: "I built a web app for managing co-working spaces, events, and schedules, with check-in and check-out. Stack: HTML, CSS, JavaScript, PHP, jQuery, MySQL. I collaborated on database design and maintenance. Deployments via Docker, automated tests with Robot Framework.",
      es: "Creé una aplicación web para gestión de espacios de co-working, eventos y agendas, con check-in y check-out. Stack: HTML, CSS, JavaScript, PHP, jQuery, MySQL. Colaboré en el diseño y mantenimiento de la base de datos. Deploy vía Docker, pruebas automatizadas con Robot Framework.",
    },
    tech: ["HTML", "CSS", "JavaScript", "PHP", "jQuery", "MySQL", "Docker", "Robot Framework"],
  },
];

export const topSkills: string[] = [
  "Engenharia de dados",
  "Design de software",
  "Data Mesh",
  "Backend",
  "Scalable Systems",
  "Research",
  "AI",
  "Machine Learning",
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
    id: "project-1",
    name: "Project 1",
    desc: {
      pt: "Em breve...",
      en: "Coming soon...",
      es: "Próximamente...",
    },
  },
  {
    id: "project-2",
    name: "Project 2",
    desc: {
      pt: "Em breve...",
      en: "Coming soon...",
      es: "Próximamente...",
    },
  },
  {
    id: "project-3",
    name: "Project 3",
    desc: {
      pt: "Em breve...",
      en: "Coming soon...",
      es: "Próximamente...",
    },
  },
];
