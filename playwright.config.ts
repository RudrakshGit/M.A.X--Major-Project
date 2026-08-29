import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.E2E_BASE_URL ?? "https://max-rudrakshm099-7145s-projects.vercel.app";

// Vercel Deployment Protection stays on; automation reaches the app with the
// project's bypass secret instead of the site being made public.
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    extraHTTPHeaders: bypass ? { "x-vercel-protection-bypass": bypass } : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/, use: { ...devices["Pixel 7"] } },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], storageState: "e2e/.auth/student.json" },
      dependencies: ["setup"],
    },
  ],
});
