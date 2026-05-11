import { expect, test } from "@playwright/test";

test("configure Medium / Easy, clear three matches, quit", async ({ page }) => {
  await page.goto("/");

  // Pick Medium board + Easy difficulty, then start. The radios are sr-only,
  // so click the surrounding label (which carries the value via htmlFor).
  await page.locator('label[for="boardSize-medium"]').click();
  await page.locator('label[for="difficulty-easy"]').click();
  await page.getByRole("button", { name: /start/i }).click();

  const board = page.getByLabel("Game board");
  await expect(board).toBeVisible();

  // Use the Hint button to surface a guaranteed-valid pair, then click both
  // hinted tiles. Repeat three times. Easy AI cadence is 2.5–4.5s/move so the
  // player can win the race for these three matches.
  let cleared = 0;
  for (let attempt = 0; attempt < 8 && cleared < 3; attempt++) {
    const before = await board.locator("button").count();
    await page.getByRole("button", { name: /^hint$/i }).click();
    const hinted = page.locator('[data-hinted="true"]');
    await expect(hinted).toHaveCount(2, { timeout: 2_000 });
    // Capture both test-ids before clicking — the hint clears on first Select.
    const ids = await hinted.evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-testid") ?? ""),
    );
    if (ids.length !== 2 || !ids[0] || !ids[1]) break;
    await page.locator(`[data-testid="${ids[0]}"]`).click();
    await page.locator(`[data-testid="${ids[1]}"]`).click();
    await page.waitForTimeout(150);
    const after = await board.locator("button").count();
    if (after < before) cleared++;
  }
  expect(cleared).toBeGreaterThanOrEqual(3);

  // Quit — leave the page.
  await page.goto("about:blank");
});
