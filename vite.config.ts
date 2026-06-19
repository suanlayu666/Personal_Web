import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { localFrameAssetsPlugin } from "./vite.frame-assets";

export default defineConfig({
  base: "./",
  plugins: [react(), localFrameAssetsPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: true,
    globals: true,
    include: ["src/test/**/*.{test,spec}.{ts,tsx}"],
  },
});
