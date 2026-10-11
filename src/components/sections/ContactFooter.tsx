import { useLanguage } from "@/contexts/LanguageContext";
import { Section } from "@/components/ds";
import { socialLinks } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";
import { renderSocialIcon } from "@/components/SocialIcons";

const ContactFooter = () => {
  const { t } = useLanguage();

  return (
    <Section
      as="footer"
      id="contact"
      index={sectionIndex("contact")}
      title={t("contact.title")}
      description={t("contact.cta")}
      align="center"
      className="py-10 sm:py-12 text-center"
    >
      <ul className="mt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:gap-4" aria-label={t("a11y.contactLinks")}>
        {socialLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="spotlight flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent/30 hover:bg-accent text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-base ease-expo border border-border/30 hover:border-signal/30 min-h-[38px]"
              aria-label={link.label}
            >
              {renderSocialIcon(link.iconName, 16)}
              <span className="font-mono text-xs">{link.displayText || link.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 sm:mt-12 pt-6 border-t border-border/50">
        <p className="font-mono text-[11px] sm:text-xs text-muted-foreground/60 leading-relaxed">
          © {new Date().getFullYear()} Mateus Mendonça Monteiro — Crafted with React, Vite, Tailwind & Three.js
        </p>
      </div>
    </Section>
  );
};

export default ContactFooter;
