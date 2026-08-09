export type Language = "pt" | "en" | "es";

export type Translations = Record<string, Record<Language, string>>;

export const translations: Translations = {
  // Nav
  "nav.about": { pt: "Sobre", en: "About", es: "Sobre" },
  "nav.experience": { pt: "Experiência", en: "Experience", es: "Experiencia" },
  "nav.education": { pt: "Educação", en: "Education", es: "Educación" },
  "nav.skills": { pt: "Skills", en: "Skills", es: "Skills" },
  "nav.projects": { pt: "Projetos", en: "Projects", es: "Proyectos" },
  "nav.contact": { pt: "Contato", en: "Contact", es: "Contacto" },

  // Hero
  "hero.title": {
    pt: "Backend Software Engineer",
    en: "Backend Software Engineer",
    es: "Backend Software Engineer",
  },
  "hero.subtitle": {
    pt: "Python, Java, Spring Boot, Kubernetes | Microservices • Messaging • Cloud | MSc Researcher @Unesp | @Itaú Unibanco",
    en: "Python, Java, Spring Boot, Kubernetes | Microservices • Messaging • Cloud | MSc Researcher @Unesp | @Itaú Unibanco",
    es: "Python, Java, Spring Boot, Kubernetes | Microservices • Messaging • Cloud | MSc Researcher @Unesp | @Itaú Unibanco",
  },
  "hero.summary": {
    pt: "Construo backends que aguentam escala: microserviços, filas de mensagens, infraestrutura em nuvem. Quatro anos fazendo isso no Itaú Unibanco, LuizaLabs e ANBIMA. Mestrando na UNESP em paralelo.",
    en: "I build backends that hold up at scale: microservices, message queues, cloud infrastructure. Four years doing this at Itaú Unibanco, LuizaLabs, and ANBIMA. Pursuing an MSc at UNESP on the side.",
    es: "Construyo backends que aguantan escala: microservicios, colas de mensajes, infraestructura en la nube. Cuatro años haciendo esto en Itaú Unibanco, LuizaLabs y ANBIMA. Cursando maestría en la UNESP en paralelo.",
  },

  // About
  "about.title": { pt: "Sobre Mim", en: "About Me", es: "Sobre Mí" },
  "about.text": {
    pt: "Trabalho com backend, microserviços e infraestrutura cloud. Minha stack do dia a dia inclui Java, TypeScript, Node.js, Python e Go, orquestrados com Kubernetes, Kafka, RabbitMQ e Pub/Sub rodando em GCP, AWS e Magalu Cloud. Entrego serviços que se mantêm de pé sob carga, com pipelines de CI/CD, observabilidade via Datadog e Grafana, e práticas de segurança desde o design. Gosto de desafios de arquitetura e de times onde todo mundo contribui de verdade.",
    en: "I work on backend systems, microservices, and cloud infrastructure. My day-to-day stack covers Java, TypeScript, Node.js, Python, and Go, orchestrated with Kubernetes, Kafka, RabbitMQ, and Pub/Sub on GCP, AWS, and Magalu Cloud. I ship services that stay up under load, with CI/CD pipelines, Datadog and Grafana observability, and security baked in from the design phase. I look for architecture challenges and teams where everyone pulls their weight.",
    es: "Trabajo con backend, microservicios e infraestructura cloud. Mi stack del día a día incluye Java, TypeScript, Node.js, Python y Go, orquestados con Kubernetes, Kafka, RabbitMQ y Pub/Sub en GCP, AWS y Magalu Cloud. Entrego servicios que se mantienen en pie bajo carga, con pipelines de CI/CD, observabilidad vía Datadog y Grafana, y seguridad integrada desde el diseño. Me gustan los desafíos de arquitectura y los equipos donde todos contribuyen de verdad.",
  },

  // Experience
  "exp.title": { pt: "Experiência", en: "Experience", es: "Experiencia" },
  "exp.present": { pt: "Presente", en: "Present", es: "Presente" },

  // Education
  "edu.title": { pt: "Educação", en: "Education", es: "Educación" },
  "edu.masters": {
    pt: "Mestrado em Ciência da Computação",
    en: "Master's in Computer Science",
    es: "Maestría en Ciencias de la Computación",
  },
  "edu.bachelors": {
    pt: "Bacharelado em Ciência da Computação",
    en: "Bachelor's in Computer Science",
    es: "Licenciatura en Ciencias de la Computación",
  },

  // Skills
  "skills.title": { pt: "Conquistas & Skills", en: "Achievements & Skills", es: "Logros & Skills" },
  "skills.scholarship": { pt: "Bolsa de Estudos", en: "Scholarship", es: "Beca de Estudios" },
  "skills.topSkills": { pt: "Principais Competências", en: "Top Skills", es: "Principales Competencias" },
  "skills.stack": { pt: "Stack Técnica", en: "Tech Stack", es: "Stack Técnico" },

  // Projects
  "projects.title": { pt: "Projetos", en: "Projects", es: "Proyectos" },
  "projects.placeholder": { pt: "Em breve...", en: "Coming soon...", es: "Próximamente..." },
  "projects.viewGithub": { pt: "Ver no GitHub", en: "View on GitHub", es: "Ver en GitHub" },

  // Contact
  "contact.title": { pt: "Contato", en: "Contact", es: "Contacto" },
  "contact.cta": { pt: "Vamos conversar?", en: "Let's talk?", es: "¿Hablamos?" },

  // 404
  "notFound.title": { pt: "Página não encontrada", en: "Page Not Found", es: "Página no encontrada" },
  "notFound.message": {
    pt: "A página que você está procurando não existe.",
    en: "The page you are looking for does not exist.",
    es: "La página que estás buscando no existe.",
  },
  "notFound.backHome": { pt: "Voltar para o início", en: "Back to Home", es: "Volver al inicio" },
};
