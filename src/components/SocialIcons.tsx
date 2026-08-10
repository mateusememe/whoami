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
    case "X":
      return <span className="font-bold leading-none" style={{ fontSize: size - 2 }}>𝕏</span>;
    case "Discord":
      return <span className="font-mono font-bold leading-none text-indigo-400" style={{ fontSize: size - 4 }}>DC</span>;
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
