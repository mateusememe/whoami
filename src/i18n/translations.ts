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
    pt: "Python, Java, Go, Kubernetes | Microserviços • Mensageria • Cloud | Mestrando na UNESP | @Itaú Unibanco",
    en: "Python, Java, Go, Kubernetes | Microservices • Messaging • Cloud | MSc Researcher @UNESP | @Itaú Unibanco",
    es: "Python, Java, Go, Kubernetes | Microservicios • Mensajería • Cloud | Investigador de Maestría @UNESP | @Itaú Unibanco",
  },
  "hero.summary": {
    pt: "Desenvolvo microsserviços em Go, Python e Java, com foco em mensageria e infraestrutura em nuvem. Trabalho no Itaú Unibanco e pesquiso no mestrado pela UNESP.",
    en: "I build backend services in Go, Python, and Java, focusing on messaging and cloud infrastructure. Currently at Itaú Unibanco and doing MSc research at UNESP.",
    es: "Desarrollo microservicios en Go, Python y Java, enfocados en mensajería e infraestructura en la nube. Trabajo en Itaú Unibanco e investigo en maestría en la UNESP.",
  },
  "hero.photoProfile": {
    pt: "Perfil",
    en: "Profile",
    es: "Perfil",
  },
  "hero.photoTeaching": {
    pt: "Instrutor & Palestras",
    en: "Instructor & Talks",
    es: "Instructor y Charlas",
  },

  // About
  "about.title": { pt: "Sobre Mim", en: "About Me", es: "Sobre Mí" },
  "about.text": {
    pt: "Sou engenheiro de software backend com sólida experiência no desenvolvimento de sistemas distribuídos e infraestrutura em nuvem (AWS, GCP), atuando principalmente com Java, Go, Python e TypeScript. Minha rotina envolve o desenho de APIs, configuração de mensageria com Kafka e RabbitMQ, operação de microsserviços em Kubernetes e monitoramento de produção com Datadog e Grafana. Também realizo pesquisa de mestrado em Ciência da Computação na UNESP com foco em inteligência artificial e aprendizado de máquina.",
    en: "I'm a backend software engineer experienced in distributed systems and cloud infrastructure (AWS, GCP), working primarily with Java, Go, Python, and TypeScript. My daily work involves API design, messaging with Kafka and RabbitMQ, operating microservices on Kubernetes, and monitoring production with Datadog and Grafana. I also conduct MSc research in Computer Science at UNESP focused on artificial intelligence and machine learning.",
    es: "Soy ingeniero de software backend con sólida experiencia en el desarrollo de sistemas distribuidos e infraestructura en la nube (AWS, GCP), trabajando principalmente con Java, Go, Python y TypeScript. Mi trabajo diario incluye diseño de APIs, mensajería con Kafka y RabbitMQ, operación de microservicios en Kubernetes y monitoreo de producción con Datadog y Grafana. También realizo investigación de maestría en Ciencias de la Computación en la UNESP enfocada en inteligencia artificial y aprendizaje automático.",
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
  "contact.cta": {
    pt: "Canais diretos para contato profissional e projetos.",
    en: "Direct channels for professional contact and projects.",
    es: "Canales directos para contacto profesional y proyectos.",
  },

  // 404
  "notFound.title": { pt: "Página não encontrada", en: "Page Not Found", es: "Página no encontrada" },
  "notFound.message": {
    pt: "A página solicitada não existe.",
    en: "The requested page does not exist.",
    es: "La página solicitada no existe.",
  },
  "notFound.backHome": { pt: "Voltar para o início", en: "Back to Home", es: "Volver al inicio" },
};
