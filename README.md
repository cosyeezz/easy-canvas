# Easy Canvas

**Easy Canvas** is a standalone, pure frontend workflow orchestration component extracted from [Dify](https://github.com/langgenius/dify). It allows developers to integrate a powerful, drag-and-drop flow editor into their own applications without any backend dependencies on the original Dify platform.

> **Status:** 🟢 Build Passing | 🚀 Standalone Ready

## Key Features

*   **Backend-Free**: All API dependencies have been mocked or removed. The canvas runs entirely in the browser using local state.
*   **Pure React**: Built with Next.js (App Router), ReactFlow, and TailwindCSS.
*   **Easy Integration**: Designed to be dropped into existing React/Next.js projects.
*   **Customizable**: Metadata-driven node configuration allows for easy extension.

## Getting Started

### Prerequisites

*   Node.js >= v18
*   pnpm >= v9

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm run dev
```

Visit `http://localhost:3001/canvas` to see the workflow editor in action.

### Production Build

```bash
pnpm run build
pnpm run start
```

## Documentation

For a comprehensive guide on how to integrate this component into your own project, architecture details, and customization instructions, please refer to the **[Integration Guide](./README_CANVAS.md)**.

## Project Structure

*   `app/canvas/`: The entry point for the standalone demo page.
*   `app/components/workflow/`: The core Workflow component library. **This is what you want to copy.**
*   `app/components/base/`: Shared UI components used by the workflow.
*   `service/`: Mocked service layer to satisfy type dependencies.

## License

This project is derived from Dify and inherits its open-source license (Apache 2.0 / See original repo for details).