/**
 * Page views and a few events through GoatCounter (https://www.goatcounter.com):
 * no cookies, no personal data, no consent banner. Off unless the build has
 * VITE_GOATCOUNTER_URL (the deploy reads it from the repository variable
 * GOATCOUNTER_URL), and off for visitors who send Do Not Track or Global
 * Privacy Control. The script loads when the browser is idle, after the page.
 */

const ENDPOINT: string = import.meta.env.VITE_GOATCOUNTER_URL ?? "";
const SCRIPT = "https://gc.zgo.at/count.js";

/** True when this build counts visits (decides the footer note too). */
export const analyticsEnabled = ENDPOINT.length > 0;

interface GoatCounter {
  count: (vars: { path: string; title?: string; event?: boolean }) => void;
}

declare global {
  interface Window {
    goatcounter?: GoatCounter & { no_onload?: boolean };
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

let loading: Promise<GoatCounter | null> | null = null;

/** The visitor asked not to be tracked. */
function optedOut(): boolean {
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

function load(): Promise<GoatCounter | null> {
  loading ??= new Promise((resolve) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = SCRIPT;
    script.dataset.goatcounter = ENDPOINT;
    // Count by hand: the app changes pages without reloading.
    script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
    script.onload = () => resolve(window.goatcounter?.count ? window.goatcounter : null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return loading;
}

function send(vars: { path: string; title?: string; event?: boolean }): void {
  if (!analyticsEnabled || typeof window === "undefined" || optedOut()) return;
  void load().then((counter) => counter?.count(vars));
}

/** A page view; `path` is the full pathname (with the deployment base). */
export function trackPage(path: string): void {
  send({ path });
}

/** A named event, such as "cv-download" or "palette-open". */
export function trackEvent(name: string): void {
  send({ path: name, title: name, event: true });
}
