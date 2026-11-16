import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TalksSection from "@/components/sections/TalksSection";
import ContactFooter from "@/components/sections/ContactFooter";

/**
 * The home page: one continuous scene of sections over the WebGL layer
 * (SiteLayout). Each section names the particle formation it wants through
 * `data-scene`.
 */
const Index = () => (
  <main>
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <EducationSection />
    <SkillsSection />
    <ProjectsSection />
    <TalksSection />
    <ContactFooter />
  </main>
);

export default Index;
