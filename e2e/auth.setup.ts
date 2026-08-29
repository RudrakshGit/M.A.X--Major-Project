import { test as setup, expect } from "@playwright/test";

// One account for the whole suite. Signing up per test trips Better Auth's rate
// limiter, which then looks like an application failure in every later test.
const STATE = "e2e/.auth/student.json";

setup("create a student and save the session", async ({ page }) => {
  await page.goto("/sign-up");
  await page.getByLabel("Username").fill(`e2e${Date.now().toString(36)}`);
  await page.getByLabel("Password").fill("TestPassword123!");
  await page.getByRole("button", { name: /sign up/i }).click();
  await expect(page.getByPlaceholder(/message max/i)).toBeVisible({ timeout: 30_000 });
  await page.context().storageState({ path: STATE });
});
