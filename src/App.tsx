import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FrameCanvas } from "./components/FrameCanvas";
import { HeroSection } from "./components/HeroSection";
import { HudBadge } from "./components/HudBadge";
import { IntroSection } from "./components/IntroSection";
import { LinksPanel } from "./components/LinksPanel";
import { PipelineSection } from "./components/PipelineSection";
import { ScrollProgress } from "./components/ScrollProgress";
import { SiteNav } from "./components/SiteNav";
import { WorksSection } from "./components/WorksSection";
import { featuredRepos, links } from "./data/links";
import { projects } from "./data/projects";
import { navSections, pipelineSteps, sectionStates } from "./data/sections";
import type { SectionId, SectionState } from "./types/content";

gsap.registerPlugin(ScrollTrigger);

function getSectionState(id: SectionId): SectionState {
  return sectionStates.find((section) => section.id === id) ?? sectionStates[0];
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const activeState = useMemo(() => getSectionState(activeSection), [activeSection]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setProgress(0.62);
      setActiveSection("intro");
      return;
    }

    const mainTrigger = ScrollTrigger.create({
      trigger: ".story",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.45,
      onUpdate: (self) => setProgress(self.progress),
    });

    const sectionTriggers = gsap.utils.toArray<HTMLElement>(".story-panel").map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection((section.dataset.section as SectionId) || "hero"),
        onEnterBack: () => setActiveSection((section.dataset.section as SectionId) || "hero"),
      }),
    );

    return () => {
      mainTrigger.kill();
      sectionTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <FrameCanvas progress={progress} />
      <div className="page-vignette" aria-hidden="true" />
      <SiteNav sections={navSections} activeSection={activeSection} />
      <HudBadge state={activeState} />
      <ScrollProgress progress={progress} />
      <main className="app-shell story">
        <HeroSection />
        <IntroSection />
        <WorksSection projects={projects} />
        <PipelineSection steps={pipelineSteps} />
        <LinksPanel links={links} featuredRepos={featuredRepos} />
      </main>
    </>
  );
}
