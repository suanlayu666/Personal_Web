import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HudBadge } from "../components/HudBadge";
import { ProjectCard } from "../components/ProjectCard";
import { SiteNav } from "../components/SiteNav";
import { navSections, sectionStates } from "../data/sections";
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
