# Independent Workflow Canvas

This project is a fork of Dify's frontend, customized to run the Workflow Canvas independently.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

3.  **Access the Canvas:**
    Open [http://localhost:3000/canvas](http://localhost:3000/canvas) in your browser.

## Modifications

- **`app/canvas/page.tsx`**: The main entry point for the standalone canvas.
- **`service/common.ts`**: Mocked `getSystemFeatures` to avoid backend API dependencies during initialization.
- **`app/components/workflow`**: Contains the core workflow logic.

## Notes

- The canvas is currently initialized with dummy data (Start and End nodes).
- Backend API calls are mocked or disabled for the canvas route.
- You can extend `app/canvas/page.tsx` to inject your own nodes and edges.
