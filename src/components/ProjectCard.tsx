import { useState } from "react";
import type { Project } from "../types/content";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="project-card">
      <div className="project-card__body">
        <p className="project-card__subtitle">{project.subtitle}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <p className="project-card__role">{project.role}</p>
        <div className="tag-row" aria-label={`${project.title} technology tags`}>
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <button
          className="text-button"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "收起项目亮点" : "展开项目亮点"}
        </button>
        {expanded ? (
          <ul className="project-card__highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
        {project.repo ? (
          <a className="project-card__repo" href={project.repo} target="_blank" rel="noreferrer">
            View Repo
          </a>
        ) : null}
      </div>
    </article>
  );
}
