import { expect, test } from "@playwright/test";
import { ALL_URLS, collectErrors, settle } from "./support";

// Every prerendered page hydrates without a console error, in every language.
for (const url of ALL_URLS) {
  test(`hydrates ${url} without errors`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await settle(page);
    expect(errors).toEqual([]);
  });
}
