# Dify Workflow Canvas 独立化复刻 - 开发进度记录

## 1. 项目背景与目标
**目标**：从开源项目 Dify 中剥离出 Workflow（工作流）编排器前端模块，使其成为一个**不依赖 Dify 后端**、**可独立运行**、**易于集成**的纯前端通用画布组件。
**用途**：用于嵌入到其他应用系统中，提供可视化的节点编排、连线和配置能力。

## 2. 技术栈概览
*   **源项目**：Dify (GitHub: langgenius/dify)
*   **核心框架**：Next.js 14+ (App Router)
*   **画布库**：ReactFlow (v11)
*   **状态管理**：Zustand
*   **样式库**：TailwindCSS
*   **包管理**：pnpm

## 3. 开发日志 (Development Log)

### 📅 2025-12-15：初始化与最小可行性验证 (MVP)

#### ✅ 已完成事项
1.  **源码获取与迁移**
    *   拉取 Dify 官方最新源码。
    *   将 `dify/web` 目录完整复刻至本地 `easy-canvas` 目录。
    *   配置 `pnpm` 环境并成功安装依赖（解决依赖冲突和 Node 版本兼容问题）。

2.  **环境配置**
    *   生成 `.env.local` 配置文件。
    *   修改 `next.config.js` 确保开发服务器配置正确。

3.  **构建独立入口 (`/canvas`)**
    *   **新建路由**：创建 `app/canvas/page.tsx`。
    *   **组件挂载**：引入 Dify 核心组件 `<Workflow />`。
    *   **数据模拟**：构造了基础的 `nodes`（开始/结束节点）和 `edges` 数据传给组件，实现了画布的初步渲染。

4.  **关键依赖解耦 (API Mocking)**
    *   **问题**：应用启动时会强制请求 `/system-features` 等接口，无后端导致页面卡死或报错。
    *   **解决方案**：修改 `service/common.ts`，拦截 `getSystemFeatures` 方法，使其直接返回本地默认配置 (`defaultSystemFeatures`)，绕过后端验证。

5.  **节点添加功能修复 (State Decoupling)**
    *   **问题**：左侧面板点击无法添加节点，因依赖后端返回的节点元数据 (Metadata) 和默认值。
    *   **解决方案**：
        *   创建 `app/canvas/node-defaults.ts`，聚合了核心节点（Start, End, LLM, Code, Answer, If-Else 等）的默认配置。
        *   在 `app/canvas/page.tsx` 中使用 `WorkflowWithInnerContext`，并将 `availableNodesMetaData` 通过 `hooksStore` 注入到上下文中。

6.  **节点属性面板修复 (Property Panel Mock)**
    *   **问题**：点击节点（如 LLM）弹出配置面板时，尝试请求 `/workspaces/.../models` 等后端接口获取模型列表和参数规则，导致报错或面板空白。
    *   **解决方案**：
        *   在 `service/common.ts` 中 Mock 了 `fetchModelProviders`、`fetchModelList`、`fetchModelParameterRules` 等关键 API。
        *   提供了本地的 Dummy Data（如 OpenAI GPT-3.5），使得面板能正常渲染并允许用户交互。

7.  **数据导出功能 (DSL Export)**
    *   **问题**：无后端环境下无法调用原有的 Export API。
    *   **解决方案**：
        *   在 `app/canvas/page.tsx` 中通过 `onWorkflowDataUpdate` 回调实时追踪画布状态（`nodes` 和 `edges`）。
        *   实现了前端纯 JS 的导出逻辑 (`handleExportDSL`)，将当前画布状态序列化为 JSON 并触发下载。
        *   添加了悬浮的 "Export DSL" 按钮。

8.  **端口迁移**
    *   **问题**：项目默认运行在 3000 端口，需要迁移至 3001 端口。
    *   **解决方案**：
        *   修改 `easy-canvas/package.json` 中的 `dev` 脚本，通过 `-p 3001` 参数指定运行端口。
        *   通过 `nohup` 方式在后台启动开发服务器，确保其在 3001 端口稳定运行。
        *   验证 `http://localhost:3001/canvas` 页面可正常访问。

9.  **上下文与渲染崩溃修复 (Context & Rendering Fixes)**
    *   **问题 1 (Provider Missing)**：`Workflow` 组件依赖多个 Context (ReactFlow, WorkflowContext, WorkflowHistory, DatasetsDetail) 但外层未包裹，导致 `useStore` 等 Hooks 报错。
        *   **修复**：重构 `WorkflowWithInnerContext`，完整包裹了 `ReactFlowProvider`, `WorkflowContextProvider`, `WorkflowHistoryProvider` 和 `DatasetsDetailProvider`。
    *   **问题 2 (Node Rendering)**：初始节点无法渲染，且 Start/End 节点报错 `Cannot read properties of undefined`。
        *   **修复**：
            *   修正初始节点类型：从 `BlockEnum` 改为注册的 `CUSTOM_NODE` ('custom')。
            *   补充数据结构：为 Start 节点补充 `variables: []`，为 End 节点补充 `outputs: []`，解决运行时崩溃。

10. **项目瘦身与清理 (Cleanup)**
    *   **删除**：移除了 `public/screenshots`、`public/logo`、`public/education` 等 Dify 原有品牌和演示素材。
    *   **禁用**：禁用了 `ReactScan` 调试工具，避免页面闪烁干扰。

### 📅 2025-12-17：业务代码清理与类型修复 (Refactoring & Type Fixes)

#### 📝 执行操作
1.  **大规模业务代码移除**
    *   执行了 Git 提交 `2b1c1f7`，移除了大量未使用的 Dify 业务路由，包括 `app/(commonLayout)` (Dashboard, Apps, Datasets), `app/(shareLayout)`, `app/account`, `app/signin`, `app/signup` 等。
    *   目标是进一步将项目聚焦于 `easy-canvas` 核心功能。

2.  **类型检查与修复 (Type Checking)**
    *   运行 `npm run type-check` 发现 55 个错误，主要源于删除了业务代码后，部分组件仍有残留引用（如 Billing, Education, Signin）。
    *   **修复 `service/common.ts`**：
        *   修正了枚举导入错误：`ModelTypeEnum` 等枚举此前被错误地作为类型导入，现已修正为值导入。
        *   补充了缺失的枚举定义：`CustomConfigurationStatusEnum`, `CurrentSystemQuotaTypeEnum`, `ModelStatusEnum`。
        *   修复了 `fetchDefaultModal` Mock 数据：补充了缺失的 `model_type` 字段，以匹配 `DefaultModelResponse` 类型定义。

3.  **引用清理与修复 (Cleanup & Fixes)**
    *   **修复 `app/canvas/page.tsx` 类型问题**：修改 `app/canvas/node-defaults.ts`，显式声明节点类型为 `NodeDefault<any>[]`，解决泛型不匹配问题。
    *   **清理 `Billing` 组件引用**：
        *   移除 `AppsFull` 组件及其相关逻辑：涉及 `create-app-modal`, `create-from-dsl-modal`, `duplicate-modal`, `switch-app-modal`, `explore/create-app-modal`。
        *   移除 `AnnotationFull` 组件及其相关逻辑：涉及 `add-annotation-modal`, `batch-add-annotation-modal`, `edit-annotation-modal`, `annotation-reply`。
        *   移除 `UpgradeBtn` 组件：涉及 `app-publisher`, `embedding-process`。
        *   移除 `Plan`, `PriorityLabel`, `VectorSpaceFull`, `PlanUpgradeModal` 引用：涉及 `header`, `embedding-process`, `step-one`。
    *   **清理测试与模拟文件**：
        *   `__mocks__/provider-context.ts`: 移除 Billing 引用，Mock `defaultPlan`。
        *   `__tests__/embedded-user-id-auth.test.tsx`: 删除引用已移除模块的测试文件。
        *   `context/modal-context.test.tsx`: 移除 Billing 引用，Mock Plan。
        *   `context/provider-context-mock.spec.tsx`: 移除 Billing 引用，Mock Plan。
    *   **清理 Service 层引用**：
        *   `service/apps.ts`, `models/app.ts`: 移除已删除的 `tracing` 模块引用。
        *   `service/use-billing.ts`: 移除已删除的 `service/billing` 引用，Mock 相关 Hook。
        *   `service/use-education.ts`: 移除已删除的 `app/education-apply/types` 引用。
    *   **其他清理**：
        *   `app-info.tsx`: 移除已删除的 `CardView` 引用。
        *   `custom-page/index.tsx`: 移除 `Billing` 引用，补充 `useTranslation` 导入，修复变量定义。
        *   `swr-initializer.tsx`: 移除 `education`, `signin` 引用。
        *   `forgot-password/page.tsx`: 移除 `signin` 引用。
        *   `apps/index.tsx`: 移除 `education` 引用。
        *   `datasets/create` 相关组件: 移除 `VectorSpaceFull`, `PlanUpgradeModal`, `UpgradeCard` 等引用。

4.  **构建验证 (Build Verification)**
    *   运行 `npm run type-check`：通过，无错误。
    *   运行 `npm run build`：失败，提示 `app/components/base` 下部分组件（如 `block-input`, `prompt-editor`）引用了已删除的 `app/configuration` 模块。
    *   **修复构建错误**：
        *   `app/components/base/block-input/index.tsx`: 本地实现简易 `VarHighlight` 组件，移除对 `app/configuration` 的引用。
        *   `app/components/base/features/new-feature-panel/conversation-opener/modal.tsx`: 暂时注释掉 `ConfirmAddVar` 相关逻辑（依赖已删除模块）。
        *   **注意**：`app/components/base/form` 和 `prompt-editor` 仍有残留引用，需进一步清理。

#### 🚧 当前问题 (Known Issues)
*   **构建失败**：`npm run build` 仍报错，因为 `app/components/base` 下的部分组件依赖了已删除的 `app/configuration` 模块。需要继续修复 `form` 和 `prompt-editor` 相关的引用。

#### 🔜 下一步计划
1.  **修复剩余构建错误**：清理 `app/components/base/form` 和 `prompt-editor` 中的无效引用。
2.  **验证构建**：再次运行 `npm run build`。

#### 💾 提交记录 (Commit History)
*   `beee410` (2025-12-17): chore: Resolve merge conflicts and cleanup Billing/Education dependencies. (Fixes Canvas page types, mocks, and removes unused component imports).

#### 🚧 当前状态
*   **运行情况**：项目已在 `http://localhost:3001/canvas` 成功启动并运行。
*   **功能表现**：
    *   [x] 基础节点渲染（Start/End，修复了渲染崩溃）。
    *   [x] 节点拖拽移动、缩放。
    *   [x] 节点连线。
    *   [x] **新增节点**：支持左侧面板和连线 "+" 按钮添加节点。
    *   [x] **节点配置**：支持 LLM 等核心节点的参数配置（Mock 数据）。
    *   [x] **数据导出**：支持导出当前工作流为 JSON 文件。
    *   [x] **端口迁移**：已成功迁移至 3001 端口。
    *   [x] **资源清理**：移除了无用的静态资源。
    *   [!] **代码清理**：项目仍包含大量 Dify 原有的无关页面（如 Chat, Datasets 等）和未使用的组件。

#### 🔜 下一步计划
1.  **界面精简**：目前画布是全屏的，但可能需要更精细的布局调整，移除可能残留的 Dify 全局样式干扰。
2.  **代码清理**：删除 `app/` 下除了 `canvas` 和 `components`以外的无关路由和页面（如 `(commonLayout)`, `(shareLayout)`, `account` 等），减轻项目体积。
3.  **组件打包**：将 `easy-canvas` 进一步封装为 npm 包，以便其他项目引用。

### 📅 2025-12-19：彻底去后端化与 UI 瘦身 (Complete Decoupling & UI Simplification)

#### ✅ 已完成事项
1.  **物理移除后端请求逻辑 (Physical Removal of Request Logic)**
    *   **核心转变**：从之前的“Service 层 Mock 拦截”策略转变为“组件层物理移除”。直接删除了组件和 Hook 中发起 API 请求的代码片段，从源头切断网络依赖。
    *   **清理范围**：
        *   **主入口 (`index.tsx`)**：删除了 `fetchAllInspectVars` 及工具列表的初始化调用。
        *   **节点选择器 (`BlockSelector`)**：在 `tabs.tsx` 和 `all-start-blocks.tsx` 中删除了工具、插件、触发器的获取 Hook，将数据源硬编码为空数组。
        *   **节点配置 (`use-config.ts`)**：重构了 LLM、Knowledge Retrieval、Tool、Webhook 等节点的配置逻辑，移除了 `fetchDatasets`、`fetchWebhookUrl` 等后端依赖，改为本地静态逻辑或空状态。
        *   **校验系统 (`use-checklist.ts`)**：重写了节点校验逻辑，移除了对远程插件状态、模型凭据的在线验证，仅保留纯前端的格式校验。
        *   **图标系统 (`use-tool-icon.ts`)**：移除了基于后端数据的动态图标查找逻辑，统一使用本地默认图标。

2.  **UI 极致简化**
    *   **顶栏 (Header)**：移除了“运行”、“预览”、“运行历史”、“环境变量”、“全局变量”等依赖后端的按钮。
    *   **属性面板 (Workflow Panel)**：移除了“单步运行”、插件授权状态、数据集管理入口等无效 UI。
    *   **操作栏 (Operator)**：保留最基础的画布操作（缩放、布局），移除与后端交互的功能。

3.  **构建与稳定性修复**
    *   修复了因移除逻辑引入的语法错误（如重复代码块）。
    *   修复了变量未定义导致的运行时崩溃（如 `currToolCollection`）。

#### 🚀 最终效果
*   **零请求**：浏览器控制台不再产生任何指向后端的 API 请求（包括 404 或 Connection Refused）。
*   **纯静态**：所有节点添加、连线、配置操作均在本地内存中完成，不依赖任何外部服务。

#### 🔜 下一步计划
1.  **本地持久化**：集成 LocalStorage 实现草稿自动保存。
2.  **Service 层清理**：虽然组件已断开调用，但 `service/` 目录下仍保留了大量无用的 API 定义文件，下一步可考虑物理删除或精简为仅保留类型定义。

#### 🐛 缺陷修复 (Bug Fixes)
1.  **修复新节点显示 "Initializing Node..." 的问题**
    *   **原因**：部分节点的默认配置 (`defaultValue`) 缺少 `type` 字段，导致独立版画布在添加新节点时无法识别节点类型。
    *   **修复**：在 `use-nodes-interactions.ts` 的 `handleNodeAdd` 和 `handleNodeChange` 中手动注入 `type` 字段，并增加了元数据缺失时的兜底处理。

### 📅 2025-12-20

#### 🐛 缺陷修复 (Bug Fixes)
1.  **修复节点配置面板不显示的问题**
    *   **问题**：点击画布中的节点，右侧配置/编辑面板未出现。
    *   **原因**：在重构和移除后端依赖的过程中，`Workflow` 组件渲染树中缺失了 `<Panel />` 组件，导致选中节点后无法渲染对应的配置表单。
    *   **修复**：在 `app/components/workflow/index.tsx` 中重新引入并渲染了 `<Panel />` 组件。
    *   **验证**：`Panel` 组件能正确监听 ReactFlow 的选中状态，并渲染基于本地配置 (`useNodeCrud`) 的节点表单，无需后端支持。

## 4. 目录结构说明 (Easy-Canvas)
```text
easy-canvas/
├── app/
│   ├── canvas/          # [新增] 独立画布的路由入口
│   │   ├── page.tsx     # 画布主页面，注入 Mock 数据和 Context，实现导出逻辑
│   │   └── node-defaults.ts # [新增] 本地化的节点默认配置聚合
│   └── components/
│       └── workflow/    # [核心] Dify 工作流组件源码
├── service/
│   └── common.ts        # [修改] Mock 了系统特性、模型列表、参数规则等 API
└── ...
```

---
*记录人：Gemini CLI Agent*
