import { expect, test } from "@playwright/test";

test("home page shows the wordmark", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Connect");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Animal");
});
