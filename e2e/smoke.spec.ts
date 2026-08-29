import { test, expect } from "@playwright/test";

test("a signed-in student lands in the chat", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByPlaceholder(/message max/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /urgent help/i })).toBeVisible();
});

test("every section is reachable from the navigation", async ({ page }) => {
  await page.goto("/");
  for (const label of ["Journal", "Check in", "Read", "Journeys"]) {
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page.locator("main")).not.toBeEmpty();
    await expect(page.getByRole("link", { name: /urgent help/i })).toBeVisible();
  }
  await page.getByRole("link", { name: "Chat", exact: true }).click();
  await expect(page.getByPlaceholder(/message max/i)).toBeVisible();
});

test("urgent help is reachable from any screen and lists the helplines", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Journeys", exact: true }).click();
  await page.getByRole("link", { name: /urgent help/i }).click();
  await expect(page.getByText("14416")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/1800-?599-?0019/)).toBeVisible();
});

test("the companion replies to an ordinary message", async ({ page }) => {
  await page.goto("/");
  const box = page.getByPlaceholder(/message max/i);
  await box.fill("hi, feeling stressed about exams");
  await page.keyboard.press("Enter");
  const reply = page.locator("[class*='rounded-bl-sm']").first();
  await expect(reply).toBeVisible({ timeout: 45_000 });
  await expect(reply).not.toBeEmpty();
});

test("a Hinglish crisis message shows the helpline card, not a reply", async ({ page }) => {
  await page.goto("/");
  const box = page.getByPlaceholder(/message max/i);
  await box.fill("jeene ka mann nahi kar raha");
  await page.keyboard.press("Enter");
  await expect(page.getByText(/urgent help/i).first()).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("14416")).toBeVisible();
  await expect(page.getByPlaceholder(/session paused/i)).toBeVisible();
});

test("a screener scores and shows a band", async ({ page }) => {
  await page.goto("/");
  await page.goto("/assessments/gad7");
  const groups = page.getByRole("radiogroup");
  await expect(groups.first()).toBeVisible({ timeout: 20_000 });
  const questions = await groups.count();
  expect(questions).toBeGreaterThan(0);
  // Answer every question the way a student would: click the option label.
  for (let i = 0; i < questions; i++) {
    await groups.nth(i).getByText("Not at all", { exact: true }).first().click();
  }
  await page.getByRole("button", { name: /submit|finish|see result/i }).click();
  await expect(page.locator("main")).toContainText(/minimal|mild|moderate|severe/i, { timeout: 20_000 });
});

test("the campus dashboard refuses to show a small cohort", async ({ page }) => {
  await page.goto("/");
  const response = await page.goto("/campus");
  expect(response?.status()).toBeLessThan(500);
  // A fresh student is not an admin, so the dashboard must refuse outright.
  await expect(page.locator("body")).toContainText(
    /access restricted|administrator permissions|not enough data|minimum/i,
    { timeout: 20_000 },
  );
});

// Runs last on purpose: it destroys the shared session account, which also
// keeps the test database from accumulating accounts run after run.
test("a student can export their data and delete their account", async ({ page }) => {
  await page.goto("/settings");

  // Assert the export contract rather than the browser's download plumbing:
  // the request carries the signed-in session from storageState.
  const response = await page.request.get("/api/export");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-disposition"]).toContain("max-data-export");
  const body = await response.json();
  // docs/data-model.md promises everything, conversations included.
  expect(Object.keys(body.data)).toEqual(
    expect.arrayContaining(["conversations", "messages", "journals", "screeners", "moods"]),
  );

  await expect(page.getByRole("link", { name: /export my data/i })).toBeVisible();

  await page.getByRole("button", { name: /delete my account/i }).click();
  await page.getByRole("button", { name: /yes, delete everything/i }).click();

  // Deleting ends the session, so the app must send them back to sign-in.
  await expect(page).toHaveURL(/sign-in/, { timeout: 30_000 });
});
