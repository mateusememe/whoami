import { expect, test } from "@playwright/test";
import { SAMPLE_URLS, VIEWPORTS, layoutIssues, settle } from "./support";

// One URL per kind of page at nine widths: nothing sideways, nothing too small.
for (const url of SAMPLE_URLS) {
  for (const viewport of VIEWPORTS) {
    test(`layout of ${url} at ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto(url);
      await settle(page);
      // Scroll through the page so every lazy and scroll-driven part has rendered, then back up.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
      });
      await page.waitForTimeout(400);
      const issues = await layoutIssues(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      issues.push(...(await layoutIssues(page)));
      await testInfo.attach(`${viewport.width}px`, {
        body: await page.screenshot({ fullPage: false }),
        contentType: "image/png",
      });
      expect([...new Set(issues)]).toEqual([]);
    });
  }
}
