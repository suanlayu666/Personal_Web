import { useState, type CSSProperties, type MouseEvent } from "react";
import type { Project } from "../types/content";

type ProjectFolderProps = {
  projects: Project[];
  color?: string;
  size?: number;
  className?: string;
};

type PaperOffset = {
  x: number;
  y: number;
};

type CssVars = CSSProperties & Record<`--${string}`, string>;

const maxItems = 4;

function darkenColor(hex: string, percent: number) {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;

  if (color.length === 3) {
    color = color
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const num = Number.parseInt(color, 16);
  const r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 0xff) * (1 - percent))));
  const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 0xff) * (1 - percent))));
  const b = Math.max(0, Math.min(255, Math.floor((num & 0xff) * (1 - percent))));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function ProjectFolder({ projects, color = "#163847", size = 1, className = "" }: ProjectFolderProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paperOffsets, setPaperOffsets] = useState<PaperOffset[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })),
  );

  const papers: Array<Project | null> = projects.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const activeProject = projects[activeIndex] ?? projects[0];

  if (!activeProject) {
    return null;
  }

  const folderStyle: CssVars = {
    "--folder-color": color,
    "--folder-back-color": darkenColor(color, 0.36),
    "--paper-1": "rgba(7, 17, 27, 0.9)",
    "--paper-2": "rgba(9, 22, 33, 0.9)",
    "--paper-3": "rgba(6, 14, 24, 0.92)",
    "--paper-4": "rgba(10, 19, 30, 0.92)",
  };
  const scaleStyle: CSSProperties = { transform: `scale(${size})` };

  const resetPaperOffsets = () => {
    setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
  };

  const handleFolderClick = () => {
    setOpen((previous) => {
      if (previous) {
        resetPaperOffsets();
      }

      return !previous;
    });
  };

  const handlePaperSelect = (index: number) => {
    setOpen(true);
    setActiveIndex(index);
  };

  const handlePaperMouseMove = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    if (!open) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (event.clientX - centerX) * 0.15;
    const offsetY = (event.clientY - centerY) * 0.15;

    setPaperOffsets((previous) => {
      const next = [...previous];
      next[index] = { x: offsetX, y: offsetY };
      return next;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets((previous) => {
      const next = [...previous];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

  const rootClassName = ["project-folder", className].filter(Boolean).join(" ");
  const folderClassName = `folder ${open ? "open" : ""}`.trim();

  return (
    <div className={rootClassName}>
      <div className="project-folder__stage">
        <div className="project-folder__scale" style={scaleStyle}>
          <div className={folderClassName} style={folderStyle}>
            <div className="folder__back">
              {papers.map((project, index) => {
                const paperStyle: CssVars = open
                  ? {
                      "--magnet-x": `${paperOffsets[index]?.x ?? 0}px`,
                      "--magnet-y": `${paperOffsets[index]?.y ?? 0}px`,
                    }
                  : {};
                const isActive = project ? projects[activeIndex]?.title === project.title : false;

                return (
                  <button
                    className={`paper paper-${index + 1} ${isActive ? "paper--active" : ""}`.trim()}
                    disabled={!project}
                    key={project?.title ?? `empty-paper-${index}`}
                    type="button"
                    aria-label={project ? `查看项目纸片：${project.title}` : "空项目纸片"}
                    aria-pressed={isActive}
                    onClick={() => {
                      if (project) {
                        handlePaperSelect(index);
                      }
                    }}
                    onMouseMove={(event) => handlePaperMouseMove(event, index)}
                    onMouseLeave={() => handlePaperMouseLeave(index)}
                    style={paperStyle}
                  >
                    {project ? (
                      <>
                        <span className="paper__index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="paper__subtitle">{project.subtitle}</span>
                        <h3>{project.title}</h3>
                        <span className="paper__summary">{project.summary}</span>
                      </>
                    ) : null}
                  </button>
                );
              })}
              <div className="folder__front" />
              <div className="folder__front right" />
            </div>
            <button
              className="folder__toggle"
              type="button"
              aria-label="打开项目文件夹，点击可收回"
              aria-expanded={open}
              aria-controls="project-folder-detail"
              onClick={handleFolderClick}
            />
          </div>
        </div>
      </div>

      <aside className="project-folder__detail" id="project-folder-detail" aria-live="polite">
        <p className="project-folder__detail-kicker">{activeProject.role}</p>
        <strong className="project-folder__detail-title">{activeProject.title}</strong>
        <p>{activeProject.summary}</p>
        <div className="tag-row" aria-label={`${activeProject.title} technology tags`}>
          {activeProject.tags.slice(0, 5).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <ul className="project-folder__highlights">
          {activeProject.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        {activeProject.repo ? (
          <a className="project-card__repo" href={activeProject.repo} target="_blank" rel="noreferrer">
            View Repo
          </a>
        ) : null}
      </aside>
    </div>
  );
}
