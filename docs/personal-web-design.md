# 酸辣鱼个人网站详细设计文档

版本：v1.0  
日期：2026-06-18  
项目目录：`D:\VScode\Personal_Web`  
技术方向：React + Vite + GSAP + ScrollTrigger + Canvas 序列帧  

## 1. 项目概述

本项目是“酸辣鱼 / SuanLayu”的个人网站第一版。它不是传统求职简历页，也不是比赛申请页，而是一个兼具个人表达、作品集展示和能力呈现的单页滚动网站。

网站核心体验基于现有未来电路板视频素材，通过视频抽帧、Canvas 绘制和 GSAP ScrollTrigger，把页面滚动进度映射到视频阶段。随着镜头从高角度俯瞰电路板逐渐下潜到 ST 微芯片微距特写，页面同步展示酸辣鱼的个人简介、精选项目、能力链路和公开链接。

网站希望传达的核心印象是：

> 酸辣鱼是一个正在探索 AI 原型、嵌入式系统和 Physical AI 的创造者，关注如何把想法做成能够运行、感知、反馈和行动的真实原型。

## 2. 核心目标

### 2.1 主要目标

1. 建立一个有记忆点的个人主页，而不是普通在线简历。
2. 用视频滚动叙事强化“科技、硬件、AI、原型”的个人气质。
3. 展示 4 个精选项目，让访问者快速理解酸辣鱼的能力结构。
4. 通过 `Pipeline` 呈现从想法到原型的能力链路。
5. 提供 GitHub、Email 和重点项目仓库入口，方便招聘者、开发者或潜在合作方进一步了解。

### 2.2 非目标

第一版暂不做以下内容：

1. 不做后端。
2. 不做登录、评论、留言板。
3. 不做在线联系表单。
4. 不展示手机号。
5. 不提供简历下载按钮。
6. 不使用强求职语气，例如 `Hire Me`、`Looking for Internship`。
7. 不做多页面项目详情站，第一版优先完成单页体验。

## 3. 受众与内容语气

### 3.1 主要受众

网站面向综合个人品牌场景，主要访问者可能包括：

1. 招聘者或实习机会负责人。
2. 技术同好、开发者、GitHub 访问者。
3. 潜在合作伙伴。
4. 对 AI 应用、嵌入式系统、AIoT / Physical AI 感兴趣的人。

### 3.2 内容语气

整体语气应当：

1. 克制、清晰、有个人态度。
2. 不像求职广告。
3. 不像纯技术文档。
4. 不夸张营销。
5. 体现探索感、创造感和技术可信度。

### 3.3 语言策略

采用中英双语混合：

1. 主标题、导航、技术标签使用英文。
2. 关键标语同时保留英文和中文。
3. 正文说明以中文为主。
4. 项目标签使用英文或技术关键词。

示例：

```text
Build What You Want.
做你想做的
```

```text
AI Prototype · Embedded Systems · Physical AI
```

## 4. 品牌与首屏定位

### 4.1 显示身份

公开页面不使用真实姓名作为主视觉身份，使用昵称：

```text
酸辣鱼 / SuanLayu
```

真实姓名如有需要，可以只保留在简历文件或其他非首屏区域。第一版页面不主动突出真实姓名。

### 4.2 主标语

首屏主标语确定为：

```text
Build What You Want.
做你想做的
```

这个标语比直接翻译 `Do What You Want To Do` 更适合个人网站和技术作品集。`Build` 强调把想法做出来，贴合 AI 原型、嵌入式系统、项目实践和动手能力。

### 4.3 副定位

副定位以小标签方式呈现，不作为主标题：

```text
AI Prototype · Embedded Systems · Physical AI
```

可选补充文案：

```text
Exploring how ideas become systems that sense, think, and move.
```

中文说明可在 Intro 段落出现：

```text
我正在探索 AI 如何从屏幕里的回答，走向真实世界中的感知、反馈与行动。
```

## 5. 总体设计方向

最终采用方案：

```text
Cinematic Circuit
```

### 5.1 设计关键词

1. 干净科技感。
2. 电影式滚动叙事。
3. 未来电路板。
4. 蓝色微光。
5. 少量金色电源线点缀。
6. 克制、清晰、高级。
7. 信息层级明确。

### 5.2 视觉原则

1. 视频是主视觉，但不能压过文本可读性。
2. 页面不做大面积霓虹堆叠。
3. 不使用过多装饰卡片。
4. 信息浮层要像视频世界中的界面，而不是贴上去的广告块。
5. 项目展示要保持作品集质感，不要变成简历列表。
6. 滚动体验要自然连续，不做强制吸附。

## 6. 信息架构

网站为单页滚动结构，导航锚点为：

```text
Intro / Works / Pipeline / Links
```

### 6.1 页面章节

1. `Hero`
   - 首屏标语。
   - 昵称身份。
   - 弱化副定位。
   - 视频从黑场或弱光状态启动。

2. `Intro`
   - 介绍酸辣鱼是谁。
   - 出现学校、专业、城市等背景。
   - 说明当前探索方向。

3. `Works`
   - 展示 4 个精选项目。
   - 采用分层阅读。
   - 默认简洁，允许展开更多亮点。

4. `Pipeline`
   - 展示能力链路。
   - 用流程而不是普通技能表组织内容。

5. `Links`
   - GitHub。
   - Email。
   - Featured Repos。

## 7. 视频叙事设计

### 7.1 视频素材描述

现有视频是一段未来感电路板场景：

1. 开始为高角度俯瞰电路板。
2. 摄像机执行连续、平滑、非循环的推近并下移运动。
3. 中段逐渐揭示电容器、电阻器、接口和立体空间。
4. 后段镜头下降到低角度微距。
5. 中央 ST 微芯片与蓝色全息网络成为画面中心。
6. 右下角有带黄光按钮的区域，同时存在水印问题。
7. 背景有雨夜赛博朋克城市天际线和飞行汽车。

### 7.2 滚动阶段映射

建议将视频滚动映射为 5 个视觉阶段：

#### 阶段 1：Boot / Hero

画面状态：

1. 接近黑场。
2. 电路板轮廓或蓝色微光隐约可见。
3. 视频亮度较低。

内容：

```text
Build What You Want.
做你想做的
```

辅助信息：

```text
酸辣鱼 / SuanLayu
AI Prototype · Embedded Systems · Physical AI
```

#### 阶段 2：Profile / Intro

画面状态：

1. 镜头开始下潜。
2. 电路结构逐渐清晰。
3. 空间感增强。

内容重点：

1. 酸辣鱼是谁。
2. 武汉。
3. 中南民族大学。
4. 电子信息工程。
5. 探索方向：AI 应用原型、嵌入式系统、AIoT / Physical AI。

示例文案：

```text
我正在探索 AI 如何从屏幕里的回答，走向真实世界中的感知、反馈与行动。
```

#### 阶段 3：Works / Featured Projects

画面状态：

1. 镜头进入电路板深处。
2. 电子元件形成类似城市建筑的空间。
3. 视觉细节更丰富。

内容重点：

1. STM32 平衡车。
2. UniFlow Lab。
3. 蓝牙遥控避障小车。
4. Never Forget。

#### 阶段 4：Pipeline / Prototype Flow

画面状态：

1. 镜头接近 ST 芯片。
2. 蓝色全息网络增强。
3. 数据流沿走线移动。

内容重点：

```text
Frame → Think with AI → Sense & Control → Build Demo
```

#### 阶段 5：Links / Signal Out

画面状态：

1. 镜头停留在低角度芯片微距。
2. ST 芯片、全息网络和电源总线占据主要画面。
3. 页面视觉进入收束状态。

内容重点：

1. GitHub。
2. Email。
3. Featured Repos。

结尾语气：

```text
Open to conversations around AI prototypes, embedded systems, and Physical AI.
```

中文可选：

```text
欢迎围绕 AI 原型、嵌入式系统与 Physical AI 交流。
```

## 8. HUD 遮水印设计

### 8.1 设计目标

视频右下角存在水印，因此使用一个小而精致的 HUD 角标进行遮挡。它不是临时补丁，而是整体视觉系统的一部分。

### 8.2 HUD 尺寸与位置

原则：

1. 放置在右下角。
2. 尺寸尽量小，只覆盖水印和必要安全边距。
3. 不抢主视觉。
4. 桌面端固定在安全区域内。
5. 移动端根据画面裁切情况调整位置或隐藏部分信息。

建议初始尺寸：

```text
desktop: width 180-240px, height 52-72px
mobile: width 140-180px, height 44-64px
```

实际尺寸需根据水印大小测试后微调。

### 8.3 HUD 视觉样式

1. 半透明深色背景。
2. 细边框。
3. 蓝色微光。
4. 小号等宽字体或技术感字体。
5. 状态点或微型进度条。
6. 不使用大块实色遮挡。

示例内容：

```text
INTRO
AI · STM32 · Prototype
```

### 8.4 HUD 状态变化

不同章节显示不同状态：

| 页面阶段 | HUD 主码 | HUD 副信息 |
|---|---|---|
| Hero | BOOT | Build What You Want |
| Intro | INTRO | Wuhan · EE · Explorer |
| Works | WORKS | STM32 · AI App · Prototype |
| Pipeline | PIPELINE | Frame · AI · Control · Demo |
| Links | LINKS | GitHub · Email · Repos |

### 8.5 水印兜底策略

如果 HUD 无法完全遮住水印：

1. 稍微扩大 HUD。
2. 增加 HUD 的右下安全边距。
3. 在 Canvas 绘制时对视频进行轻微裁切或放大。
4. 为右下角加极轻的渐变遮罩。

优先顺序：

```text
HUD 微调 > Canvas 轻微裁切 > 渐变遮罩
```

## 9. 项目展示设计

### 9.1 展示策略

作品集部分采用分层阅读：

1. 默认展示关键信息。
2. 访问者可以展开阅读 2-3 条亮点。
3. 技术标签保持可扫描。
4. 仓库链接清晰可见。
5. 有项目图片就显示，没有就使用统一占位图。

### 9.2 项目顺序

项目顺序和权重如下：

1. STM32 平衡车。
2. UniFlow Lab - 信息聚合 App。
3. 蓝牙遥控避障小车。
4. Never Forget - AI 识屏总结 App。

前两个项目权重更高：

1. STM32 平衡车代表真实物理系统、嵌入式控制和调试能力。
2. UniFlow Lab 代表信息场景、产品原型和数据链路能力。

### 9.3 项目卡片字段

每个项目建议使用统一数据结构：

```ts
type Project = {
  title: string;
  subtitle: string;
  role: string;
  summary: string;
  tags: string[];
  highlights: string[];
  repo?: string;
  cover?: string;
  status?: "featured" | "normal" | "coming-soon";
};
```

### 9.4 项目内容草案

#### 9.4.1 STM32 平衡车

定位：

```text
Embedded control prototype
```

一句话结果：

```text
基于 STM32 完成平衡车原型，围绕姿态感知、电机控制、参数调试和控制反馈进行开发。
```

角色：

```text
独立开发 / 嵌入式控制开发
```

技术标签：

```text
STM32 / PWM / Motor Control / Sensor / Debugging
```

亮点：

1. 通过真实物理系统理解重力、惯性、传感器误差和电机响应延迟。
2. 完成姿态感知、控制反馈、参数调试等基础链路。
3. 强化对 Physical AI 中“感知 - 决策 - 执行”闭环的兴趣。

#### 9.4.2 UniFlow Lab - 信息聚合 App

定位：

```text
Information aggregation prototype
```

一句话结果：

```text
面向信息获取和整理场景，设计信息聚合应用原型，通过 API 数据流完成信息输入、筛选、聚合和展示。
```

角色：

```text
独立开发 / 产品原型开发
```

技术标签：

```text
Product Prototype / API Flow / Information Design / AI App
```

亮点：

1. 从用户信息整理场景出发拆解产品流程。
2. 关注信息输入、筛选、聚合和展示之间的数据链路。
3. 将软件数据链路思维迁移到未来 AIoT / Physical AI 方向。

#### 9.4.3 蓝牙遥控避障小车

定位：

```text
STM32 sensing and control prototype
```

一句话结果：

```text
使用 STM32、传感器和电机驱动模块，实现蓝牙遥控、运动控制和基础避障能力。
```

角色：

```text
核心开发 / 嵌入式开发
```

技术标签：

```text
STM32 / GPIO / PWM / UART / IIC / Ultrasonic Sensor / Bluetooth
```

亮点：

1. 接入超声波、温度等传感器，完成基础环境感知。
2. 使用 PWM 控制电机速度和运动状态。
3. 积累软硬件联调、传感器接入和运动控制经验。

#### 9.4.4 Never Forget - AI 识屏总结 App

定位：

```text
AI screen understanding prototype
```

一句话结果：

```text
面向截图和屏幕信息难以整理复盘的问题，调用大模型 API 对图像内容进行识别、总结和信息沉淀。
```

角色：

```text
独立开发 / AI 应用原型开发
```

技术标签：

```text
AI API / Image Input / Summary / Product Loop / Prototype
```

亮点：

1. 完成从图片输入到模型识别、结果展示的基础流程。
2. 训练将 AI 能力落地为具体应用的产品思维。
3. 关注信息沉淀、复盘和用户使用闭环。

### 9.5 项目图片策略

1. 有真实图片或截图时优先使用。
2. 没有素材时使用统一风格占位图。
3. 占位图风格应与主视频一致：深色、电路纹理、蓝色微光、简洁标签。
4. 后续补图时只替换数据字段，不改组件结构。

## 10. Pipeline 能力链路

### 10.1 设计目标

`Pipeline` 不做普通技能表，而是展示酸辣鱼如何从一个想法推进到原型。

核心结构：

```text
Frame → Think with AI → Sense & Control → Build Demo
```

### 10.2 四段能力说明

#### 10.2.1 Frame

含义：

```text
从问题和场景出发，拆解需求，确定原型要验证什么。
```

能力标签：

```text
Problem Framing / User Scenario / Product Thinking / Prototype Goal
```

#### 10.2.2 Think with AI

含义：

```text
使用大模型 API、Prompt 和 Agent 交互设计，把 AI 能力组织成可用流程。
```

能力标签：

```text
GPT / Claude / DeepSeek / Prompt Design / Agent Interaction / Context Engineering
```

#### 10.2.3 Sense & Control

含义：

```text
通过 STM32、传感器和电机控制，让系统获得真实世界的输入和输出能力。
```

能力标签：

```text
STM32 / GPIO / PWM / UART / IIC / Sensor / Motor Control
```

#### 10.2.4 Build Demo

含义：

```text
将想法做成可运行 Demo，通过代码、调试和迭代验证方向。
```

能力标签：

```text
C / C++ / GitHub / VS Code / Rapid Demo / Debugging
```

## 11. Links 区设计

### 11.1 展示内容

`Links` 区只放公开入口：

1. GitHub。
2. Email。
3. Featured Repos。

不放：

1. 手机号。
2. 下载简历。
3. 强求职按钮。
4. `Hire Me` 类文案。

### 11.2 推荐文案

英文：

```text
Open to conversations around AI prototypes, embedded systems, and Physical AI.
```

中文：

```text
欢迎围绕 AI 原型、嵌入式系统与 Physical AI 交流。
```

### 11.3 链接布局

建议分为两组：

1. Primary Links
   - GitHub
   - Email

2. Featured Repos
   - STM32 平衡车仓库，如有。
   - UniFlow Lab 仓库，如有。
   - 蓝牙遥控避障小车仓库。
   - Never Forget 仓库。

没有仓库链接的项目先不展示按钮，或显示 `Coming Soon`，避免无效链接影响体验。

## 12. 交互与动效

### 12.1 总体滚动体验

滚动体验采用：

```text
连续视频推进 + 电影分镜式文字浮现
```

表现为：

1. 视频画面随滚动持续、平滑推进。
2. 文本按章节淡入、停留、淡出。
3. HUD 持续更新状态。
4. 项目区滚动节奏放慢，方便阅读。
5. 不做强制吸附，保持自然滚动手感。

### 12.2 Hero 动效

1. 页面初始为暗场。
2. `Build What You Want.` 先淡入。
3. `做你想做的` 延迟出现。
4. 昵称和副定位轻微浮现。
5. 开始滚动后视频亮度逐渐提升。

### 12.3 文本动效

建议使用：

1. opacity 0 → 1。
2. translateY 16px → 0。
3. blur 6px → 0，可少量使用。
4. 每段文字保持足够停留时间。

避免：

1. 大幅旋转。
2. 频繁闪烁。
3. 过多弹性动画。
4. 影响阅读的复杂路径动画。

### 12.4 项目卡片交互

1. 默认显示简短信息。
2. 点击或悬停展开亮点。
3. 移动端使用点击展开。
4. GitHub 链接使用清晰按钮。
5. 展开状态不能造成大范围布局跳动。

### 12.5 Reduced Motion

需要支持系统减少动态效果偏好：

```css
@media (prefers-reduced-motion: reduce) {
  /* 降低或关闭滚动动画 */
}
```

在 reduced motion 模式下：

1. 视频停留在关键静帧或缓慢变化。
2. 文本直接显示。
3. 不使用复杂滚动跟随动画。

## 13. 技术架构

### 13.1 技术栈

确定使用：

```text
React + Vite + GSAP + ScrollTrigger
```

部署：

```text
GitHub Pages
```

### 13.2 推荐目录结构

```text
Personal_Web/
  package.json
  vite.config.ts
  index.html
  src/
    main.tsx
    App.tsx
    styles/
      global.css
      tokens.css
    components/
      FrameCanvas.tsx
      SiteNav.tsx
      HudBadge.tsx
      SectionText.tsx
      ProjectCard.tsx
      Pipeline.tsx
      LinksPanel.tsx
    data/
      projects.ts
      links.ts
      sections.ts
    hooks/
      useFramePreloader.ts
      useScrollFrames.ts
    assets/
      frames/
        desktop/
        mobile/
      project-covers/
      placeholders/
    docs/
      personal-web-design.md
```

说明：

1. `FrameCanvas.tsx` 负责 Canvas 绘制序列帧。
2. `useFramePreloader.ts` 负责预加载图片。
3. `useScrollFrames.ts` 负责将滚动进度映射到当前帧。
4. `projects.ts` 负责维护项目内容。
5. `HudBadge.tsx` 负责右下角遮水印和状态显示。

### 13.3 关键模块职责

#### FrameCanvas

职责：

1. 加载序列帧。
2. 根据当前滚动进度绘制对应帧。
3. 处理桌面端和移动端不同帧资源。
4. 处理图片 cover / crop 逻辑。

#### HudBadge

职责：

1. 固定右下角显示。
2. 根据当前章节更新文字。
3. 遮挡水印。
4. 在 `Links` 段落扩展链接状态。

#### ProjectCard

职责：

1. 展示项目基础信息。
2. 管理展开状态。
3. 展示技术标签和仓库链接。
4. 支持有图和无图两种状态。

#### Pipeline

职责：

1. 展示 4 段能力链路。
2. 与滚动阶段同步出现。
3. 移动端转为纵向布局。

## 14. 视频抽帧与资源策略

### 14.1 抽帧原则

不建议高帧率全量抽帧。视频体积约 10MB，但抽成大量 PNG/JPG 可能导致网页资源膨胀。

推荐：

1. 使用 `webp`。
2. 桌面端抽 10-15 fps。
3. 移动端抽更低帧率或更低分辨率。
4. 根据视频时长控制总帧数。
5. 首屏帧优先加载。

### 14.2 资源规格建议

桌面端：

```text
format: webp
width: 1600-1920px
quality: 70-82
fps: 10-15
```

移动端：

```text
format: webp
width: 900-1200px
quality: 65-75
fps: 6-10
```

### 14.3 加载策略

1. 优先加载首屏关键帧。
2. 后台分批加载后续帧。
3. 加载过程中显示第一帧或低清占位图。
4. 低性能设备使用移动端帧或静态降级。
5. 避免一次性创建过多 Image 对象导致内存压力。

### 14.4 移动端降级策略

移动端优先保证可读和顺滑：

1. 使用低分辨率序列帧。
2. 降低帧数。
3. 必要时改为视频背景 + 分段文字。
4. 保持项目和文字内容完整显示。
5. 避免横向溢出和文字重叠。

## 15. 性能与兼容性

### 15.1 性能目标

1. 首屏尽快显示标语和背景首帧。
2. 滚动动画在桌面端保持流畅。
3. 移动端不明显卡顿。
4. 文本内容不依赖全部帧加载完成。
5. 总资源体积可控。

### 15.2 需要关注的风险

1. 序列帧数量过多导致加载慢。
2. 图片分辨率过高导致内存占用大。
3. Canvas 绘制 crop 不当导致水印露出。
4. HUD 遮挡过大影响视频美感。
5. 项目卡片展开导致布局跳动。
6. 移动端视口变化导致文字和 HUD 重叠。

### 15.3 验证方法

实现后至少验证：

1. 桌面端 1440px 宽度。
2. 桌面端 1920px 宽度。
3. 移动端 390px 宽度。
4. 移动端 430px 宽度。
5. 首屏加载状态。
6. 滚动到每个章节。
7. HUD 是否完全遮住水印。
8. 项目展开状态。
9. 链接是否可点击。
10. `prefers-reduced-motion` 是否可用。

## 16. 视觉系统草案

### 16.1 色彩

主色：

```text
Background: #05070A
Panel: rgba(7, 12, 18, 0.58)
Text Primary: #F3F7FA
Text Secondary: #AAB7C4
Electric Blue: #56B8FF
Circuit Cyan: #7CE7FF
Gold Accent: #D8B45A
Muted Line: rgba(255, 255, 255, 0.14)
```

使用原则：

1. 深色为底。
2. 蓝色用于科技光效、链接、状态。
3. 金色只做少量强调，呼应视频中的金色电源总线。
4. 不做大面积紫粉霓虹。

### 16.2 字体

建议：

1. 英文标题使用现代无衬线字体。
2. 技术标签和 HUD 可使用等宽字体。
3. 中文使用系统默认黑体栈，保证清晰。

CSS 字体栈建议：

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Microsoft YaHei",
  sans-serif;
```

HUD 字体：

```css
font-family:
  "JetBrains Mono",
  "SFMono-Regular",
  Consolas,
  monospace;
```

### 16.3 排版

1. 首屏标题较大，但不使用夸张超大字号。
2. 正文行宽控制在 560-720px。
3. 项目卡片内标题不要过大。
4. 技术标签保持小而清晰。
5. 移动端所有文字必须换行自然，不得溢出按钮或卡片。

## 17. 可访问性

需要满足：

1. 文本与背景对比度足够。
2. 所有链接和按钮可键盘聚焦。
3. 项目展开按钮有明确 aria 状态。
4. Canvas 背景不承载唯一信息，核心内容必须在 DOM 文本中存在。
5. 视频或序列帧不使用声音。
6. 支持 reduced motion。

## 18. 部署方案

### 18.1 首选部署

使用 GitHub Pages。

原因：

1. 项目是纯静态网站。
2. 不需要后端。
3. 和 GitHub 项目展示天然契合。
4. 维护成本低。
5. 后续可以接自定义域名。

### 18.2 未来可迁移方向

如果以后需要以下功能，可以考虑迁移到 Vercel / Next.js：

1. 联系表单。
2. CMS 管理项目内容。
3. 评论或留言。
4. AI Chatbot。
5. 动态 API。
6. 项目详情页自动生成。

第一版不需要这些能力。

## 19. 实现阶段建议

### 阶段 1：项目初始化

1. 初始化 React + Vite 项目。
2. 安装 GSAP。
3. 建立基础目录结构。
4. 创建全局样式和设计变量。

### 阶段 2：视频处理

1. 确认视频时长、分辨率和水印位置。
2. 抽取桌面端 webp 帧。
3. 抽取移动端 webp 帧。
4. 生成首帧占位图。
5. 检查资源体积。

### 阶段 3：滚动主体验

1. 实现 Canvas 帧绘制。
2. 接入 ScrollTrigger。
3. 建立滚动进度与帧编号映射。
4. 实现首屏暗场到亮场过渡。
5. 验证桌面端滚动流畅度。

### 阶段 4：内容层

1. 实现导航。
2. 实现 Hero。
3. 实现 Intro。
4. 实现 Works。
5. 实现 Pipeline。
6. 实现 Links。

### 阶段 5：HUD 与水印处理

1. 实现右下角 HUD。
2. 根据章节更新 HUD 状态。
3. 验证是否遮住水印。
4. 必要时调整 Canvas 裁切。

### 阶段 6：响应式与优化

1. 移动端布局。
2. 移动端帧资源。
3. 降低低性能设备负担。
4. 支持 reduced motion。
5. 检查文字溢出和重叠。

### 阶段 7：部署

1. 配置 Vite base。
2. 构建静态资源。
3. 部署到 GitHub Pages。
4. 验证线上路径、图片资源和链接。

## 20. 待确认事项

在开始实现前，建议继续确认以下内容：

1. 视频实际时长和分辨率。
2. 水印具体大小和位置。
3. 四个项目的准确 GitHub 仓库链接。
4. 是否已有项目截图或照片。
5. Email 是否使用简历中的邮箱。
6. 是否需要保留旧个人主页链接。
7. 网站仓库是否就使用 `D:\VScode\Personal_Web`。
8. 是否需要初始化 git 仓库。

## 21. 最终设计摘要

第一版网站应当是一个单页、静态、视觉驱动但信息清晰的个人主页。

它以 `Build What You Want. / 做你想做的` 作为主标语，以未来电路板视频作为滚动叙事背景，以右下角小 HUD 遮挡水印并增强界面感。页面通过 `Intro / Works / Pipeline / Links` 四个锚点，让访问者自然认识酸辣鱼、理解项目能力、看到从想法到原型的能力链路，并通过 GitHub、Email 和项目仓库继续深入了解。

这个方案的重点不是把页面做成炫技动画，而是让视频、项目和文字共同服务一个清晰的个人印象：

> 酸辣鱼正在探索 AI 如何连接真实世界，并持续把想法做成可以运行的原型。

