import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/data/portfolio";

const ProjectsSection = () => {
  const { language, t } = useLanguage();

  return (
    <section id="projects" className="relative z-10 py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl font-display font-bold text-foreground mb-8">
          {t("projects.title")}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-border/40 hover:border-border/70 hover:bg-accent/20 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-mono font-semibold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={`Ver repositório ${p.name} no GitHub`}
                      >
                        <Github size={15} />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={`Ver demonstração de ${p.name}`}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {p.desc[language]}
                </p>
              </div>

              {p.tech && p.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/30">
                  {p.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-accent/40 text-muted-foreground border border-border/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://github.com/mateusememe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono px-4 py-2 rounded-xl bg-accent/40 hover:bg-accent border border-border/30"
          >
            <Github size={16} />
            {t("projects.viewGithub")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
