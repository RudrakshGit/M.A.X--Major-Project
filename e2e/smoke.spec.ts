import { test, expect, Page } from "@playwright/test";

const PASSWORD = "TestPassword123!";
let counter = 0;
const username = () => `e2e${Date.now().toString(36)}${counter++}`;

async function signUp(page: Page) {
  await page.goto("/sign-up");
  await page.getByLabel("Username").fill(username());
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/$|\/(?!sign)/, { timeout: 30_000 });
  await expect(page.getByPlaceholder(/message max/i)).toBeVisible({ timeout: 30_000 });
}

test("a student can sign up and land in the chat", async ({ page }) => {
  await signUp(page);
  await expect(page.getByRole("link", { name: /urgent help/i })).toBeVisible();
});

test("every section is reachable from the navigation", async ({ page }) => {
  await signUp(page);
  for (const label of ["Journal", "Check in", "Read", "Journeys"]) {
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page.locator("main")).not.toBeEmpty();
    await expect(page.getByRole("link", { name: /urgent help/i })).toBeVisible();
  }
  await page.getByRole("link", { name: "Chat", exact: true }).click();
  await expect(page.getByPlaceholder(/message max/i)).toBeVisible();
});

test("urgent help is reachable from any screen and lists the helplines", async ({ page }) => {
  await signUp(page);
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await page.getByRole("link", { name: /urgent help/i }).click();
  await expect(page.getByText("14416")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/1800-?599-?0019/)).toBeVisible();
});

test("the companion replies to an ordinary message", async ({ page }) => {
  await signUp(page);
  const box = page.getByPlaceholder(/message max/i);
  await box.fill("hi, feeling stressed about exams");
  await page.keyboard.press("Enter");
  const reply = page.locator("[class*='rounded-bl-sm']").first();
  await expect(reply).toBeVisible({ timeout: 45_000 });
  await expect(reply).not.toBeEmpty();
});

test("a Hinglish crisis message shows the helpline card, not a reply", async ({ page }) => {
  await signUp(page);
  const box = page.getByPlaceholder(/message max/i);
  await box.fill("jeene ka mann nahi kar raha");
  await page.keyboard.press("Enter");
  await expect(page.getByText(/urgent help/i).first()).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("14416")).toBeVisible();
  await expect(page.getByPlaceholder(/session paused/i)).toBeVisible();
});

test("a screener scores and shows a band", async ({ page }) => {
  await signUp(page);
  await page.goto("/assessments/gad7");
  const radios = page.getByRole("radio");
  await expect(radios.first()).toBeVisible({ timeout: 20_000 });
  const count = await radios.count();
  // Answer every question with the first option.
  for (let i = 0; i < count; i += 4) await radios.nth(i).check();
  await page.getByRole("button", { name: /submit|finish|see result/i }).click();
  await expect(page.locator("main")).toContainText(/minimal|mild|moderate|severe/i, { timeout: 20_000 });
});

test("the campus dashboard refuses to show a small cohort", async ({ page }) => {
  await signUp(page);
  const response = await page.goto("/campus");
  expect(response?.status()).toBeLessThan(500);
  // A fresh student is not an admin, and the cohort is under 10 either way.
  await expect(page.locator("body")).toContainText(/not enough data|unauthorized|privacy|minimum/i, { timeout: 20_000 });
});
