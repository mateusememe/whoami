import { useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy, FileDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal, SectionHeading } from "@/components/ds";
import { LocalClock } from "@/components/LocalClock";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { renderSocialIcon } from "@/components/SocialIcons";
import { socialLinks } from "@/data/portfolio";
import { sectionIndex } from "@/data/navigation";
import { SiteLinks } from "@/components/PageFooter";
import { CV_FILES } from "@/seo/files";
import { analyticsEnabled, trackEvent } from "@/lib/analytics";

const mail = socialLinks.find((link) => link.href.startsWith("mailto:"));
const channels = socialLinks.filter((link) => link !== mail);
const email = mail?.displayText ?? "";

/**
 * Closing scene. The email is the headline; the other channels are rows
 * that open on hover. The name runs once more as an outlined band, and the
 * service mesh returns behind it.
 */
const ContactFooter = () => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard unavailable (insecure context or denied): the mailto link still works.
    }
  };

  return (
    <footer id="contact" aria-labelledby="contact-title" data-scene="6" className="relative z-10 pt-section">
      <div className="shell">
        <SectionHeading
          id="contact-title"
          index={sectionIndex("contact")}
          title={t("contact.title")}
          description={t("contact.cta")}
        />

        {mail && (
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <Reveal variant="mask">
              <a
                href={mail.href}
                className="link-underline block pb-1 font-display text-[clamp(1.55rem,6.3vw,6.75rem)] font-semibold leading-none tracking-[-0.045em] text-foreground transition-colors duration-base hover:text-signal"
              >
                {email}
              </a>
            </Reveal>
            <Magnetic>
              <button
                type="button"
                onClick={copyEmail}
                className="glass-card inline-flex h-11 items-center gap-2.5 rounded-full px-5 font-mono text-xs text-foreground transition-colors duration-base hover:text-signal"
              >
                {copied ? <Check size={14} className="text-signal" /> : <Copy size={14} />}
                <span aria-live="polite">{copied ? t("contact.copied") : t("contact.copy")}</span>
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={`${import.meta.env.BASE_URL}${CV_FILES[language]}`}
                download
                type="application/pdf"
                onClick={() => trackEvent("cv-download")}
                className="glass-card inline-flex h-11 items-center gap-2.5 rounded-full px-5 font-mono text-xs text-foreground transition-colors duration-base hover:text-signal"
              >
                <FileDown size={14} aria-hidden="true" />
                {t("cv.download")}
                <span className="text-muted-foreground">PDF</span>
              </a>
            </Magnetic>
          </div>
        )}

        <p className="label mb-5 mt-16 sm:mt-24">{t("contact.channels")}</p>
        <Reveal as="ul" variant="stagger" aria-label={t("a11y.contactLinks")} className="border-t border-border/60">
          {channels.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="row-link grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-b border-border/60 py-5 sm:grid-cols-[auto_1fr_1fr_auto] sm:py-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-foreground">
                  {renderSocialIcon(link.iconName, 16)}
                </span>
                <span className="font-display text-display-sm font-medium text-foreground">{link.label}</span>
                <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                  {link.displayText || link.label}
                </span>
                <ArrowUpRight aria-hidden="true" size={22} className="row-arrow text-signal" />
              </a>
            </li>
          ))}
        </Reveal>
      </div>

      <div aria-hidden="true" className="mt-section select-none">
        <Marquee duration={44}>
          <span className="text-outline whitespace-nowrap px-8 font-display text-display-2xl font-semibold">
            Mateus Mendonça Monteiro
          </span>
          <span className="font-serif text-display-xl italic text-signal">whoami</span>
        </Marquee>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pb-8 pt-10">
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Mateus Mendonça Monteiro — Crafted with React,
          Vite, Tailwind & Three.js
        </p>
        <nav aria-label={t("pages.more")} className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
          <SiteLinks />
        </nav>
        {analyticsEnabled && <p className="font-mono text-[11px] text-muted-foreground sm:text-xs">{t("footer.analytics")}</p>}
        <p className="label flex items-center gap-3">
          <span>{t("footer.localTime")}</span>
          <LocalClock className="text-foreground" />
        </p>
        <Magnetic>
          <a
            href="#top"
            aria-label={t("a11y.backToTop")}
            className="glass-card flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors duration-base hover:text-signal"
          >
            <ArrowUp size={16} />
          </a>
        </Magnetic>
      </div>
    </footer>
  );
};

export default ContactFooter;
