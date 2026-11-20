import { expect, test } from "@playwright/test";
import { layoutIssues } from "./support";

// The layout checker itself: it must flag each kind of problem and pass a clean page.
test("the layout checker flags overflow, small text and small targets", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.setContent(`
    <body style="margin:0;font-size:16px">
      <div id="root"><div style="overflow-x:clip">
        <p style="white-space:nowrap">${"wide ".repeat(40)}</p>
        <p style="font-size:10px">tiny text</p>
        <button style="width:20px;height:20px;padding:0">x</button>
        <p>A sentence with <a href="#a">an inline link</a> is fine.</p>
        <div aria-hidden="true" style="white-space:nowrap">${"decoration ".repeat(40)}</div>
        <span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">${"screen reader only ".repeat(10)}</span>
      </div></div>
    </body>`);
  const issues = await layoutIssues(page);
  expect(issues.some((issue) => issue.startsWith("text past the edge") && issue.includes("wide"))).toBe(true);
  expect(issues.some((issue) => issue.startsWith("text at 10px"))).toBe(true);
  expect(issues.some((issue) => issue.startsWith("target 20×20px"))).toBe(true);
  expect(issues.join("\n")).not.toMatch(/inline link|decoration|screen reader/);

  await page.setContent(`<body style="margin:0"><div id="root"><div><p>Clean.</p><button style="width:44px;height:44px">ok</button></div></div></body>`);
  expect(await layoutIssues(page)).toEqual([]);
});
