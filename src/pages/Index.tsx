import SceneBackground from "@/components/scene/SceneBackground";
import Header from "@/components/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactFooter from "@/components/sections/ContactFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <SceneBackground />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactFooter />
      </main>
    </div>
  );
};

export default Index;
