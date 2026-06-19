# SuanLayu Personal Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `D:\VScode\Personal_Web` 中构建一个可部署到 GitHub Pages 的 React + Vite + GSAP 单页个人网站，用视频序列帧滚动叙事展示“酸辣鱼 / SuanLayu”的 Intro、Works、Pipeline 和 Links。

**Architecture:** 项目使用 React 组件承载内容层，Canvas 承载序列帧背景，GSAP ScrollTrigger 负责滚动进度和章节状态同步。视频帧通过本地 Node 脚本从 `vedio.mp4` 抽取为 `public/frames` 下的 WebP 文件，前端通过生成的 frame manifest 加载桌面端和移动端帧资源。

**Tech Stack:** React 19, Vite 7, TypeScript, GSAP, Vitest, React Testing Library, Playwright, ffmpeg-static, GitHub Pages.

---

## 0. 当前项目事实与执行约定

### 当前文件

- `D:\VScode\Personal_Web\vedio.mp4`：现有主视觉视频，约 10.6 MB。
- `D:\VScode\Personal_Web\MinerU_markdown_202606182009265_5c54d6db.md`：简历参考内容，终端默认编码显示会乱码，站点文案以设计文档中的整理版为准。
- `D:\VScode\Personal_Web\docs\personal-web-design.md`：已确认的详细设计文档。

### 当前环境

- `node -v` 已确认可用：`v24.15.0`。
- PowerShell 直接运行 `npm` 会被执行策略拦截，实施时使用 `npm.cmd`。
- 系统 PATH 中未发现 `ffmpeg`，视频抽帧使用 npm 包 `ffmpeg-static`。
- `D:\VScode\Personal_Web` 当前不是 git 仓库。

### 命令约定

所有命令默认工作目录：

```powershell
D:\VScode\Personal_Web
```

PowerShell 中运行 npm 统一使用：

```powershell
npm.cmd <args>
```

---

## 1. 文件结构规划

### 计划创建的文件

- `D:\VScode\Personal_Web\.gitignore`：忽略依赖、构建产物、测试产物和人工截图。
- `D:\VScode\Personal_Web\package.json`：项目依赖、脚本、测试命令。
- `D:\VScode\Personal_Web\index.html`：Vite HTML 入口。
- `D:\VScode\Personal_Web\tsconfig.json`：TypeScript 项目配置。
- `D:\VScode\Personal_Web\tsconfig.node.json`：Node 工具和 Vite 配置的 TypeScript 配置。
- `D:\VScode\Personal_Web\vite.config.ts`：Vite、Vitest、GitHub Pages relative base 配置。
- `D:\VScode\Personal_Web\playwright.config.ts`：端到端和截图验证配置。
- `D:\VScode\Personal_Web\vitest.setup.ts`：React Testing Library 测试环境。
- `D:\VScode\Personal_Web\scripts\extract-frames.mjs`：使用 `ffmpeg-static` 抽取 WebP 序列帧并生成 manifest。
- `D:\VScode\Personal_Web\src\main.tsx`：React 入口。
- `D:\VScode\Personal_Web\src\App.tsx`：页面总装、滚动章节、GSAP 状态同步。
- `D:\VScode\Personal_Web\src\styles\tokens.css`：颜色、尺寸、字体变量。
- `D:\VScode\Personal_Web\src\styles\global.css`：全局布局、响应式、动效和 reduced motion。
- `D:\VScode\Personal_Web\src\types\content.ts`：内容数据类型。
- `D:\VScode\Personal_Web\src\data\projects.ts`：4 个项目数据。
- `D:\VScode\Personal_Web\src\data\links.ts`：GitHub、Email、Featured Repos 数据。
- `D:\VScode\Personal_Web\src\data\sections.ts`：章节和 HUD 状态数据。
- `D:\VScode\Personal_Web\src\data\frameManifest.generated.ts`：抽帧脚本生成的帧数量清单，首次实现时提供可编译初始值。
- `D:\VScode\Personal_Web\src\lib\framePaths.ts`：根据 manifest 生成帧 URL。
- `D:\VScode\Personal_Web\src\lib\canvasDraw.ts`：Canvas cover 绘制尺寸计算。
- `D:\VScode\Personal_Web\src\lib\preloadFrames.ts`：分批预加载图片。
- `D:\VScode\Personal_Web\src\components\FrameCanvas.tsx`：固定背景 Canvas。
- `D:\VScode\Personal_Web\src\components\SiteNav.tsx`：顶部导航。
- `D:\VScode\Personal_Web\src\components\HudBadge.tsx`：右下角 HUD 遮水印和章节状态。
- `D:\VScode\Personal_Web\src\components\HeroSection.tsx`：首屏标语。
- `D:\VScode\Personal_Web\src\components\IntroSection.tsx`：个人介绍。
- `D:\VScode\Personal_Web\src\components\WorksSection.tsx`：项目列表。
- `D:\VScode\Personal_Web\src\components\ProjectCard.tsx`：可展开项目卡片。
- `D:\VScode\Personal_Web\src\components\PipelineSection.tsx`：能力链路。
- `D:\VScode\Personal_Web\src\components\LinksPanel.tsx`：公开链接区。
- `D:\VScode\Personal_Web\src\components\ScrollProgress.tsx`：轻量滚动进度条。
- `D:\VScode\Personal_Web\src\test\content.test.ts`：内容数据测试。
- `D:\VScode\Personal_Web\src\test\framePaths.test.ts`：帧路径测试。
- `D:\VScode\Personal_Web\src\test\canvasDraw.test.ts`：Canvas cover 计算测试。
- `D:\VScode\Personal_Web\src\test\components.test.tsx`：组件行为测试。
- `D:\VScode\Personal_Web\tests\e2e\home.spec.ts`：浏览器端主流程测试。
- `D:\VScode\Personal_Web\.github\workflows\deploy.yml`：GitHub Pages 构建部署流程。

### 锚点约定

- 导航 `Intro` 指向 `#intro`，也就是 Hero 首屏，因为首屏承担 Intro 入口功能。
- 详细个人介绍段使用 `id="intro-detail"`，但 `data-section="intro"`，用于 HUD 状态同步。
- `Works`、`Pipeline`、`Links` 分别指向 `#works`、`#pipeline`、`#links`。

### 计划生成的目录

- `D:\VScode\Personal_Web\public\frames\desktop`：桌面端 WebP 序列帧。
- `D:\VScode\Personal_Web\public\frames\mobile`：移动端 WebP 序列帧。

---

## Task 1: 初始化 git、Vite、TypeScript、测试和基础入口

**Files:**
- Create: `D:\VScode\Personal_Web\.gitignore`
- Create: `D:\VScode\Personal_Web\package.json`
- Create: `D:\VScode\Personal_Web\index.html`
- Create: `D:\VScode\Personal_Web\tsconfig.json`
- Create: `D:\VScode\Personal_Web\tsconfig.node.json`
- Create: `D:\VScode\Personal_Web\vite.config.ts`
- Create: `D:\VScode\Personal_Web\playwright.config.ts`
- Create: `D:\VScode\Personal_Web\vitest.setup.ts`
- Create: `D:\VScode\Personal_Web\src\main.tsx`
- Create: `D:\VScode\Personal_Web\src\App.tsx`
- Create: `D:\VScode\Personal_Web\src\styles\tokens.css`
- Create: `D:\VScode\Personal_Web\src\styles\global.css`
- Test: `npm.cmd run build`

- [ ] **Step 1: 初始化 git 仓库**

Run:

```powershell
git init
```

Expected:

```text
Initialized empty Git repository in D:/VScode/Personal_Web/.git/
```

- [ ] **Step 2: 创建 `.gitignore`**

Create `D:\VScode\Personal_Web\.gitignore`:

```gitignore
node_modules/
dist/
.vite/
coverage/
playwright-report/
test-results/
screenshots/
*.log
.DS_Store
Thumbs.db
```

- [ ] **Step 3: 创建 `package.json`**

Create `D:\VScode\Personal_Web\package.json`:

```json
{
  "name": "suanlayu-personal-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "frames": "node scripts/extract-frames.mjs",
    "frames:dry": "node scripts/extract-frames.mjs --dry-run"
  },
  "dependencies": {
    "gsap": "^3.13.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "vite": "^7.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "@playwright/test": "^1.54.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^24.0.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "ffmpeg-static": "^5.2.0",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 4: 创建 TypeScript 和 Vite 配置**

Create `D:\VScode\Personal_Web\tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "vite.config.ts", "playwright.config.ts", "vitest.setup.ts"]
}
```

Create `D:\VScode\Personal_Web\tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts", "playwright.config.ts"]
}
```

Create `D:\VScode\Personal_Web\vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: true,
    globals: true,
  },
});
```

Create `D:\VScode\Personal_Web\vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `D:\VScode\Personal_Web\playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm.cmd run preview -- --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
```

- [ ] **Step 5: 创建 HTML 和 React 最小入口**

Create `D:\VScode\Personal_Web\index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="酸辣鱼 / SuanLayu 的个人网站，展示 AI 原型、嵌入式系统、Physical AI 和精选项目。"
    />
    <title>酸辣鱼 / SuanLayu</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `D:\VScode\Personal_Web\src\main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `D:\VScode\Personal_Web\src\App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="section section--hero" id="intro">
        <p className="eyebrow">酸辣鱼 / SuanLayu</p>
        <h1>Build What You Want.</h1>
        <p className="hero-cn">做你想做的</p>
        <p className="hero-tags">AI Prototype · Embedded Systems · Physical AI</p>
      </section>
    </main>
  );
}
```

Create `D:\VScode\Personal_Web\src\styles\tokens.css`:

```css
:root {
  color-scheme: dark;
  --color-bg: #05070a;
  --color-panel: rgba(7, 12, 18, 0.58);
  --color-text: #f3f7fa;
  --color-muted: #aab7c4;
  --color-blue: #56b8ff;
  --color-cyan: #7ce7ff;
  --color-gold: #d8b45a;
  --color-line: rgba(255, 255, 255, 0.14);
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
  --content-max: 1180px;
  --section-pad-x: clamp(20px, 4vw, 72px);
}
```

Create `D:\VScode\Personal_Web\src\styles\global.css`:

```css
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background: var(--color-bg);
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

a {
  color: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at 50% 20%, rgba(86, 184, 255, 0.12), transparent 34%),
    var(--color-bg);
}

.section {
  min-height: 100vh;
  padding: 96px var(--section-pad-x);
  display: grid;
  align-items: center;
}

.section--hero {
  max-width: var(--content-max);
  margin: 0 auto;
}

.eyebrow,
.hero-tags {
  color: var(--color-muted);
  letter-spacing: 0;
}

h1 {
  margin: 0;
  font-size: clamp(48px, 8vw, 112px);
  line-height: 0.95;
  letter-spacing: 0;
}

.hero-cn {
  margin: 18px 0 0;
  color: var(--color-cyan);
  font-size: clamp(20px, 3vw, 34px);
}

.hero-tags {
  margin-top: 28px;
  font-size: 15px;
}
```

- [ ] **Step 6: 安装依赖**

Run:

```powershell
npm.cmd install
```

Expected:

```text
added ... packages
```

- [ ] **Step 7: 验证初始构建**

Run:

```powershell
npm.cmd run build
```

Expected:

```text
vite v...
✓ built in ...
```

- [ ] **Step 8: 提交基础工程**

Run:

```powershell
git add .gitignore package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts playwright.config.ts vitest.setup.ts src
git commit -m "chore: initialize personal web app"
```

Expected:

```text
[main ...] chore: initialize personal web app
```

---

## Task 2: 建立内容类型、项目数据、链接数据和章节数据

**Files:**
- Create: `D:\VScode\Personal_Web\src\types\content.ts`
- Create: `D:\VScode\Personal_Web\src\data\projects.ts`
- Create: `D:\VScode\Personal_Web\src\data\links.ts`
- Create: `D:\VScode\Personal_Web\src\data\sections.ts`
- Create: `D:\VScode\Personal_Web\src\test\content.test.ts`
- Test: `npm.cmd run test -- src/test/content.test.ts`

- [ ] **Step 1: 写内容数据的失败测试**

Create `D:\VScode\Personal_Web\src\test\content.test.ts`:

```ts
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
      },
      {
        label: "Never Forget",
        href: "https://github.com/suanlayu666/Never_Forget_App",
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
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
npm.cmd run test -- src/test/content.test.ts
```

Expected:

```text
FAIL src/test/content.test.ts
Cannot find module '../data/links'
```

- [ ] **Step 3: 创建内容类型**

Create `D:\VScode\Personal_Web\src\types\content.ts`:

```ts
export type ProjectStatus = "featured" | "normal";

export type Project = {
  title: string;
  subtitle: string;
  role: string;
  summary: string;
  tags: string[];
  highlights: string[];
  repo?: string;
  cover?: string;
  status: ProjectStatus;
};

export type PublicLink = {
  label: string;
  href: string;
  kind: "github" | "email" | "repo";
};

export type SectionId = "hero" | "intro" | "works" | "pipeline" | "links";

export type SectionState = {
  id: SectionId;
  navLabel: string;
  hudCode: string;
  hudMeta: string;
};

export type PipelineStep = {
  title: string;
  description: string;
  tags: string[];
};
```

- [ ] **Step 4: 创建项目数据**

Create `D:\VScode\Personal_Web\src\data\projects.ts`:

```ts
import type { Project } from "../types/content";

export const projects: Project[] = [
  {
    title: "STM32 平衡车",
    subtitle: "Embedded control prototype",
    role: "独立开发 / 嵌入式控制开发",
    summary: "基于 STM32 完成平衡车原型，围绕姿态感知、电机控制、参数调试和控制反馈进行开发。",
    tags: ["STM32", "PWM", "Motor Control", "Sensor", "Debugging"],
    highlights: [
      "通过真实物理系统理解重力、惯性、传感器误差和电机响应延迟。",
      "完成姿态感知、控制反馈、参数调试等基础链路。",
      "强化对 Physical AI 中“感知 - 决策 - 执行”闭环的兴趣。",
    ],
    status: "featured",
  },
  {
    title: "UniFlow Lab",
    subtitle: "Information aggregation prototype",
    role: "独立开发 / 产品原型开发",
    summary: "面向信息获取和整理场景，设计信息聚合应用原型，通过 API 数据流完成信息输入、筛选、聚合和展示。",
    tags: ["Product Prototype", "API Flow", "Information Design", "AI App"],
    highlights: [
      "从用户信息整理场景出发拆解产品流程。",
      "关注信息输入、筛选、聚合和展示之间的数据链路。",
      "将软件数据链路思维迁移到未来 AIoT / Physical AI 方向。",
    ],
    status: "featured",
  },
  {
    title: "蓝牙遥控避障小车",
    subtitle: "STM32 sensing and control prototype",
    role: "核心开发 / 嵌入式开发",
    summary: "使用 STM32、传感器和电机驱动模块，实现蓝牙遥控、运动控制和基础避障能力。",
    tags: ["STM32", "GPIO", "PWM", "UART", "IIC", "Ultrasonic Sensor", "Bluetooth"],
    highlights: [
      "接入超声波、温度等传感器，完成基础环境感知。",
      "使用 PWM 控制电机速度和运动状态。",
      "积累软硬件联调、传感器接入和运动控制经验。",
    ],
    repo: "https://github.com/suanlayu666/DoubleDriverCar",
    status: "normal",
  },
  {
    title: "Never Forget",
    subtitle: "AI screen understanding prototype",
    role: "独立开发 / AI 应用原型开发",
    summary: "面向截图和屏幕信息难以整理复盘的问题，调用大模型 API 对图像内容进行识别、总结和信息沉淀。",
    tags: ["AI API", "Image Input", "Summary", "Product Loop", "Prototype"],
    highlights: [
      "完成从图片输入到模型识别、结果展示的基础流程。",
      "训练将 AI 能力落地为具体应用的产品思维。",
      "关注信息沉淀、复盘和用户使用闭环。",
    ],
    repo: "https://github.com/suanlayu666/Never_Forget_App",
    status: "normal",
  },
];
```

- [ ] **Step 5: 创建链接数据**

Create `D:\VScode\Personal_Web\src\data\links.ts`:

```ts
import type { Project, PublicLink } from "../types/content";
import { projects } from "./projects";

export const links: PublicLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/suanlayu666",
    kind: "github",
  },
  {
    label: "Email",
    href: "mailto:202521111421@mail.scuec.edu.cn",
    kind: "email",
  },
];

export const featuredRepos: PublicLink[] = projects
  .filter((project): project is Project & { repo: string } => Boolean(project.repo))
  .map((project) => ({
    label: project.title,
    href: project.repo,
    kind: "repo",
  }));
```

- [ ] **Step 6: 创建章节和 Pipeline 数据**

Create `D:\VScode\Personal_Web\src\data\sections.ts`:

```ts
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
  { id: "intro", label: "Intro" },
  { id: "works", label: "Works" },
  { id: "pipeline", label: "Pipeline" },
  { id: "links", label: "Links" },
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
```

- [ ] **Step 7: 运行内容测试**

Run:

```powershell
npm.cmd run test -- src/test/content.test.ts
```

Expected:

```text
PASS src/test/content.test.ts
```

- [ ] **Step 8: 提交内容数据**

Run:

```powershell
git add src/types src/data src/test/content.test.ts
git commit -m "feat: add personal site content data"
```

Expected:

```text
[main ...] feat: add personal site content data
```

---

## Task 3: 建立序列帧路径、Canvas cover 计算和预加载工具

**Files:**
- Create: `D:\VScode\Personal_Web\src\data\frameManifest.generated.ts`
- Create: `D:\VScode\Personal_Web\src\lib\framePaths.ts`
- Create: `D:\VScode\Personal_Web\src\lib\canvasDraw.ts`
- Create: `D:\VScode\Personal_Web\src\lib\preloadFrames.ts`
- Create: `D:\VScode\Personal_Web\src\test\framePaths.test.ts`
- Create: `D:\VScode\Personal_Web\src\test\canvasDraw.test.ts`
- Test: `npm.cmd run test -- src/test/framePaths.test.ts src/test/canvasDraw.test.ts`

- [ ] **Step 1: 写帧路径和 Canvas 计算的失败测试**

Create `D:\VScode\Personal_Web\src\test\framePaths.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildFrameList, getFrameSrc } from "../lib/framePaths";

describe("framePaths", () => {
  it("builds padded frame urls with the Vite base url", () => {
    expect(getFrameSrc("desktop", 1, "/SuanLayu_Web/")).toBe("/SuanLayu_Web/frames/desktop/frame_0001.webp");
    expect(getFrameSrc("mobile", 23, "./")).toBe("./frames/mobile/frame_0023.webp");
  });

  it("builds a finite list for positive counts", () => {
    expect(buildFrameList("desktop", 3, "/")).toEqual([
      "/frames/desktop/frame_0001.webp",
      "/frames/desktop/frame_0002.webp",
      "/frames/desktop/frame_0003.webp",
    ]);
  });

  it("returns an empty list when no frames are available", () => {
    expect(buildFrameList("desktop", 0, "/")).toEqual([]);
  });
});
```

Create `D:\VScode\Personal_Web\src\test\canvasDraw.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getCoverDrawRect } from "../lib/canvasDraw";

describe("getCoverDrawRect", () => {
  it("covers a wide canvas with a tall source image", () => {
    expect(getCoverDrawRect(1920, 1080, 1080, 1920)).toEqual({
      dx: 0,
      dy: -1166.67,
      dw: 1920,
      dh: 3413.33,
    });
  });

  it("covers a tall canvas with a wide source image", () => {
    expect(getCoverDrawRect(390, 844, 1920, 1080)).toEqual({
      dx: -555.22,
      dy: 0,
      dw: 1500.44,
      dh: 844,
    });
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
npm.cmd run test -- src/test/framePaths.test.ts src/test/canvasDraw.test.ts
```

Expected:

```text
FAIL src/test/framePaths.test.ts
Cannot find module '../lib/framePaths'
```

- [ ] **Step 3: 创建初始 frame manifest**

Create `D:\VScode\Personal_Web\src\data\frameManifest.generated.ts`:

```ts
export const frameManifest = {
  desktop: {
    count: 0,
  },
  mobile: {
    count: 0,
  },
} as const;

export type FrameVariant = keyof typeof frameManifest;
```

- [ ] **Step 4: 创建帧路径工具**

Create `D:\VScode\Personal_Web\src\lib\framePaths.ts`:

```ts
import type { FrameVariant } from "../data/frameManifest.generated";

export function getFrameSrc(variant: FrameVariant, index: number, baseUrl = import.meta.env.BASE_URL) {
  const safeIndex = Math.max(1, Math.floor(index));
  const padded = String(safeIndex).padStart(4, "0");
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}frames/${variant}/frame_${padded}.webp`;
}

export function buildFrameList(variant: FrameVariant, count: number, baseUrl = import.meta.env.BASE_URL) {
  if (count <= 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => getFrameSrc(variant, index + 1, baseUrl));
}
```

- [ ] **Step 5: 创建 Canvas cover 计算工具**

Create `D:\VScode\Personal_Web\src\lib\canvasDraw.ts`:

```ts
export type DrawRect = {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function getCoverDrawRect(canvasWidth: number, canvasHeight: number, imageWidth: number, imageHeight: number): DrawRect {
  if (canvasWidth <= 0 || canvasHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return { dx: 0, dy: 0, dw: 0, dh: 0 };
  }

  const canvasRatio = canvasWidth / canvasHeight;
  const imageRatio = imageWidth / imageHeight;

  if (imageRatio > canvasRatio) {
    const dh = canvasHeight;
    const dw = dh * imageRatio;
    return {
      dx: round((canvasWidth - dw) / 2),
      dy: 0,
      dw: round(dw),
      dh: round(dh),
    };
  }

  const dw = canvasWidth;
  const dh = dw / imageRatio;

  return {
    dx: 0,
    dy: round((canvasHeight - dh) / 2),
    dw: round(dw),
    dh: round(dh),
  };
}
```

- [ ] **Step 6: 创建分批预加载工具**

Create `D:\VScode\Personal_Web\src\lib\preloadFrames.ts`:

```ts
export type PreloadResult = {
  loaded: HTMLImageElement[];
  failed: string[];
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

export async function preloadFrames(srcList: string[], batchSize = 8): Promise<PreloadResult> {
  const loaded: HTMLImageElement[] = [];
  const failed: string[] = [];

  for (let index = 0; index < srcList.length; index += batchSize) {
    const batch = srcList.slice(index, index + batchSize);
    const settled = await Promise.allSettled(batch.map((src) => loadImage(src)));

    settled.forEach((result, batchIndex) => {
      if (result.status === "fulfilled") {
        loaded.push(result.value);
      } else {
        failed.push(batch[batchIndex]);
      }
    });
  }

  return { loaded, failed };
}
```

- [ ] **Step 7: 运行测试**

Run:

```powershell
npm.cmd run test -- src/test/framePaths.test.ts src/test/canvasDraw.test.ts
```

Expected:

```text
PASS src/test/framePaths.test.ts
PASS src/test/canvasDraw.test.ts
```

- [ ] **Step 8: 提交序列帧工具**

Run:

```powershell
git add src/data/frameManifest.generated.ts src/lib src/test/framePaths.test.ts src/test/canvasDraw.test.ts
git commit -m "feat: add frame path and canvas utilities"
```

Expected:

```text
[main ...] feat: add frame path and canvas utilities
```

---

## Task 4: 实现视频抽帧脚本和 frame manifest 生成

**Files:**
- Create: `D:\VScode\Personal_Web\scripts\extract-frames.mjs`
- Modify: `D:\VScode\Personal_Web\src\data\frameManifest.generated.ts`
- Generate: `D:\VScode\Personal_Web\public\frames\desktop\frame_0001.webp` and more
- Generate: `D:\VScode\Personal_Web\public\frames\mobile\frame_0001.webp` and more
- Test: `npm.cmd run frames:dry`
- Test: `npm.cmd run frames`

- [ ] **Step 1: 创建抽帧脚本**

Create `D:\VScode\Personal_Web\scripts\extract-frames.mjs`:

```js
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import ffmpegPath from "ffmpeg-static";

const projectRoot = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const inputVideo = join(projectRoot, "vedio.mp4");
const publicDir = join(projectRoot, "public");
const framesRoot = join(publicDir, "frames");
const manifestPath = join(projectRoot, "src", "data", "frameManifest.generated.ts");
const dryRun = process.argv.includes("--dry-run");

const jobs = [
  {
    variant: "desktop",
    fps: 12,
    width: 1600,
    quality: 74,
  },
  {
    variant: "mobile",
    fps: 8,
    width: 960,
    quality: 70,
  },
];

function assertInsideProject(targetPath) {
  const resolved = resolve(targetPath);
  if (!resolved.toLowerCase().startsWith(projectRoot.toLowerCase())) {
    throw new Error(`Refusing to write outside project: ${resolved}`);
  }
}

function prepareDir(targetDir) {
  assertInsideProject(targetDir);
  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(targetDir, { recursive: true });
}

function runFfmpeg(job) {
  const outputDir = join(framesRoot, job.variant);
  prepareDir(outputDir);

  const outputPattern = join(outputDir, "frame_%04d.webp");
  const args = [
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    inputVideo,
    "-vf",
    `fps=${job.fps},scale=${job.width}:-2:flags=lanczos`,
    "-q:v",
    String(job.quality),
    outputPattern,
  ];

  const result = spawnSync(ffmpegPath, args, {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${job.variant}`);
  }

  return readdirSync(outputDir).filter((fileName) => /^frame_\d{4}\.webp$/.test(fileName)).length;
}

function writeManifest(counts) {
  const source = `export const frameManifest = {
  desktop: {
    count: ${counts.desktop},
  },
  mobile: {
    count: ${counts.mobile},
  },
} as const;

export type FrameVariant = keyof typeof frameManifest;
`;

  assertInsideProject(manifestPath);
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, source, "utf8");
}

if (!ffmpegPath) {
  throw new Error("ffmpeg-static did not provide an ffmpeg binary");
}

if (!existsSync(inputVideo)) {
  throw new Error(`Missing source video: ${inputVideo}`);
}

if (dryRun) {
  console.log(JSON.stringify({ projectRoot, inputVideo, jobs }, null, 2));
  process.exit(0);
}

mkdirSync(framesRoot, { recursive: true });

const counts = {};
for (const job of jobs) {
  counts[job.variant] = runFfmpeg(job);
}

writeManifest(counts);
console.log(JSON.stringify({ generated: counts }, null, 2));
```

- [ ] **Step 2: 运行 dry run 验证路径**

Run:

```powershell
npm.cmd run frames:dry
```

Expected:

```json
{
  "projectRoot": "D:\\VScode\\Personal_Web",
  "inputVideo": "D:\\VScode\\Personal_Web\\vedio.mp4",
  "jobs": [
    {
      "variant": "desktop",
      "fps": 12,
      "width": 1600,
      "quality": 74
    },
    {
      "variant": "mobile",
      "fps": 8,
      "width": 960,
      "quality": 70
    }
  ]
}
```

- [ ] **Step 3: 运行抽帧**

Run:

```powershell
npm.cmd run frames
```

Expected: JSON is printed with `generated.desktop` and `generated.mobile` both greater than `1`. The exact numbers depend on the video duration.

- [ ] **Step 4: 验证生成文件**

Run:

```powershell
Get-ChildItem public\frames\desktop -Filter *.webp | Select-Object -First 3 Name
Get-ChildItem public\frames\mobile -Filter *.webp | Select-Object -First 3 Name
Get-Content src\data\frameManifest.generated.ts
```

Expected:

```text
frame_0001.webp
frame_0002.webp
frame_0003.webp
export const frameManifest = {
  desktop: {
    count: <number greater than 1>,
  },
  mobile: {
    count: <number greater than 1>,
  },
} as const;
```

- [ ] **Step 5: 运行帧路径测试确认生成后的 manifest 不破坏类型**

Run:

```powershell
npm.cmd run test -- src/test/framePaths.test.ts
```

Expected:

```text
PASS src/test/framePaths.test.ts
```

- [ ] **Step 6: 提交抽帧脚本、manifest 和生成帧**

Run:

```powershell
git add scripts/extract-frames.mjs src/data/frameManifest.generated.ts public/frames
git commit -m "feat: add generated scroll frames"
```

Expected:

```text
[main ...] feat: add generated scroll frames
```

---

## Task 5: 实现背景 Canvas、HUD、导航和基础章节组件

**Files:**
- Create: `D:\VScode\Personal_Web\src\components\FrameCanvas.tsx`
- Create: `D:\VScode\Personal_Web\src\components\HudBadge.tsx`
- Create: `D:\VScode\Personal_Web\src\components\SiteNav.tsx`
- Create: `D:\VScode\Personal_Web\src\components\HeroSection.tsx`
- Create: `D:\VScode\Personal_Web\src\components\IntroSection.tsx`
- Create: `D:\VScode\Personal_Web\src\components\ScrollProgress.tsx`
- Create: `D:\VScode\Personal_Web\src\test\components.test.tsx`
- Test: `npm.cmd run test -- src/test/components.test.tsx`

- [ ] **Step 1: 写组件失败测试**

Create `D:\VScode\Personal_Web\src\test\components.test.tsx`:

```tsx
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
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
npm.cmd run test -- src/test/components.test.tsx
```

Expected:

```text
FAIL src/test/components.test.tsx
Cannot find module '../components/HudBadge'
```

- [ ] **Step 3: 创建导航组件**

Create `D:\VScode\Personal_Web\src\components\SiteNav.tsx`:

```tsx
import type { SectionId } from "../types/content";

type NavItem = {
  id: Exclude<SectionId, "hero">;
  label: string;
};

type SiteNavProps = {
  sections: readonly NavItem[];
  activeSection: SectionId;
};

export function SiteNav({ sections, activeSection }: SiteNavProps) {
  return (
    <nav className="site-nav" aria-label="Primary">
      <a className="site-nav__brand" href="#intro" aria-label="Back to intro">
        酸辣鱼
      </a>
      <div className="site-nav__links">
        {sections.map((section) => (
          <a
            key={section.id}
            className={activeSection === section.id ? "site-nav__link site-nav__link--active" : "site-nav__link"}
            href={`#${section.id}`}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: 创建 HUD 和进度组件**

Create `D:\VScode\Personal_Web\src\components\HudBadge.tsx`:

```tsx
import type { SectionState } from "../types/content";

type HudBadgeProps = {
  state: SectionState;
};

export function HudBadge({ state }: HudBadgeProps) {
  return (
    <aside className="hud-badge" aria-label="Current section">
      <span className="hud-badge__signal" aria-hidden="true" />
      <strong>{state.hudCode}</strong>
      <span>{state.hudMeta}</span>
    </aside>
  );
}
```

Create `D:\VScode\Personal_Web\src\components\ScrollProgress.tsx`:

```tsx
type ScrollProgressProps = {
  progress: number;
};

export function ScrollProgress({ progress }: ScrollProgressProps) {
  const width = `${Math.min(100, Math.max(0, progress * 100))}%`;

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span style={{ width }} />
    </div>
  );
}
```

- [ ] **Step 5: 创建首屏和 Intro 组件**

Create `D:\VScode\Personal_Web\src\components\HeroSection.tsx`:

```tsx
export function HeroSection() {
  return (
    <section className="section section--hero story-panel" id="intro" data-section="hero">
      <div className="section__inner hero-copy">
        <p className="eyebrow">酸辣鱼 / SuanLayu</p>
        <h1>Build What You Want.</h1>
        <p className="hero-cn">做你想做的</p>
        <p className="hero-tags">AI Prototype · Embedded Systems · Physical AI</p>
      </div>
    </section>
  );
}
```

Create `D:\VScode\Personal_Web\src\components\IntroSection.tsx`:

```tsx
export function IntroSection() {
  return (
    <section className="section story-panel" id="intro-detail" data-section="intro" aria-labelledby="intro-title">
      <div className="section__inner section__inner--narrow">
        <p className="eyebrow">Intro</p>
        <h2 id="intro-title">我正在探索 AI 如何连接真实世界。</h2>
        <p>
          我是酸辣鱼，来自武汉，就读于中南民族大学电子信息工程专业。我关注 AI 应用原型、嵌入式系统、
          AIoT / Physical AI，以及把想法快速做成可运行 Demo 的过程。
        </p>
        <p>
          对我来说，AI 不只停留在屏幕里的回答；它也可以进入传感器、电机、控制系统和真实环境，
          形成能感知、能反馈、能行动的原型。
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: 创建 FrameCanvas**

Create `D:\VScode\Personal_Web\src\components\FrameCanvas.tsx`:

```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { frameManifest, type FrameVariant } from "../data/frameManifest.generated";
import { getCoverDrawRect } from "../lib/canvasDraw";
import { buildFrameList } from "../lib/framePaths";
import { preloadFrames } from "../lib/preloadFrames";

type FrameCanvasProps = {
  progress: number;
};

function getVariant() {
  if (typeof window === "undefined") {
    return "desktop" satisfies FrameVariant;
  }

  return window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop";
}

export function FrameCanvas({ progress }: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [variant, setVariant] = useState<FrameVariant>(getVariant);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const frameList = useMemo(() => buildFrameList(variant, frameManifest[variant].count), [variant]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const syncVariant = () => setVariant(media.matches ? "mobile" : "desktop");
    syncVariant();
    media.addEventListener("change", syncVariant);
    return () => media.removeEventListener("change", syncVariant);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const result = await preloadFrames(frameList, 8);
      if (!cancelled) {
        setImages(result.loaded);
      }
    }

    if (frameList.length > 0) {
      void run();
    }

    return () => {
      cancelled = true;
    };
  }, [frameList]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const imageCount = images.length;

    if (!canvas || !context || imageCount === 0) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const frameIndex = Math.min(imageCount - 1, Math.max(0, Math.floor(progress * (imageCount - 1))));
    const image = images[frameIndex];
    const rect = getCoverDrawRect(width, height, image.naturalWidth, image.naturalHeight);
    context.drawImage(image, rect.dx, rect.dy, rect.dw, rect.dh);
  }, [images, progress]);

  return (
    <div className="frame-canvas" aria-hidden="true">
      <canvas ref={canvasRef} />
      {images.length === 0 ? <div className="frame-canvas__fallback" /> : null}
    </div>
  );
}
```

- [ ] **Step 7: 临时创建 ProjectCard 以满足当前测试，完整项目区在 Task 6 扩展**

Create `D:\VScode\Personal_Web\src\components\ProjectCard.tsx`:

```tsx
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
```

- [ ] **Step 8: 运行组件测试**

Run:

```powershell
npm.cmd run test -- src/test/components.test.tsx
```

Expected:

```text
PASS src/test/components.test.tsx
```

- [ ] **Step 9: 提交基础组件**

Run:

```powershell
git add src/components src/test/components.test.tsx
git commit -m "feat: add frame canvas and core interface components"
```

Expected:

```text
[main ...] feat: add frame canvas and core interface components
```

---

## Task 6: 实现 Works、Pipeline、Links 章节

**Files:**
- Create: `D:\VScode\Personal_Web\src\components\WorksSection.tsx`
- Create: `D:\VScode\Personal_Web\src\components\PipelineSection.tsx`
- Create: `D:\VScode\Personal_Web\src\components\LinksPanel.tsx`
- Modify: `D:\VScode\Personal_Web\src\test\components.test.tsx`
- Test: `npm.cmd run test -- src/test/components.test.tsx`

- [ ] **Step 1: 扩展组件测试**

Modify `D:\VScode\Personal_Web\src\test\components.test.tsx` by replacing its content with:

```tsx
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
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
npm.cmd run test -- src/test/components.test.tsx
```

Expected:

```text
FAIL src/test/components.test.tsx
Cannot find module '../components/LinksPanel'
```

- [ ] **Step 3: 创建 WorksSection**

Create `D:\VScode\Personal_Web\src\components\WorksSection.tsx`:

```tsx
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
```

- [ ] **Step 4: 创建 PipelineSection**

Create `D:\VScode\Personal_Web\src\components\PipelineSection.tsx`:

```tsx
import type { PipelineStep } from "../types/content";

type PipelineSectionProps = {
  steps: PipelineStep[];
};

export function PipelineSection({ steps }: PipelineSectionProps) {
  return (
    <section className="section story-panel" id="pipeline" data-section="pipeline" aria-labelledby="pipeline-title">
      <div className="section__inner">
        <p className="eyebrow">Pipeline</p>
        <h2 id="pipeline-title">From idea to working demo</h2>
        <p className="section-lead">我更关心一件事如何真的跑起来：先定义问题，再组织 AI 逻辑，接入真实世界，最后做出可验证的 Demo。</p>
        <div className="pipeline-grid">
          {steps.map((step, index) => (
            <article className="pipeline-step" key={step.title}>
              <span className="pipeline-step__index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className="tag-row">
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
  );
}
```

- [ ] **Step 5: 创建 LinksPanel**

Create `D:\VScode\Personal_Web\src\components\LinksPanel.tsx`:

```tsx
import type { PublicLink } from "../types/content";

type LinksPanelProps = {
  links: PublicLink[];
  featuredRepos: PublicLink[];
};

export function LinksPanel({ links, featuredRepos }: LinksPanelProps) {
  return (
    <section className="section story-panel" id="links" data-section="links" aria-labelledby="links-title">
      <div className="section__inner section__inner--narrow">
        <p className="eyebrow">Links</p>
        <h2 id="links-title">Signal out.</h2>
        <p className="section-lead">
          Open to conversations around AI prototypes, embedded systems, and Physical AI.
          <br />
          欢迎围绕 AI 原型、嵌入式系统与 Physical AI 交流。
        </p>
        <div className="link-group" aria-label="Primary links">
          {links.map((link) => (
            <a className="link-button" key={link.href} href={link.href} target={link.kind === "email" ? undefined : "_blank"} rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
        <div className="repo-list" aria-label="Featured repositories">
          {featuredRepos.map((repo) => (
            <a className="repo-link" key={repo.href} href={repo.href} target="_blank" rel="noreferrer">
              {repo.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: 运行组件测试**

Run:

```powershell
npm.cmd run test -- src/test/components.test.tsx
```

Expected:

```text
PASS src/test/components.test.tsx
```

- [ ] **Step 7: 提交章节组件**

Run:

```powershell
git add src/components src/test/components.test.tsx
git commit -m "feat: add works pipeline and links sections"
```

Expected:

```text
[main ...] feat: add works pipeline and links sections
```

---

## Task 7: 组装 App、接入 GSAP ScrollTrigger 和章节状态同步

**Files:**
- Modify: `D:\VScode\Personal_Web\src\App.tsx`
- Modify: `D:\VScode\Personal_Web\src\styles\global.css`
- Test: `npm.cmd run test`
- Test: `npm.cmd run build`

- [ ] **Step 1: 替换 App 为完整页面结构**

Modify `D:\VScode\Personal_Web\src\App.tsx`:

```tsx
import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { projects } from "./data/projects";
import { navSections, pipelineSteps, sectionStates } from "./data/sections";
import type { SectionId, SectionState } from "./types/content";

gsap.registerPlugin(ScrollTrigger);

function getSectionState(id: SectionId): SectionState {
  return sectionStates.find((section) => section.id === id) ?? sectionStates[0];
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const activeState = useMemo(() => getSectionState(activeSection), [activeSection]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setProgress(0.62);
      setActiveSection("intro");
      return;
    }

    const mainTrigger = ScrollTrigger.create({
      trigger: ".story",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.45,
      onUpdate: (self) => setProgress(self.progress),
    });

    const sectionTriggers = gsap.utils.toArray<HTMLElement>(".story-panel").map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection((section.dataset.section as SectionId) || "hero"),
        onEnterBack: () => setActiveSection((section.dataset.section as SectionId) || "hero"),
      }),
    );

    return () => {
      mainTrigger.kill();
      sectionTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <FrameCanvas progress={progress} />
      <div className="page-vignette" aria-hidden="true" />
      <SiteNav sections={navSections} activeSection={activeSection} />
      <HudBadge state={activeState} />
      <ScrollProgress progress={progress} />
      <main className="app-shell story">
        <HeroSection />
        <IntroSection />
        <WorksSection projects={projects} />
        <PipelineSection steps={pipelineSteps} />
        <LinksPanel links={links} featuredRepos={featuredRepos} />
      </main>
    </>
  );
}
```

- [ ] **Step 2: 替换全局 CSS 为完整样式**

Modify `D:\VScode\Personal_Web\src\styles\global.css`:

```css
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background: var(--color-bg);
}

body {
  margin: 0;
  min-width: 320px;
  overflow-x: hidden;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

button {
  font: inherit;
}

.frame-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: var(--color-bg);
}

.frame-canvas canvas,
.frame-canvas__fallback {
  width: 100%;
  height: 100%;
  display: block;
}

.frame-canvas__fallback {
  background:
    radial-gradient(circle at 52% 56%, rgba(86, 184, 255, 0.2), transparent 28%),
    linear-gradient(135deg, rgba(86, 184, 255, 0.1), rgba(216, 180, 90, 0.08)),
    var(--color-bg);
}

.page-vignette {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(5, 7, 10, 0.86), rgba(5, 7, 10, 0.24) 48%, rgba(5, 7, 10, 0.58)),
    linear-gradient(180deg, rgba(5, 7, 10, 0.7), transparent 28%, rgba(5, 7, 10, 0.72));
}

.app-shell {
  position: relative;
  z-index: 2;
}

.section {
  min-height: 100vh;
  padding: 112px var(--section-pad-x);
  display: grid;
  align-items: center;
}

.section__inner {
  width: min(100%, var(--content-max));
  margin: 0 auto;
}

.section__inner--narrow {
  width: min(100%, 760px);
  margin-left: max(var(--section-pad-x), calc((100vw - var(--content-max)) / 2));
}

.section--hero .section__inner {
  margin-left: max(var(--section-pad-x), calc((100vw - var(--content-max)) / 2));
}

.eyebrow {
  margin: 0 0 18px;
  color: var(--color-cyan);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  letter-spacing: 0;
}

h1 {
  max-width: 900px;
  margin: 0;
  font-size: clamp(50px, 8vw, 118px);
  line-height: 0.95;
}

h2 {
  max-width: 780px;
  margin: 0;
  font-size: clamp(34px, 5vw, 72px);
  line-height: 1;
}

h3 {
  margin: 8px 0 12px;
  font-size: 24px;
  line-height: 1.12;
}

p {
  color: var(--color-muted);
  line-height: 1.78;
}

.hero-cn {
  margin: 20px 0 0;
  color: var(--color-text);
  font-size: clamp(22px, 3vw, 34px);
}

.hero-tags,
.section-lead {
  max-width: 700px;
  margin-top: 28px;
  color: var(--color-muted);
  font-size: 16px;
}

.site-nav {
  position: fixed;
  top: 24px;
  left: 50%;
  z-index: 5;
  width: min(calc(100% - 32px), var(--content-max));
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.site-nav__brand,
.site-nav__link {
  border: 1px solid var(--color-line);
  background: rgba(5, 7, 10, 0.46);
  backdrop-filter: blur(16px);
}

.site-nav__brand {
  padding: 10px 14px;
  color: var(--color-text);
  font-weight: 700;
}

.site-nav__links {
  display: flex;
  gap: 8px;
}

.site-nav__link {
  padding: 10px 12px;
  color: var(--color-muted);
  font-size: 13px;
}

.site-nav__link--active {
  color: var(--color-cyan);
  border-color: rgba(124, 231, 255, 0.56);
}

.hud-badge {
  position: fixed;
  right: clamp(16px, 3vw, 36px);
  bottom: clamp(16px, 3vw, 36px);
  z-index: 6;
  width: min(230px, calc(100vw - 32px));
  min-height: 58px;
  padding: 12px 14px 12px 38px;
  border: 1px solid rgba(124, 231, 255, 0.32);
  background: rgba(5, 7, 10, 0.68);
  box-shadow: 0 0 28px rgba(86, 184, 255, 0.16);
  backdrop-filter: blur(18px);
  font-family: var(--font-mono);
}

.hud-badge__signal {
  position: absolute;
  top: 18px;
  left: 14px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--color-cyan);
  box-shadow: 0 0 18px var(--color-cyan);
}

.hud-badge strong,
.hud-badge span {
  display: block;
}

.hud-badge strong {
  color: var(--color-text);
  font-size: 13px;
}

.hud-badge span {
  margin-top: 4px;
  color: var(--color-muted);
  font-size: 11px;
  line-height: 1.25;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 7;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
}

.scroll-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--color-blue), var(--color-gold));
}

.works-grid {
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.project-card,
.pipeline-step {
  border: 1px solid var(--color-line);
  background: rgba(5, 7, 10, 0.56);
  backdrop-filter: blur(18px);
}

.project-card {
  min-height: 340px;
  display: grid;
}

.project-card__body {
  padding: 22px;
}

.project-card__subtitle,
.project-card__role {
  margin: 0;
  color: var(--color-cyan);
  font-family: var(--font-mono);
  font-size: 12px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.tag {
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 6px 8px;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1;
}

.text-button,
.project-card__repo,
.link-button,
.repo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border: 1px solid rgba(124, 231, 255, 0.34);
  background: rgba(86, 184, 255, 0.08);
  color: var(--color-text);
  cursor: pointer;
}

.text-button {
  margin-top: 20px;
  padding: 0 12px;
}

.project-card__highlights {
  margin: 18px 0 0;
  padding-left: 18px;
  color: var(--color-muted);
  line-height: 1.7;
}

.project-card__repo {
  margin-top: 16px;
  padding: 0 12px;
}

.pipeline-grid {
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.pipeline-step {
  min-height: 300px;
  padding: 20px;
}

.pipeline-step__index {
  color: var(--color-gold);
  font-family: var(--font-mono);
  font-size: 13px;
}

.link-group,
.repo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.link-button,
.repo-link {
  padding: 0 16px;
}

.repo-link {
  color: var(--color-cyan);
}

@media (max-width: 900px) {
  .section {
    padding-top: 104px;
    padding-bottom: 104px;
  }

  .section__inner--narrow,
  .section--hero .section__inner {
    margin-left: auto;
  }

  .site-nav {
    top: 14px;
    align-items: flex-start;
  }

  .site-nav__links {
    max-width: 235px;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .works-grid,
  .pipeline-grid {
    grid-template-columns: 1fr;
  }

  .hud-badge {
    width: min(178px, calc(100vw - 28px));
    min-height: 50px;
    padding: 10px 12px 10px 34px;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: 运行测试**

Run:

```powershell
npm.cmd run test
```

Expected:

```text
PASS src/test/content.test.ts
PASS src/test/framePaths.test.ts
PASS src/test/canvasDraw.test.ts
PASS src/test/components.test.tsx
```

- [ ] **Step 4: 运行构建**

Run:

```powershell
npm.cmd run build
```

Expected:

```text
✓ built in ...
```

- [ ] **Step 5: 提交页面组装**

Run:

```powershell
git add src/App.tsx src/styles
git commit -m "feat: compose cinematic scroll landing page"
```

Expected:

```text
[main ...] feat: compose cinematic scroll landing page
```

---

## Task 8: 添加端到端测试和浏览器视觉检查

**Files:**
- Create: `D:\VScode\Personal_Web\tests\e2e\home.spec.ts`
- Test: `npm.cmd run build`
- Test: `npm.cmd run test:e2e`

- [ ] **Step 1: 创建 Playwright 主流程测试**

Create `D:\VScode\Personal_Web\tests\e2e\home.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("renders hero, sections, project cards and links", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Build What You Want." })).toBeVisible();
  await expect(page.getByText("做你想做的")).toBeVisible();
  await expect(page.getByText("酸辣鱼 / SuanLayu")).toBeVisible();

  await page.getByRole("link", { name: "Works" }).click();
  await expect(page.getByRole("heading", { name: "STM32 平衡车" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "UniFlow Lab" })).toBeVisible();

  await page.getByRole("link", { name: "Pipeline" }).click();
  await expect(page.getByRole("heading", { name: "From idea to working demo" })).toBeVisible();

  await page.getByRole("link", { name: "Links" }).click();
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/suanlayu666");
  await expect(page.getByRole("link", { name: "Never Forget" })).toHaveAttribute(
    "href",
    "https://github.com/suanlayu666/Never_Forget_App",
  );
});

test("keeps the HUD visible in the lower right", async ({ page }) => {
  await page.goto("/");
  const hud = page.locator(".hud-badge");
  await expect(hud).toBeVisible();
  const box = await hud.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThan(100);
  expect(box!.y).toBeGreaterThan(100);
});
```

- [ ] **Step 2: 安装 Playwright Chromium 浏览器**

Run:

```powershell
npx.cmd playwright install chromium
```

Expected:

```text
chromium ... downloaded
```

- [ ] **Step 3: 构建项目**

Run:

```powershell
npm.cmd run build
```

Expected:

```text
✓ built in ...
```

- [ ] **Step 4: 运行端到端测试**

Run:

```powershell
npm.cmd run test:e2e
```

Expected:

```text
2 passed
```

- [ ] **Step 5: 生成桌面和移动端截图用于人工检查**

Run:

```powershell
npm.cmd run preview -- --port 4173
```

In a second terminal from the same directory, run:

```powershell
New-Item -ItemType Directory -Force -Path screenshots
npx.cmd playwright screenshot --viewport-size=1440,900 http://127.0.0.1:4173 screenshots\desktop-home.png
npx.cmd playwright screenshot --viewport-size=390,844 http://127.0.0.1:4173 screenshots\mobile-home.png
```

Expected:

```text
Saved screenshot to screenshots\desktop-home.png
Saved screenshot to screenshots\mobile-home.png
```

Check both images for:

- Hero text is readable.
- HUD sits in the lower right and covers the watermarked area.
- Navigation does not overlap the hero.
- Mobile text wraps without overflow.

- [ ] **Step 6: 提交端到端测试**

Run:

```powershell
git add tests playwright.config.ts
git commit -m "test: add browser coverage for personal site"
```

Expected:

```text
[main ...] test: add browser coverage for personal site
```

---

## Task 9: 配置 GitHub Pages 部署

**Files:**
- Create: `D:\VScode\Personal_Web\.github\workflows\deploy.yml`
- Modify: `D:\VScode\Personal_Web\package.json`
- Test: `npm.cmd run build`

- [ ] **Step 1: 添加 GitHub Pages workflow**

Create `D:\VScode\Personal_Web\.github\workflows\deploy.yml`:

```yaml
name: Deploy static site to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 确认 package scripts 不依赖本机 PowerShell 特性**

Modify `D:\VScode\Personal_Web\package.json` scripts section to remain:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "frames": "node scripts/extract-frames.mjs",
    "frames:dry": "node scripts/extract-frames.mjs --dry-run"
  }
}
```

This script block works on Windows through `npm.cmd` and on GitHub Actions through `npm`.

- [ ] **Step 3: 本地构建验证**

Run:

```powershell
npm.cmd run build
```

Expected:

```text
✓ built in ...
```

- [ ] **Step 4: 提交部署配置**

Run:

```powershell
git add .github/workflows/deploy.yml package.json package-lock.json
git commit -m "ci: add github pages deployment"
```

Expected:

```text
[main ...] ci: add github pages deployment
```

---

## Task 10: 最终质量门禁

**Files:**
- Review: `D:\VScode\Personal_Web\src`
- Review: `D:\VScode\Personal_Web\public\frames`
- Review: `D:\VScode\Personal_Web\dist`
- Test: `npm.cmd run test`
- Test: `npm.cmd run build`
- Test: `npm.cmd run test:e2e`

- [ ] **Step 1: 运行单元测试**

Run:

```powershell
npm.cmd run test
```

Expected:

```text
PASS src/test/content.test.ts
PASS src/test/framePaths.test.ts
PASS src/test/canvasDraw.test.ts
PASS src/test/components.test.tsx
```

- [ ] **Step 2: 运行生产构建**

Run:

```powershell
npm.cmd run build
```

Expected:

```text
✓ built in ...
```

- [ ] **Step 3: 运行端到端测试**

Run:

```powershell
npm.cmd run test:e2e
```

Expected:

```text
2 passed
```

- [ ] **Step 4: 检查生成资源大小**

Run:

```powershell
Get-ChildItem public\frames -Recurse -Filter *.webp | Measure-Object -Property Length -Sum
Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum
```

Expected:

```text
Count    : <number greater than 1>
Sum      : <number>
```

If `dist` total size is above 80 MB, reduce `scripts/extract-frames.mjs` desktop `fps` from `12` to `10`, mobile `fps` from `8` to `6`, rerun:

```powershell
npm.cmd run frames
npm.cmd run build
```

Expected:

```text
✓ built in ...
```

- [ ] **Step 5: 检查公开信息符合设计边界**

Run:

```powershell
Select-String -Path src\**\*.ts,src\**\*.tsx,index.html -Pattern "Hire Me|Looking for Internship|Download CV|Resume|13071229159"
```

Expected:

```text
No output
```

- [ ] **Step 6: 最终提交**

Run:

```powershell
git status --short
git add .
git commit -m "chore: finalize personal web implementation"
```

Expected if changes exist:

```text
[main ...] chore: finalize personal web implementation
```

Expected if no changes exist:

```text
nothing to commit, working tree clean
```

---

## 实施后人工验收清单

- [ ] 首屏显示 `Build What You Want.` 和 `做你想做的`。
- [ ] 页面身份显示为 `酸辣鱼 / SuanLayu`，不突出真实姓名。
- [ ] 导航为 `Intro / Works / Pipeline / Links`。
- [ ] 视频背景在桌面端随滚动推进。
- [ ] 右下角 HUD 在桌面端遮住水印区域。
- [ ] 移动端 HUD 不压住正文。
- [ ] Works 顺序为 `STM32 平衡车`、`UniFlow Lab`、`蓝牙遥控避障小车`、`Never Forget`。
- [ ] 项目卡片可以展开亮点。
- [ ] Links 只包含 GitHub、Email 和已知项目仓库。
- [ ] 页面不展示手机号。
- [ ] 页面不展示下载简历按钮。
- [ ] 页面不使用强求职语气。
- [ ] `prefers-reduced-motion` 下页面仍可阅读。
- [ ] `npm.cmd run test` 通过。
- [ ] `npm.cmd run build` 通过。
- [ ] `npm.cmd run test:e2e` 通过。

---

## 自审记录

### 设计覆盖

- 个人主页定位：Task 2、Task 5、Task 6、Task 7 覆盖。
- 标语 `Build What You Want. / 做你想做的`：Task 1、Task 5、Task 7 覆盖。
- `Intro / Works / Pipeline / Links`：Task 2、Task 6、Task 7 覆盖。
- 视频抽帧 + Canvas + GSAP ScrollTrigger：Task 3、Task 4、Task 5、Task 7 覆盖。
- 右下角 HUD 遮水印：Task 5、Task 7、Task 8 覆盖。
- 4 个项目和顺序：Task 2、Task 6 覆盖。
- 不放手机号、不放简历下载、不写强求职语气：Task 2、Task 10 覆盖。
- GitHub Pages 静态部署：Task 9 覆盖。

### 类型一致性

- `Project`、`PublicLink`、`SectionState`、`PipelineStep` 在 `src/types/content.ts` 定义。
- `FrameVariant` 从 `src/data/frameManifest.generated.ts` 导出。
- `SectionId` 包含 `hero`，导航数据只使用可见锚点 `intro`、`works`、`pipeline`、`links`。

### 执行风险

- `ffmpeg-static` 安装需要 npm 网络访问。
- `npx.cmd playwright install chromium` 需要下载浏览器。
- GitHub Pages 首次启用需要在 GitHub 仓库 Settings 中将 Pages Source 设置为 GitHub Actions。
- 如果生成帧体积过大，Task 10 给出明确降帧参数和重跑命令。
