import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // e2e/ is Playwright's; vitest owns unit tests only.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
  },
});
