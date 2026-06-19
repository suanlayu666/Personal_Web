import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HudBadge } from "../components/HudBadge";
import { LinksPanel } from "../components/LinksPanel";
import { PipelineSection } from "../components/PipelineSection";
import { ProjectCard } from "../components/ProjectCard";
import { SiteNav } from "../components/SiteNav";
import { WorksSection } from "../components/WorksSection";
import { links, featuredRepos } from "../data/links";
import { navSections, pipelineSteps, sectionStates } from "../data/sections";
import { projects } from "../data/projects";

describe("navigation and HUD components", () => {
  it("renders navigation anchors", () => {
    render(<SiteNav sections={navSections} activeSection="intro" />);
    expect(screen.getByRole("link", { name: "Works" })).toHaveAttribute("href", "#works");
    expect(screen.getByRole("link", { name: "Pipeline" })).toHaveAttribute("href", "#pipeline");
  });

  it("renders active HUD state", () => {
    render(<HudBadge state={sectionStates[2]} />);
    expect(screen.getByText("WORKS")).toBeInTheDocument();
    expect(screen.getByText("STM32 · AI App · Prototype")).toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  it("expands highlights on click", () => {
    render(<ProjectCard project={projects[0]} />);
    expect(screen.queryByText(projects[0].highlights[0])).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /展开项目亮点/ }));
    expect(screen.getByText(projects[0].highlights[0])).toBeInTheDocument();
  });
});

describe("content sections", () => {
  it("renders all selected works", () => {
    render(<WorksSection projects={projects} />);
    expect(screen.getByRole("heading", { name: "STM32 平衡车" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "UniFlow Lab" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Never Forget" })).toBeInTheDocument();
  });

  it("renders the prototype pipeline", () => {
    render(<PipelineSection steps={pipelineSteps} />);
    expect(screen.getByRole("heading", { name: "Frame" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sense & Control" })).toBeInTheDocument();
  });

  it("renders public links and featured repos", () => {
    render(<LinksPanel links={links} featuredRepos={featuredRepos} />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/suanlayu666");
    expect(screen.getByRole("link", { name: "Never Forget" })).toHaveAttribute(
      "href",
      "https://github.com/suanlayu666/Never_Forget_App",
    );
    expect(screen.queryByText(/Download CV/i)).not.toBeInTheDocument();
  });
});
