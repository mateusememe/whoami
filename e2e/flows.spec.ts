import { expect, test } from "@playwright/test";
import { collectErrors, settle } from "./support";

test.use({ viewport: { width: 1440, height: 900 } });

test("opens a project from the gallery and comes back to the same place", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  await settle(page);
  const link = page.locator('#projects a[href*="/projects/"]').first();
  await link.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const href = await link.getAttribute("href");
  const before = await page.evaluate(() => window.scrollY);
  await link.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator("h1")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeGreaterThan(before - 80);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(80);
  expect(errors).toEqual([]);
});

test("switching language keeps the page", async ({ page }) => {
  await page.goto("/projects/codecash/");
  await settle(page);
  const title = await page.locator("h1").textContent();
  await page.getByRole("button", { name: /^PT, / }).click();
  await expect(page).toHaveURL(/\/pt\/projects\/codecash\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("h1")).toHaveText(title ?? "");
  await expect(page.getByRole("navigation", { name: "Você está em" })).toBeVisible();
});

test("the command palette opens with Ctrl+K and goes to a section", async ({ page }) => {
  await page.goto("/");
  await settle(page);
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Command palette" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("combobox").fill("contact");
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  // The contact section is the last one: the page scrolls to it, or as far as it can.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const top = document.getElementById("contact")!.getBoundingClientRect().top;
          const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
          return top < 200 || atBottom;
        }),
      { timeout: 6000 },
    )
    .toBe(true);
});

test("the theme toggle flips the color scheme and remembers it", async ({ page }) => {
  await page.goto("/");
  await settle(page);
  const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByRole("button", { name: dark ? "Switch to light mode" : "Switch to dark mode" }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(!dark);
  await page.reload();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(!dark);
});
