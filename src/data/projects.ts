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
