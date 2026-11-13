import SceneBackground from "@/components/scene/SceneBackground";
import Header from "@/components/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactFooter from "@/components/sections/ContactFooter";
import { Cursor } from "@/components/motion/Cursor";
import { Grain } from "@/components/motion/Grain";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { useAgentTools } from "@/agents/useAgentTools";
import { useSceneDirector } from "@/motion/useSceneDirector";

/**
 * The page is one continuous scene: a fixed WebGL layer at the back, the
 * sections scrolling over it, and grain and the cursor ring on top. Each
 * section names the particle formation it wants through `data-scene`.
 */
const Index = () => {
  useSceneDirector();
  useAgentTools();

  return (
    // overflow-x: clip (not hidden) so `position: sticky` scenes keep working.
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <SmoothScroll />
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
      <Grain />
      <Cursor />
    </div>
  );
};

export default Index;
