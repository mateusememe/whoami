import { Instagram, Mail, Linkedin, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { socialLinks, type SocialLink } from "@/data/portfolio";

const renderSocialIcon = (iconName: SocialLink["iconName"]) => {
  switch (iconName) {
    case "Instagram":
      return <Instagram size={16} />;
    case "X":
      return <span className="text-sm font-bold leading-none">𝕏</span>;
    case "Discord":
      return <span className="text-xs font-mono font-bold leading-none">DC</span>;
    case "Linkedin":
      return <Linkedin size={16} />;
    case "Mail":
      return <Mail size={16} />;
    case "Github":
      return <Github size={16} />;
    default:
      return null;
  }
};

const ContactFooter = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="relative z-10 py-20 px-6">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          {t("contact.title")}
        </h2>
        <p className="text-sm text-muted-foreground mb-10">{t("contact.cta")}</p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6" aria-label="Contatos e Redes">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/30 hover:bg-accent text-sm text-muted-foreground hover:text-foreground transition-all border border-border/30"
              aria-label={link.label}
            >
              {renderSocialIcon(link.iconName)}
              <span className="font-mono text-xs">{link.displayText || link.label}</span>
            </a>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border/50">
          <p className="font-mono text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Mateus Mendonça Monteiro — Crafted with React, Vite & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
