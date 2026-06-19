import type { Project } from "../types/content";
import { ProjectCard } from "./ProjectCard";

type WorksSectionProps = {
  projects: Project[];
};

export function WorksSection({ projects }: WorksSectionProps) {
  return (
    <section className="section story-panel" id="works" data-section="works" aria-labelledby="works-title">
      <div className="section__inner">
        <p className="eyebrow">Works</p>
        <h2 id="works-title">Selected prototypes</h2>
        <p className="section-lead">四个项目分别覆盖真实物理控制、信息聚合、传感器运动控制和 AI 应用原型。</p>
        <div className="works-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
