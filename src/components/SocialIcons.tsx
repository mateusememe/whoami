import React from "react";
import { Instagram, Mail, Linkedin, Github } from "lucide-react";
import { type SocialLink } from "@/data/portfolio";

export const OrcidIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
    className={`text-[#A6CE39] ${className}`}
  >
    <path d="M128 0C57.308 0 0 57.308 0 128s57.308 128 128 128 128-57.308 128-128S198.692 0 128 0zm-41.22 187.892H64.067V78.508h22.713v109.384zm-11.357-123.63c-7.385 0-13.37-5.985-13.37-13.37 0-7.385 5.985-13.37 13.37-13.37s13.37 5.985 13.37 13.37c0 7.385-5.985 13.37-13.37 13.37zm116.147 67.246c0 30.954-20.954 56.384-55.846 56.384H103.54V78.508h33.846c33.077 0 54.338 22.462 54.338 53.008zm-23.077 0c0-19.385-11.692-33.692-32.308-33.692h-13.23v67.384h13.23c20.616 0 32.308-14.307 32.308-33.692z" />
  </svg>
);

export const LattesIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <rect width="32" height="32" rx="7" className="fill-[#005CA9]/15 dark:fill-[#38BDF8]/20" />
    <path
      d="M11 9v14h10v-3.5h-6.5V9H11z"
      className="fill-[#005CA9] dark:fill-[#38BDF8]"
    />
    <circle cx="21" cy="11.5" r="2.5" fill="#F59E0B" />
  </svg>
);

export const renderSocialIcon = (
  iconName: SocialLink["iconName"],
  size = 16
): React.ReactNode => {
  switch (iconName) {
    case "Instagram":
      return <Instagram size={size} />;
    // Brand marks as SVG (Simple Icons, CC0), not letters: text inside a link
    // would have to appear in its accessible name.
    case "X":
      return (
        <svg width={size - 2} height={size - 2} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "Discord":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-indigo-400">
          <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    case "Linkedin":
      return <Linkedin size={size} />;
    case "Mail":
      return <Mail size={size} />;
    case "Github":
      return <Github size={size} />;
    case "Orcid":
      return <OrcidIcon size={size} />;
    case "Lattes":
      return <LattesIcon size={size} />;
    default:
      return null;
  }
};
