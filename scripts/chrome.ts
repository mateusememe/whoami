// Headless Chrome for the build scripts that render with it: the share
// cards (render-og-image.ts) and the résumé PDFs (render-cv.ts).

import { spawn } from "child_process";
import { existsSync, statSync } from "fs";

/** CHROME_PATH, else the usual install locations on macOS and Linux (GitHub's Ubuntu runners have Chrome). */
export function findChrome(): string | null {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  return candidates.find((path): path is string => !!path && existsSync(path)) ?? null;
}

/** Flags every run shares. Linux CI runners need the sandbox off. */
export function baseFlags(profileDir: string): string[] {
  return [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${profileDir}`,
    ...(process.platform === "linux" ? ["--no-sandbox"] : []),
  ];
}

/**
 * Runs Chrome until it has written `output`. Headless Chrome on macOS can
 * keep running after it writes the file, so wait for a fresh, non-empty
 * file and stop the process ourselves.
 */
export async function runChrome(chrome: string, args: string[], output: string, timeoutMs = 60_000): Promise<void> {
  const startedAt = Date.now();
  const child = spawn(chrome, args, { stdio: "ignore" });

  try {
    for (let waited = 0; waited < timeoutMs; waited += 250) {
      if (existsSync(output) && statSync(output).mtimeMs >= startedAt && statSync(output).size > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // let the write finish
        return;
      }
      if (child.exitCode !== null && !existsSync(output)) throw new Error(`Chrome exited with code ${child.exitCode}`);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error(`Timed out waiting for ${output}`);
  } finally {
    if (child.exitCode === null) {
      const exited = new Promise((resolve) => child.once("exit", resolve));
      child.kill();
      await exited;
    }
  }
}
