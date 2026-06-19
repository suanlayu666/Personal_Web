import { describe, expect, it } from "vitest";
import { links, featuredRepos } from "../data/links";
import { projects } from "../data/projects";
import { sectionStates } from "../data/sections";

describe("content data", () => {
  it("keeps the selected project order", () => {
    expect(projects.map((project) => project.title)).toEqual([
      "STM32 平衡车",
      "UniFlow Lab",
      "蓝牙遥控避障小车",
      "Never Forget",
    ]);
  });

  it("exposes public links without phone or CV download", () => {
    expect(links.map((link) => link.label)).toEqual(["GitHub", "Email"]);
    expect(links.some((link) => /phone|tel|cv|resume/i.test(link.href))).toBe(false);
  });

  it("uses known repository links only", () => {
    expect(featuredRepos).toEqual([
      {
        label: "蓝牙遥控避障小车",
        href: "https://github.com/suanlayu666/DoubleDriverCar",
        kind: "repo",
      },
      {
        label: "Never Forget",
        href: "https://github.com/suanlayu666/Never_Forget_App",
        kind: "repo",
      },
    ]);
  });

  it("defines HUD states for each visible navigation section", () => {
    expect(sectionStates.map((section) => section.id)).toEqual([
      "hero",
      "intro",
      "works",
      "pipeline",
      "links",
    ]);
  });
});
