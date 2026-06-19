import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "../components/HeroSection";
import { HudBadge } from "../components/HudBadge";
import { IntroSection } from "../components/IntroSection";
import { LinksPanel } from "../components/LinksPanel";
import { PipelineSection } from "../components/PipelineSection";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectFolder } from "../components/ProjectFolder";
import { SiteNav } from "../components/SiteNav";
import { WorksSection } from "../components/WorksSection";
import { links, featuredRepos } from "../data/links";
import { navSections, pipelineSteps, sectionStates } from "../data/sections";
import { projects } from "../data/projects";

function expectScrollFloatHeading(name: string) {
  const heading = screen.getByRole("heading", { name });
  const scrollFloat = heading.closest(".scroll-float");
  expect(scrollFloat).toBeInTheDocument();
  expect(scrollFloat).toHaveClass("scroll-float--shiny");
  expect(scrollFloat?.querySelector(".scroll-float__shine")).toBeInTheDocument();
  expect(heading.querySelectorAll(".scroll-float__char").length).toBeGreaterThan(1);
}

describe("HeroSection", () => {
  it("renders the hero slogan with gradient text and clean Chinese copy", () => {
    const { container } = render(<HeroSection />);
    const heading = screen.getByRole("heading", { name: "Build What You Want." });

    expect(heading).toBeInTheDocument();
    expect(heading.closest(".animated-gradient-text")).toBeInTheDocument();
    expect(screen.getByText("做你想做的")).toBeInTheDocument();
    expect(screen.getByText("酸辣鱼 / SuanLayu")).toBeInTheDocument();
    expect(container.querySelector(".animated-gradient-text__content")).toHaveTextContent("Build What You Want.");
  });
});

describe("navigation and HUD components", () => {
  it("renders navigation anchors", () => {
    const { container } = render(<SiteNav sections={navSections} activeSection="intro" />);
    expect(container.querySelector(".site-nav--pill")).toBeInTheDocument();
    expect(screen.getByLabelText("Back to intro")).toHaveTextContent("SLY");
    expect(screen.getByRole("link", { name: "简介" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "作品" })).toHaveAttribute("href", "#works");
    expect(screen.getByRole("link", { name: "路线" })).toHaveAttribute("href", "#pipeline");
  });

  it("renders active profile HUD state", () => {
    const { container } = render(<HudBadge state={sectionStates[2]} />);
    expect(container.querySelector(".profile-card")).toBeInTheDocument();
    expect(container.querySelector(".profile-card__portrait")).toBeInTheDocument();
    expect(container.querySelector(".profile-card__glyph")).toBeInTheDocument();
    expect(container.querySelector(".profile-card__chip")).toBeInTheDocument();
    expect(container.querySelectorAll(".profile-card__pixel-mark").length).toBe(3);
    expect(screen.getByText("酸辣鱼")).toBeInTheDocument();
    expect(screen.getByText("SuanLayu")).toBeInTheDocument();
    expect(screen.getByText("@suanlayu666")).toBeInTheDocument();
    expect(screen.getByText("Build What You Want.")).toBeInTheDocument();
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

describe("ProjectFolder", () => {
  it("renders a template-style folder with four project papers", () => {
    const { container } = render(<ProjectFolder projects={projects} />);

    expect(container.querySelector(".project-folder")).toBeInTheDocument();
    expect(container.querySelector(".folder")).toBeInTheDocument();
    expect(container.querySelector(".folder__back")).toBeInTheDocument();
    expect(container.querySelectorAll(".folder__front").length).toBe(2);
    expect(container.querySelectorAll(".paper").length).toBe(4);
    expect(screen.getByRole("button", { name: /打开项目文件夹/ })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("项目文件夹")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /查看项目纸片：STM32 平衡车/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /查看项目纸片：UniFlow Lab/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /查看项目纸片：蓝牙遥控避障小车/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /查看项目纸片：Never Forget/ })).toBeInTheDocument();
  });

  it("opens the folder and reveals the selected project highlights", () => {
    const { container } = render(<ProjectFolder projects={projects} />);

    fireEvent.click(screen.getByRole("button", { name: /打开项目文件夹/ }));
    fireEvent.click(screen.getByRole("button", { name: /查看项目纸片：UniFlow Lab/ }));

    expect(container.querySelector(".folder")).toHaveClass("open");
    expect(screen.getByRole("button", { name: /打开项目文件夹/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(projects[1].highlights[0])).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /查看项目纸片：UniFlow Lab/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles the project cards back into the folder when the folder is clicked again", () => {
    const { container } = render(<ProjectFolder projects={projects} />);
    const folderButton = screen.getByRole("button", { name: /打开项目文件夹/ });

    fireEvent.click(folderButton);
    expect(container.querySelector(".folder")).toHaveClass("open");
    expect(folderButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(folderButton);
    expect(container.querySelector(".folder")).not.toHaveClass("open");
    expect(folderButton).toHaveAttribute("aria-expanded", "false");
  });
});

describe("content sections", () => {
  it("renders scroll-float headings for the narrative sections", () => {
    render(
      <>
        <IntroSection />
        <WorksSection projects={projects} />
        <PipelineSection steps={pipelineSteps} />
        <LinksPanel links={links} featuredRepos={featuredRepos} />
      </>,
    );

    expectScrollFloatHeading("我正在探索 AI 如何连接真实世界。");
    expectScrollFloatHeading("精选项目");
    expectScrollFloatHeading("从想法到可运行 Demo");
    expectScrollFloatHeading("保持连接");
  });

  it("renders all selected works", () => {
    const { container } = render(<WorksSection projects={projects} />);
    expect(container.querySelector(".project-folder")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "STM32 平衡车" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "UniFlow Lab" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "Never Forget" }).length).toBeGreaterThan(0);
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
