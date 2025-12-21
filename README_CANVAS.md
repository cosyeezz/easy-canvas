# Easy-Canvas 接入与开发指南

本文档详细说明了如何将 `easy-canvas`（一个基于 Dify 剥离的纯前端工作流编排器）集成到您的应用程序中，以及如何进行功能扩展和定制。

## 1. 项目简介

Easy-Canvas 是一个**纯前端**、**无后端依赖**的通用工作流编排组件。基于 ReactFlow v11 构建，支持节点的拖拽、连线、配置以及 DSL（JSON）数据的导入导出。

**核心特性：**
*   **独立运行**：移除了所有 Dify 后端 API 请求，依靠本地状态管理。
*   **静态配置**：节点元数据（Metadata）和默认值完全由本地配置文件驱动。
*   **交互优化**：支持双击编辑、**智能吸附连线**、**ELK 高级自动布局**（支持嵌套 If/Else）。
*   **易于集成**：通过 Context 和 Props 即可完成状态注入和数据回调。

---

## 2. 快速接入 (Integration)

由于本项目尚未打包为 npm package，目前的接入方式为**源码集成**。

### 2.1 环境要求
*   **框架**：Next.js 14+ (推荐 App Router) 或 React 18+
*   **样式**：TailwindCSS
*   **包管理器**：pnpm / npm / yarn

### 2.2 依赖安装
请确保您的宿主项目安装了以下核心依赖（参考 `package.json`）：

```bash
pnpm add reactflow scheduler immer ahooks react-i18next i18next lodash-es dayjs
pnpm add -D tailwindcss postcss autoprefixer
```

### 2.3 源码迁移
将 `easy-canvas/app/components/workflow` 文件夹完整复制到您的项目组件目录中，例如 `src/components/workflow`。

同时，您需要以下辅助文件（根据实际路径调整引用）：
*   `app/components/base` (基础 UI 组件，如 Button, Tooltip, Input 等)
*   `context/` (包含 EventEmmiter 等上下文)
*   `i18n/` (多语言配置)
*   `service/` (即使去除了后端，部分类型定义仍依赖此目录)
*   `types/` (全局类型定义)

### 2.4 组件调用示例

在您的页面（例如 `src/app/canvas/page.tsx`）中引入并使用 `WorkflowWithInnerContext`。

```tsx
'use client'

import React, { useState, useCallback } from 'react'
// 1. 引入核心组件
import { WorkflowWithInnerContext } from '@/components/workflow/index'
// 2. 引入节点默认配置（非常重要，定义了有哪些节点可用）
import { availableNodesMetaData } from '@/canvas/node-defaults'
// 3. 引入上下文
import { EventEmitterContextProvider } from '@/context/event-emitter'

export default function MyWorkflowPage() {
  // 4. 初始化节点数据 (DSL)
  const initialNodes = [
    {
      id: 'start',
      type: 'custom', // 注意：所有业务节点类型固定为 'custom'
      data: { 
        title: 'Start', 
        type: 'start', // 实际类型由 data.type 决定
        desc: 'Entry Point', 
        variables: [] 
      },
      position: { x: 100, y: 100 },
    },
  ]
  
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState([])

  // 5. 数据回调：当画布发生变化时（节点移动、连线、修改配置），会触发此回调
  const handleWorkflowDataUpdate = useCallback((payload: any) => {
    console.log('Current Workflow Data:', payload)
    // payload 包含 { nodes, edges, viewport }
    // 您可以在这里将数据保存到 LocalStorage 或您的后端
  }, [])

  return (
    <EventEmitterContextProvider>
      <div style={{ height: '100vh', width: '100vw' }}>
        <WorkflowWithInnerContext
          nodes={nodes}
          edges={edges}
          onWorkflowDataUpdate={handleWorkflowDataUpdate}
          // 6. 注入静态配置和回调能力
          hooksStore={{
            availableNodesMetaData, // 决定左侧面板显示哪些节点
            handleExportDSL: () => console.log('Export triggered'),
            readOnly: false,        // 是否只读
          }}
        />
      </div>
    </EventEmitterContextProvider>
  )
}
```

---

## 3. 功能模块详解

### 3.1 节点系统 (Nodes)
所有节点组件位于 `components/workflow/nodes`。
*   **结构**：每个节点目录（如 `llm/`）包含：
    *   `node.tsx`: 画布上的卡片视图（View）。
    *   `panel.tsx`: 双击节点弹出的右侧配置表单（Config）。
    *   `default.ts`: 节点的初始元数据（Metadata，包含默认宽高、标题等）。
    *   `types.ts`: TypeScript 类型定义。
*   **交互**：
    *   **单击**：选中节点（高亮）。
    *   **双击**：打开右侧配置面板。
    *   **右键**：弹出菜单（复制、删除）。
    *   **连线**：从源节点的 Handle 拖出，**松开在目标节点的任意区域**即可自动连接（无需精确对准目标 Handle）。

### 3.2 节点选择器 (Node Selector)
位于 `components/workflow/block-selector`。
*   **逻辑**：它读取通过 `hooksStore` 传入的 `availableNodesMetaData`。
*   **修改**：如果您想隐藏某些节点，只需在 `app/canvas/node-defaults.ts` 数组中移除对应的 Default 导入即可。

### 3.3 配置面板 (Panel)
位于 `components/workflow/panel` (主要逻辑) 和各节点的 `panel.tsx`。
*   **机制**：通过 ReactFlow 的选中状态触发渲染。它使用 `useNodeCrud` Hook 进行纯前端的状态修改，不依赖 API。

---

## 4. 二次开发与定制

### 4.1 如何新增一个自定义节点？

假设我们要增加一个 "SMS Sender" 节点。

1.  **定义类型**：
    在 `components/workflow/types.ts` 的 `BlockEnum` 枚举中添加 `SMS = 'sms'`。

2.  **创建组件目录**：
    复制 `components/workflow/nodes/start` 目录为 `components/workflow/nodes/sms`。

3.  **修改文件**：
    *   **`default.ts`**: 修改 `type: BlockEnum.SMS`，设置标题和图标。
    *   **`panel.tsx`**: 编写您的配置表单（如输入手机号、短信内容）。使用 `useNodeCrud` 获取和更新 `inputs`。
    *   **`node.tsx`**: 编写画布上显示的卡片 UI。

4.  **注册组件**：
    在 `components/workflow/nodes/components.ts` 中：
    *   将 `SMSNode` 注册到 `NodeComponentMap`。
    *   将 `SMSPanel` 注册到 `PanelComponentMap`。

5.  **启用节点**：
    在 `app/canvas/node-defaults.ts` 中引入 `SMSNodeDefault` 并添加到 `nodes` 数组。
    *   *提示*：别忘了在 `i18n/en-US/workflow.ts` 添加对应的翻译 `workflow.blocks.sms`。

### 4.2 如何修改现有节点的默认值？
直接编辑 `components/workflow/nodes/[node-type]/default.ts`。
例如，要修改 LLM 节点的默认 Prompt，编辑 `nodes/llm/default.ts` 中的 `defaultValue` 字段。

### 4.3 样式定制
项目使用 TailwindCSS。
*   **全局样式**：`app/components/workflow/style.css` 定义了 ReactFlow 的基础样式。
*   **主题色**：检查 `tailwind.config.js` 中的颜色变量（如 `primary`, `components-panel-bg`）。

### 4.4 数据持久化 (LocalStorage)
目前示例代码仅在内存中保存状态。要实现持久化：
1.  在 `handleWorkflowDataUpdate` 中调用 `localStorage.setItem('workflow-draft', JSON.stringify(payload))`.
2.  在页面加载时（`useEffect`）读取 LocalStorage 并调用 `setNodes` 和 `setEdges`。

---

## 5. 常见问题 (FAQ)

**Q: 为什么点击节点没有弹出编辑框？**
A: 请确认是否**双击**了节点。我们在最新版本中将交互修改为双击打开，单击仅选中。

**Q: 新增节点显示 "Initializing Node..."？**
A: 检查 `node-defaults.ts` 或该节点的 `default.ts`，确保 `defaultValue` 中包含 `type` 字段。

**Q: 报错 `language is not defined`？**
A: 确保您的组件被包裹在提供 i18n 上下文的组件中，并且 `use-checklist.ts` 钩子已修复（最新版代码已修复此问题）。

**Q: 图标不显示？**
A: 检查 `components/workflow/block-icon`，确认您的节点类型在该组件中有对应的图标映射。

---

## 6. 数据结构 (DSL) 参考

导出的 JSON 数据结构示例：

```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "custom",
      "data": {
        "id": "node-1",
        "type": "llm",
        "title": "LLM",
        "desc": "Invoke LLM...",
        "model": { "provider": "openai", "name": "gpt-3.5-turbo" },
        "prompt_template": [ ... ]
      },
      "position": { "x": 100, "y": 100 }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "start",
      "target": "node-1",
      "type": "custom"
    }
  ]
}
```