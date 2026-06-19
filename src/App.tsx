import { useEffect, useMemo, useState } from "react";
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
import { pipelineSteps, navSections, sectionStates } from "./data/sections";
import { projects } from "./data/projects";
import type { SectionId } from "./types/content";

function getScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
}

function getActiveSection(): SectionId {
  const viewportAnchor = window.innerHeight * 0.42;
  const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
  for (let index = panels.length - 1; index >= 0; index -= 1) {
    const panel = panels[index];
    if (panel.getBoundingClientRect().top <= viewportAnchor) {
      return (panel.dataset.section as SectionId | undefined) ?? "hero";
    }
  }

  return "hero";
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const activeState = useMemo(
    () => sectionStates.find((state) => state.id === activeSection) ?? sectionStates[0],
    [activeSection],
  );

  useEffect(() => {
    const syncScrollState = () => {
      setProgress(getScrollProgress());
      setActiveSection(getActiveSection());
    };

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      window.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, []);

  return (
    <>
      <FrameCanvas progress={progress} />
      <ScrollProgress progress={progress} />
      <SiteNav sections={navSections} activeSection={activeSection} />
      <HudBadge state={activeState} />
      <main className="app-shell">
        <HeroSection />
        <IntroSection />
        <WorksSection projects={projects} />
        <PipelineSection steps={pipelineSteps} />
        <LinksPanel links={links} featuredRepos={featuredRepos} />
      </main>
    </>
  );
}
