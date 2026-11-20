import { expect, test } from "@playwright/test";
import { collectErrors, layoutIssues, settle } from "./support";

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

for (const [path, label] of [
  ["/", "Download CV"],
  ["/pt/", "Baixar CV"],
  ["/es/", "Descargar CV"],
] as const) {
  test(`the hero links the résumé PDF in its language (${path})`, async ({ page, request }) => {
    await page.goto(path);
    const link = page.locator("#top, section").first().getByRole("link", { name: new RegExp(label) });
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/cv\/mateus-mendonca-monteiro-[a-z]+-(en|pt|es)\.pdf$/);
    expect(href).toContain(path === "/" ? "-en.pdf" : `-${path.slice(1, 3)}.pdf`);
    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });
}

test("the terminal opens with Ctrl+`, answers and navigates", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/pt/");
  await settle(page);
  await page.keyboard.press("Control+Backquote");
  const dialog = page.getByRole("dialog", { name: "Terminal" });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole("textbox", { name: "Comando" });
  await expect(input).toBeFocused();
  await input.fill("whoami");
  await input.press("Enter");
  await expect(dialog.getByRole("log")).toContainText("Mateus Mendonça Monteiro");
  expect(await layoutIssues(page)).toEqual([]);
  await input.fill("open us");
  await input.press("Tab");
  await expect(input).toHaveValue("open uses ");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/pt\/uses\/$/);
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "Ferramentas" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("the terminal fills a phone screen and keeps its layout", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/");
  await settle(page);
  await page.keyboard.press("Control+Backquote");
  const dialog = page.getByRole("dialog", { name: "Terminal" });
  await expect(dialog).toBeVisible();
  // Measured once the opening animation (a slight scale) has finished.
  await expect.poll(async () => (await dialog.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(374);
  expect((await dialog.boundingBox())?.height).toBeGreaterThanOrEqual(699);
  const input = dialog.getByRole("textbox", { name: "Command" });
  await input.fill("ls projects");
  await input.press("Enter");
  expect(await layoutIssues(page)).toEqual([]);
});

test("a project cover can be paused, stepped and scrubbed", async ({ page }) => {
  await page.goto("/projects/8-puzzle/");
  await settle(page);
  const time = page.locator("output");
  await expect.poll(async () => parseFloat((await time.textContent()) ?? "0")).toBeGreaterThan(0.2);
  await page.getByRole("button", { name: "Pause the animation" }).click();
  const paused = parseFloat((await time.textContent()) ?? "0");
  await page.waitForTimeout(400);
  expect(parseFloat((await time.textContent()) ?? "0")).toBe(paused);
  await page.getByRole("button", { name: "Forward 0.5 s" }).click();
  await expect.poll(async () => parseFloat((await time.textContent()) ?? "0")).toBeCloseTo(paused + 0.5, 1);
  await page.getByRole("slider", { name: "Animation timeline" }).fill("12");
  await expect(time).toHaveText("12.0 s");
  await page.getByRole("button", { name: "Restart" }).click();
  await expect(time).toHaveText("00.0 s");
});

test("a project page shows the repository's languages and last push from the snapshot", async ({ page }) => {
  await page.goto("/projects/rinha-backend-2026-c/");
  await expect(page.getByRole("heading", { name: "Languages in the repository" })).toBeVisible();
  await expect(page.getByText("Last push")).toBeVisible();
  await expect(page.locator("#project-languages + div + dl dt").first()).toHaveText("C");
});

test("moving between kinds of page renders each page, never the previous kind", async ({ page }) => {
  const errors = collectErrors(page);
  const notFound = page.getByText("Page Not Found");
  await page.goto("/projects/git-github-in-action/");
  await settle(page);

  // Project → talk (the "Presented at" link).
  await page.getByRole("link", { name: /Git e GitHub em Ação/ }).first().click();
  await expect(page).toHaveURL(/\/talks\/git-infoeste-2023\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Git e GitHub em Ação" })).toBeVisible();
  await expect(notFound).toHaveCount(0);

  // Talk → project (the project link).
  await page.getByRole("link", { name: /git-github-in-action/ }).first().click();
  await expect(page).toHaveURL(/\/projects\/git-github-in-action\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "git-github-in-action" })).toBeVisible();

  // Project → /now → /uses → a project, through the footer and the /now chips.
  await page.locator("footer").last().getByRole("link", { name: "Now" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Now" })).toBeVisible();
  await page.locator("footer").last().getByRole("link", { name: "Uses" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Uses" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1, name: "Now" })).toBeVisible();
  await page.getByRole("link", { name: "rinha-backend-2026-c" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "rinha-backend-2026-c" })).toBeVisible();
  await expect(notFound).toHaveCount(0);
  expect(errors).toEqual([]);
});
