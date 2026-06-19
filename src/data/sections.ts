import type { PipelineStep, SectionState } from "../types/content";

export const sectionStates: SectionState[] = [
  {
    id: "hero",
    navLabel: "Intro",
    hudCode: "BOOT",
    hudMeta: "Build What You Want",
  },
  {
    id: "intro",
    navLabel: "Intro",
    hudCode: "INTRO",
    hudMeta: "Wuhan · EE · Explorer",
  },
  {
    id: "works",
    navLabel: "Works",
    hudCode: "WORKS",
    hudMeta: "STM32 · AI App · Prototype",
  },
  {
    id: "pipeline",
    navLabel: "Pipeline",
    hudCode: "PIPELINE",
    hudMeta: "Frame · AI · Control · Demo",
  },
  {
    id: "links",
    navLabel: "Links",
    hudCode: "LINKS",
    hudMeta: "GitHub · Email · Repos",
  },
];

export const navSections = [
  { id: "intro", label: "简介" },
  { id: "works", label: "作品" },
  { id: "pipeline", label: "路线" },
  { id: "links", label: "联系" },
] as const;

export const pipelineSteps: PipelineStep[] = [
  {
    title: "Frame",
    description: "从问题和场景出发，拆解需求，确定原型要验证什么。",
    tags: ["Problem Framing", "User Scenario", "Product Thinking", "Prototype Goal"],
  },
  {
    title: "Think with AI",
    description: "使用大模型 API、Prompt 和 Agent 交互设计，把 AI 能力组织成可用流程。",
    tags: ["GPT", "Claude", "DeepSeek", "Prompt Design", "Agent Interaction", "Context Engineering"],
  },
  {
    title: "Sense & Control",
    description: "通过 STM32、传感器和电机控制，让系统获得真实世界的输入和输出能力。",
    tags: ["STM32", "GPIO", "PWM", "UART", "IIC", "Sensor", "Motor Control"],
  },
  {
    title: "Build Demo",
    description: "将想法做成可运行 Demo，通过代码、调试和迭代验证方向。",
    tags: ["C", "C++", "GitHub", "VS Code", "Rapid Demo", "Debugging"],
  },
];
