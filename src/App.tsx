import { useEffect, useMemo, useState } from "react";
import { FrameCanvas } from "./components/FrameCanvas";
import { HeroSection } from "./components/HeroSection";
import { HudBadge } from "./components/HudBadge";
import { IntroSection } from "./components/IntroSection";
import { ProjectCard } from "./components/ProjectCard";
import { ScrollProgress } from "./components/ScrollProgress";
import { SiteNav } from "./components/SiteNav";
import { links } from "./data/links";
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
        <section className="section story-panel" id="works" data-section="works" aria-labelledby="works-title">
          <div className="section__inner">
            <p className="eyebrow">Works</p>
            <h2 id="works-title">把想法做成能跑起来的原型。</h2>
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        </section>
        <section className="section story-panel" id="pipeline" data-section="pipeline" aria-labelledby="pipeline-title">
          <div className="section__inner">
            <p className="eyebrow">Pipeline</p>
            <h2 id="pipeline-title">从问题、AI、硬件到 Demo 的工作流。</h2>
            <div className="pipeline-list">
              {pipelineSteps.map((step) => (
                <article className="pipeline-step" key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className="tag-row" aria-label={`${step.title} tags`}>
                    {step.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section story-panel" id="links" data-section="links" aria-labelledby="links-title">
          <div className="section__inner section__inner--narrow">
            <p className="eyebrow">Links</p>
            <h2 id="links-title">继续看我正在做的东西。</h2>
            <div className="link-row">
              {links.map((link) => (
                <a className="text-button" href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
