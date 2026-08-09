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
              className="glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[150px] border border-border/40 hover:border-border/70 hover:bg-accent/20 transition-all"
            >
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-2">{p.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc[language]}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-muted-foreground/60">
                <span className="text-[11px] font-mono">{t("projects.placeholder")}</span>
                {p.liveUrl ? (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                    aria-label={`Ver projeto ${p.name}`}
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <ExternalLink size={14} aria-hidden="true" />
                )}
              </div>
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
