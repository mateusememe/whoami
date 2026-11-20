export type Language = "pt" | "en" | "es";

export type Translations = Record<string, Record<Language, string>>;

export const translations: Translations = {
  // Nav
  "nav.about": { pt: "Sobre", en: "About", es: "Sobre" },
  "nav.experience": { pt: "Experiência", en: "Experience", es: "Experiencia" },
  "nav.education": { pt: "Educação", en: "Education", es: "Educación" },
  "nav.skills": { pt: "Skills", en: "Skills", es: "Skills" },
  "nav.projects": { pt: "Projetos", en: "Projects", es: "Proyectos" },
  "nav.talks": { pt: "Palestras", en: "Talks", es: "Charlas" },
  "nav.contact": { pt: "Contato", en: "Contact", es: "Contacto" },

  // SEO (document title and descriptions, per language)
  "seo.title": {
    pt: "Mateus Mendonça — Engenheiro de Software Backend",
    en: "Mateus Mendonça — Backend Software Engineer",
    es: "Mateus Mendonça — Ingeniero de Software Backend",
  },
  "seo.description": {
    pt: "Portfólio de Mateus Mendonça Monteiro, engenheiro de software backend no {company} e mestrando em Ciência da Computação na UNESP. Go, Python, Java, Kubernetes, AWS e GCP.",
    en: "Portfolio of Mateus Mendonça Monteiro, backend software engineer at {company} and MSc researcher in Computer Science at UNESP. Go, Python, Java, Kubernetes, AWS and GCP.",
    es: "Portafolio de Mateus Mendonça Monteiro, ingeniero de software backend en {company} e investigador de maestría en Ciencias de la Computación en la UNESP. Go, Python, Java, Kubernetes, AWS y GCP.",
  },
  "seo.imageAlt": {
    pt: "Mateus Mendonça Monteiro, Backend Software Engineer, sobre um gráfico de malha de serviços",
    en: "Mateus Mendonça Monteiro, Backend Software Engineer, over a service mesh graphic",
    es: "Mateus Mendonça Monteiro, Backend Software Engineer, sobre un gráfico de malla de servicios",
  },

  // SEO for project pages
  "seo.projectTitle": {
    pt: "{name} — projeto de Mateus Mendonça",
    en: "{name} — a project by Mateus Mendonça",
    es: "{name} — proyecto de Mateus Mendonça",
  },

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
  "hero.location": { pt: "São Paulo, Brasil", en: "São Paulo, Brazil", es: "São Paulo, Brasil" },
  "hero.scroll": { pt: "Role a página", en: "Scroll", es: "Desplaza" },

  // About
  "about.title": { pt: "Sobre Mim", en: "About Me", es: "Sobre Mí" },
  "about.text": {
    pt: "Sou engenheiro de software backend. Construo sistemas distribuídos e microsserviços orientados a eventos para plataformas financeiras e de varejo de alto volume. No Itaú Unibanco, escrevo serviços serverless em Python e Go e ferramentas que migram dados entre contas AWS e plataformas de dados de clientes, incluindo origens em mainframe. No LuizaLabs, trabalhei no motor de busca usado por milhões de pessoas por dia e reduzi em 20% o tempo de sincronização de dados de produtos. Também faço pesquisa de mestrado em Ciência da Computação na UNESP, em inteligência artificial e aprendizado de máquina.",
    en: "I'm a backend software engineer. I build distributed systems and event-driven microservices for high-volume financial and retail platforms. At Itaú Unibanco I write serverless services in Python and Go, and tools that migrate data between AWS accounts and Customer Data Platforms, including mainframe sources. At LuizaLabs I worked on the search engine used by millions of people a day and cut product data synchronization time by 20%. I also do MSc research in Computer Science at UNESP, on artificial intelligence and machine learning.",
    es: "Soy ingeniero de software backend. Construyo sistemas distribuidos y microservicios orientados a eventos para plataformas financieras y de retail de alto volumen. En Itaú Unibanco escribo servicios serverless en Python y Go, y herramientas que migran datos entre cuentas AWS y plataformas de datos de clientes, incluidos orígenes en mainframe. En LuizaLabs trabajé en el motor de búsqueda usado por millones de personas al día y reduje en 20% el tiempo de sincronización de datos de productos. También hago investigación de maestría en Ciencias de la Computación en la UNESP, en inteligencia artificial y aprendizaje automático.",
  },
  "about.portraitCaption": {
    pt: "Retrato em pontos, gerado a partir da foto de perfil.",
    en: "Dot-matrix portrait, generated from the profile photo.",
    es: "Retrato en puntos, generado a partir de la foto de perfil.",
  },
  "about.portraitAlt": {
    pt: "Retrato de Mateus Mendonça Monteiro",
    en: "Portrait of Mateus Mendonça Monteiro",
    es: "Retrato de Mateus Mendonça Monteiro",
  },
  "about.statRoles": { pt: "cargos desde {year}", en: "roles since {year}", es: "cargos desde {year}" },
  "about.statCompanies": { pt: "empresas", en: "companies", es: "empresas" },
  "about.statRepos": { pt: "projetos", en: "projects", es: "proyectos" },
  "about.statStars": { pt: "estrelas no GitHub", en: "GitHub stars", es: "estrellas en GitHub" },

  // Experience
  "exp.title": { pt: "Experiência", en: "Experience", es: "Experiencia" },
  "exp.present": { pt: "Presente", en: "Present", es: "Presente" },
  "exp.lead": {
    pt: "{roles} cargos em {companies} empresas, de {from} até hoje.",
    en: "{roles} roles at {companies} companies, from {from} to today.",
    es: "{roles} cargos en {companies} empresas, de {from} a hoy.",
  },
  "exp.current": { pt: "Atual", en: "Current", es: "Actual" },

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
  "edu.inProgress": { pt: "Em andamento", en: "In progress", es: "En curso" },
  "edu.languages": { pt: "Idiomas", en: "Languages", es: "Idiomas" },
  "edu.certifications": { pt: "Certificações", en: "Certifications", es: "Certificaciones" },

  // Skills
  "skills.title": { pt: "Conquistas & Skills", en: "Achievements & Skills", es: "Logros & Skills" },
  "skills.scholarship": {
    pt: "Bolsista 100% ProUni",
    en: "ProUni Full Scholar (100%)",
    es: "Becario 100% ProUni",
  },
  "skills.scholarshipIssuer": {
    pt: "Emitido por ProUni • Associado à Universidade do Oeste Paulista",
    en: "Issued by ProUni • Associated with Universidade do Oeste Paulista",
    es: "Emitido por ProUni • Asociado a la Universidade do Oeste Paulista",
  },
  "skills.scholarshipDesc": {
    pt: "Bolsista 100% do Programa Universidade para Todos no Curso de Bacharelado em Ciência da Computação na Universidade do Oeste Paulista.",
    en: "100% full scholarship recipient from the University for All Program (ProUni) for the Bachelor's in Computer Science at Universidade do Oeste Paulista.",
    es: "Becario 100% del Programa Universidad para Todos en la Licenciatura en Ciencias de la Computación en la Universidade do Oeste Paulista.",
  },
  "skills.topSkills": { pt: "Principais Competências", en: "Top Skills", es: "Principales Competencias" },
  "skills.stack": { pt: "Stack Técnica", en: "Tech Stack", es: "Stack Técnico" },
  "skills.achievement": { pt: "Conquista", en: "Achievement", es: "Logro" },
  "skills.sealText": {
    pt: "ProUni · bolsa integral · 100% · ",
    en: "ProUni · full scholarship · 100% · ",
    es: "ProUni · beca completa · 100% · ",
  },
  "skills.group.languages": { pt: "Linguagens", en: "Languages", es: "Lenguajes" },
  "skills.group.backend": { pt: "Backend e APIs", en: "Backend & APIs", es: "Backend y APIs" },
  "skills.group.messaging": { pt: "Mensageria", en: "Messaging", es: "Mensajería" },
  "skills.group.cloud": { pt: "Cloud", en: "Cloud", es: "Cloud" },
  "skills.group.data": { pt: "Dados", en: "Data", es: "Datos" },
  "skills.group.platform": { pt: "Plataforma e entrega", en: "Platform & delivery", es: "Plataforma y entrega" },
  "skills.group.observability": { pt: "Observabilidade", en: "Observability", es: "Observabilidad" },
  "skills.group.frontend": { pt: "Frontend", en: "Frontend", es: "Frontend" },

  // Projects
  "projects.title": { pt: "Projetos", en: "Projects", es: "Proyectos" },
  "projects.placeholder": { pt: "Em breve...", en: "Coming soon...", es: "Próximamente..." },
  "projects.viewGithub": { pt: "Ver no GitHub", en: "View on GitHub", es: "Ver en GitHub" },
  "projects.lead": {
    pt: "{repos} projetos e {stars} estrelas no GitHub. Cada capa da galeria executa o algoritmo do projeto.",
    en: "{repos} projects and {stars} GitHub stars. Each cover in the gallery runs the project's algorithm.",
    es: "{repos} proyectos y {stars} estrellas en GitHub. Cada portada de la galería ejecuta el algoritmo del proyecto.",
  },
  "projects.open": { pt: "Abrir", en: "Open", es: "Abrir" },
  "projects.stars": { pt: "{n} estrelas", en: "{n} stars", es: "{n} estrellas" },
  "projects.private": { pt: "Repositório privado", en: "Private repository", es: "Repositorio privado" },
  "projects.more": { pt: "Mais projetos", en: "More projects", es: "Más proyectos" },
  "projects.contributions": {
    pt: "Contribuições open source",
    en: "Open-source contributions",
    es: "Contribuciones open source",
  },
  "projects.contributionsLead": {
    pt: "Pull requests aceitos em repositórios de outras pessoas.",
    en: "Pull requests merged into other people's repositories.",
    es: "Pull requests aceptados en repositorios de otras personas.",
  },
  "projects.merged": { pt: "Aceito em {date}", en: "Merged {date}", es: "Aceptado en {date}" },

  // Talks
  "talks.title": { pt: "Palestras e minicursos", en: "Talks & workshops", es: "Charlas y talleres" },
  "talks.lead": {
    pt: "{count} minicursos de {first} a {last}, com o material aberto quando existe.",
    en: "{count} workshops from {first} to {last}, with the material open where it exists.",
    es: "{count} talleres de {first} a {last}, con el material abierto cuando existe.",
  },
  "talks.workshop": { pt: "Minicurso", en: "Workshop", es: "Taller" },
  "talks.talk": { pt: "Palestra", en: "Talk", es: "Charla" },
  "talks.with": { pt: "com {names}", en: "with {names}", es: "con {names}" },
  "talks.repo": { pt: "Código", en: "Code", es: "Código" },
  "talks.slides": { pt: "Slides", en: "Slides", es: "Diapositivas" },
  "talks.notebook": { pt: "Notebook", en: "Notebook", es: "Notebook" },
  "edu.publications": { pt: "Publicações", en: "Publications", es: "Publicaciones" },
  "edu.proceedings": { pt: "Anais (PDF)", en: "Proceedings (PDF)", es: "Anales (PDF)" },
  "edu.abstract": { pt: "Resumo", en: "Abstract", es: "Resumen" },
  "edu.paper": { pt: "Artigo", en: "Paper", es: "Artículo" },
  "project.published": { pt: "Publicado em", en: "Published in", es: "Publicado en" },
  "talks.online": { pt: "Online", en: "Online", es: "En línea" },
  "talks.event": { pt: "Página do evento", en: "Event page", es: "Página del evento" },
  "talks.project": { pt: "Projeto", en: "Project", es: "Proyecto" },

  // Project pages
  "project.back": { pt: "Todos os projetos", en: "All projects", es: "Todos los proyectos" },
  "project.repo": { pt: "Repositório", en: "Repository", es: "Repositorio" },
  "project.live": { pt: "Ver online", en: "Live site", es: "Ver en línea" },
  "project.year": { pt: "Ano", en: "Year", es: "Año" },
  "project.language": { pt: "Linguagem", en: "Language", es: "Lenguaje" },
  "project.license": { pt: "Licença", en: "License", es: "Licencia" },
  "project.stars": { pt: "Estrelas", en: "Stars", es: "Estrellas" },
  "project.coAuthors": { pt: "Coautoria", en: "Co-authors", es: "Coautoría" },
  "project.details": { pt: "Detalhes", en: "Details", es: "Detalles" },
  "project.stack": { pt: "Stack", en: "Stack", es: "Stack" },
  "project.talk": { pt: "Apresentado em", en: "Presented at", es: "Presentado en" },
  "project.figure": { pt: "fig.", en: "fig.", es: "fig." },
  "project.prev": { pt: "Anterior", en: "Previous", es: "Anterior" },
  "project.next": { pt: "Próximo", en: "Next", es: "Siguiente" },
  "project.page": { pt: "Página do projeto", en: "Project page", es: "Página del proyecto" },

  // Command palette
  "palette.title": { pt: "Paleta de comandos", en: "Command palette", es: "Paleta de comandos" },
  "palette.open": {
    pt: "Abrir a paleta de comandos",
    en: "Open the command palette",
    es: "Abrir la paleta de comandos",
  },
  "palette.placeholder": {
    pt: "Digite um comando ou busque…",
    en: "Type a command or search…",
    es: "Escribe un comando o busca…",
  },
  "palette.empty": {
    pt: "Nada encontrado para “{query}”.",
    en: "No results for “{query}”.",
    es: "Sin resultados para “{query}”.",
  },
  "palette.hint": {
    pt: "↑↓ navegar · ↵ abrir · esc fechar",
    en: "↑↓ move · ↵ open · esc close",
    es: "↑↓ moverse · ↵ abrir · esc cerrar",
  },
  "palette.groupSections": { pt: "Seções", en: "Sections", es: "Secciones" },
  "palette.groupProjects": { pt: "Projetos", en: "Projects", es: "Proyectos" },
  "palette.groupTalks": { pt: "Palestras", en: "Talks", es: "Charlas" },
  "palette.groupActions": { pt: "Ações", en: "Actions", es: "Acciones" },
  "palette.groupLinks": { pt: "Links", en: "Links", es: "Enlaces" },
  "palette.copyEmail": { pt: "Copiar o email", en: "Copy the email address", es: "Copiar el email" },
  "palette.copied": { pt: "Email copiado", en: "Email copied", es: "Email copiado" },
  "palette.theme": { pt: "Alternar tema claro/escuro", en: "Toggle light/dark theme", es: "Cambiar tema claro/oscuro" },
  "palette.language": { pt: "Ler em {lang}", en: "Read in {lang}", es: "Leer en {lang}" },
  "cv.download": { pt: "Baixar CV", en: "Download CV", es: "Descargar CV" },
  "palette.cv": {
    pt: "Baixar o currículo em PDF",
    en: "Download the résumé (PDF)",
    es: "Descargar el currículum en PDF",
  },
  "palette.resume": {
    pt: "Currículo em JSON (JSON Resume)",
    en: "Résumé as JSON (JSON Resume)",
    es: "Currículum en JSON (JSON Resume)",
  },
  "palette.llms": {
    pt: "llms.txt para agentes de IA",
    en: "llms.txt for AI agents",
    es: "llms.txt para agentes de IA",
  },
  "palette.source": {
    pt: "Código-fonte deste site",
    en: "Source code of this site",
    es: "Código fuente de este sitio",
  },
  "palette.top": { pt: "Voltar ao início", en: "Back to the top", es: "Volver al inicio" },
  "palette.kbd": { pt: "Atalho: {keys}", en: "Shortcut: {keys}", es: "Atajo: {keys}" },

  // Contact
  "contact.title": { pt: "Contato", en: "Contact", es: "Contacto" },
  "contact.cta": {
    pt: "Canais diretos para contato profissional e projetos.",
    en: "Direct channels for professional contact and projects.",
    es: "Canales directos para contacto profesional e projetos.",
  },
  "contact.copy": { pt: "Copiar e-mail", en: "Copy email", es: "Copiar correo" },
  "contact.copied": { pt: "Copiado", en: "Copied", es: "Copiado" },
  "contact.channels": { pt: "Outros canais", en: "Other channels", es: "Otros canales" },
  "footer.localTime": { pt: "Horário local", en: "Local time", es: "Hora local" },

  // 404
  "notFound.title": { pt: "Página não encontrada", en: "Page Not Found", es: "Página no encontrada" },
  "notFound.message": {
    pt: "A página solicitada não existe.",
    en: "The requested page does not exist.",
    es: "La página solicitada no existe.",
  },
  "notFound.backHome": { pt: "Voltar para o início", en: "Back to Home", es: "Volver al inicio" },

  // Accessibility labels (aria-label). Tokens like {name} are filled by t(key, params).
  "a11y.backToTop": { pt: "Ir para o topo", en: "Go to top", es: "Ir arriba" },
  "a11y.monogram": { pt: "MM, página inicial", en: "MM, home page", es: "MM, página de inicio" },
  "a11y.mainNav": { pt: "Navegação principal", en: "Main navigation", es: "Navegación principal" },
  "a11y.languageSelect": { pt: "Seleção de idioma", en: "Language selection", es: "Selección de idioma" },
  "a11y.switchLanguage": { pt: "{code}, mudar para {lang}", en: "{code}, switch to {lang}", es: "{code}, cambiar a {lang}" },
  "a11y.enableLightMode": { pt: "Ativar modo claro", en: "Switch to light mode", es: "Activar modo claro" },
  "a11y.enableDarkMode": { pt: "Ativar modo escuro", en: "Switch to dark mode", es: "Activar modo oscuro" },
  "a11y.openMenu": { pt: "Abrir menu", en: "Open menu", es: "Abrir menú" },
  "a11y.closeMenu": { pt: "Fechar menu", en: "Close menu", es: "Cerrar menú" },
  "a11y.sectionNav": { pt: "Seções da página", en: "Page sections", es: "Secciones de la página" },

  "a11y.socialLinks": {
    pt: "Links de redes sociais e perfis acadêmicos",
    en: "Social media and academic profile links",
    es: "Enlaces a redes sociales y perfiles académicos",
  },
  "a11y.scrollToAbout": {
    pt: "Rolar para a seção sobre mim",
    en: "Scroll to the about me section",
    es: "Desplazarse a la sección sobre mí",
  },

  "a11y.photoCarousel": {
    pt: "Carrossel de fotos de Mateus Mendonça Monteiro",
    en: "Photo carousel of Mateus Mendonça Monteiro",
    es: "Carrusel de fotos de Mateus Mendonça Monteiro",
  },
  "a11y.prevPhoto": { pt: "Foto anterior", en: "Previous photo", es: "Foto anterior" },
  "a11y.nextPhoto": { pt: "Próxima foto", en: "Next photo", es: "Siguiente foto" },
  "a11y.photoTabs": { pt: "Fotos", en: "Photos", es: "Fotos" },
  "a11y.goToPhoto": { pt: "Foto {n}: {label}", en: "Photo {n}: {label}", es: "Foto {n}: {label}" },

  "a11y.expTech": { pt: "Tecnologias utilizadas", en: "Technologies used", es: "Tecnologías utilizadas" },

  "a11y.projectsControls": {
    pt: "Controles do carrossel de projetos",
    en: "Project carousel controls",
    es: "Controles del carrusel de proyectos",
  },
  "a11y.prevProject": { pt: "Projeto anterior", en: "Previous project", es: "Proyecto anterior" },
  "a11y.nextProject": { pt: "Próximo projeto", en: "Next project", es: "Siguiente proyecto" },
  "a11y.projectsCarousel": {
    pt: "Carrossel de projetos",
    en: "Project carousel",
    es: "Carrusel de proyectos",
  },
  "a11y.projectsPagination": { pt: "Navegação dos projetos", en: "Project navigation", es: "Navegación de proyectos" },
  "a11y.goToProject": {
    pt: "Ir para projeto {n}: {name}",
    en: "Go to project {n}: {name}",
    es: "Ir al proyecto {n}: {name}",
  },
  "a11y.viewRepo": {
    pt: "Ver repositório {name} no GitHub",
    en: "View {name} repository on GitHub",
    es: "Ver repositorio {name} en GitHub",
  },
  "a11y.viewDemo": { pt: "Ver demonstração de {name}", en: "View {name} demo", es: "Ver demostración de {name}" },
  "a11y.projectTech": { pt: "Tecnologias do projeto", en: "Project technologies", es: "Tecnologías del proyecto" },

  "a11y.contactLinks": { pt: "Contatos e Redes", en: "Contacts and social networks", es: "Contactos y redes" },
  "a11y.openProject": { pt: "Abrir a página de {name}", en: "Open the {name} page", es: "Abrir la página de {name}" },
  "a11y.talkLinks": { pt: "Material de {title}", en: "Material for {title}", es: "Material de {title}" },
  "a11y.projectNav": { pt: "Outros projetos", en: "Other projects", es: "Otros proyectos" },
  "a11y.breadcrumb": { pt: "Você está em", en: "You are here", es: "Estás en" },
};
