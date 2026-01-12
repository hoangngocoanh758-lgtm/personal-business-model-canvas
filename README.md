# 个人商业模式画布 (Personal Business Model Canvas)

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)

> **“你不仅仅是一名员工，你就是一家‘一人企业’。”**

这是一个基于 Web 的数字化工具，旨在帮助个人利用经典的商业模式画布框架，以 CEO 的视角重新审视、规划和迭代自己的职业生涯。它集成了 DeepSeek AI 智能顾问，为您提供实时的职业诊断与灵感建议。

---

## 🌟 核心特性

- **九宫格画布可视化**：完整复刻《人生商业画布》方法论，涵盖核心资源、关键业务、客户群体、价值主张等九大模块。
- **🤖 DeepSeek AI 智能顾问**：
  - **实时对话**：内置 AI 助手，基于您的画布内容提供个性化建议。
  - **一键添加**：AI 生成的建议可直接“飞入”画布，无需手动复制粘贴。
  - **状态同步**：自动检测画布内容，智能管理建议状态（已添加/未添加）。
- **交互体验**：
  - **拖拽管理**：支持卡片在不同板块间自由拖拽，理清逻辑关系。
  - **Markdown 渲染**：AI 回复支持富文本格式，阅读体验更佳。
  - **流式输出**：模拟打字机效果，交互自然流畅。
- **数据安全与隐私**：
  - **本地优先 (Local-First)**：所有数据（画布内容、聊天记录、API Key）仅存储在浏览器 `LocalStorage` 中，不上传云端。
  - **自动保存**：任何修改实时保存，防止数据丢失。
- **导出分享**：支持一键将画布导出为高清 PNG 图片，便于分享或打印。

## 🛠️ 技术栈

本项目采用现代化的前端技术构建，注重性能与开发体验：

- **核心框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **构建工具**: [Vite](https://vitejs.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **UI 样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画效果**: [AutoAnimate](https://auto-animate.formkit.com/)
- **拖拽组件**: [VueDraggablePlus](https://github.com/Alfred-Skyblue/vue-draggable-plus)
- **AI 集成**: [DeepSeek API](https://platform.deepseek.com/)

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 pnpm

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/yangbin09/personal-business-model-canvas.git
   cd personal-business-model-canvas/web
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或者使用淘宝镜像（推荐国内用户）
   npm install --registry=https://registry.npmmirror.com
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问终端输出的本地地址 (通常是 `http://localhost:5173`)。

4. **构建生产版本**
   ```bash
   npm run build
   ```

## 📖 使用指南

1. **配置 AI**：点击右上角设置图标 ⚙️，输入您的 DeepSeek API Key（仅本地存储）。
2. **填充画布**：
   - 点击板块标题旁的 `+` 号添加卡片。
   - 双击卡片编辑内容。
   - 拖拽卡片调整位置。
3. **寻求建议**：点击右侧“AI 商业顾问”，输入如“分析我的核心资源”或“帮我优化价值主张”。
4. **采纳建议**：点击 AI 回复中的建议卡片，将其直接添加到左侧画布。
5. **重置数据**：如需清空所有内容，在设置中点击“重置所有数据”。

## 📚 详细文档

我们在 `docx` 目录下提供了详尽的项目文档，建议深入阅读：

- **[01_项目概述与核心理念.md](./docx/01_项目概述与核心理念.md)**  
  *深入解析“一人公司”理念及九宫格画布的理论基础。*
  
- **[02_用户使用指南与实战手册.md](./docx/02_用户使用指南与实战手册.md)**  
  *手把手教你如何绘制第一张画布，以及 AI 提问的高级技巧。*
  
- **[03_技术架构与开发文档.md](./docx/03_技术架构与开发文档.md)**  
  *面向开发者的技术细节，包含数据模型、AI 集成逻辑及目录结构。*

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！
请确保遵循项目的代码规范（TypeScript + ESLint）。

## 📄 许可证

[MIT License](./LICENSE)
