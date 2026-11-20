import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

// The endpoint is read when the module loads, so each case imports it fresh.
async function analytics(endpoint: string) {
  vi.resetModules();
  vi.stubEnv("VITE_GOATCOUNTER_URL", endpoint);
  return import("@/lib/analytics");
}

const scripts = () => [...document.head.querySelectorAll<HTMLScriptElement>('script[src="https://gc.zgo.at/count.js"]')];

describe("analytics", () => {
  beforeEach(() => {
    for (const script of scripts()) script.remove();
    delete window.goatcounter;
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("stay off without an endpoint: no script, nothing sent", async () => {
    const { analyticsEnabled, trackPage } = await analytics("");
    expect(analyticsEnabled).toBe(false);
    trackPage("/whoami/");
    expect(scripts()).toHaveLength(0);
  });

  it("respect Do Not Track", async () => {
    // jsdom has no doNotTrack; define it for this case.
    Object.defineProperty(navigator, "doNotTrack", { value: "1", configurable: true });
    const { trackPage } = await analytics("https://example.goatcounter.com/count");
    trackPage("/whoami/");
    expect(scripts()).toHaveLength(0);
    Reflect.deleteProperty(navigator, "doNotTrack");
  });

  it("load GoatCounter once, without its automatic count, and send pages and events", async () => {
    const { analyticsEnabled, trackEvent, trackPage } = await analytics("https://example.goatcounter.com/count");
    expect(analyticsEnabled).toBe(true);
    trackPage("/whoami/pt/");
    trackEvent("cv-download");
    expect(scripts()).toHaveLength(1);
    const script = scripts()[0];
    expect(script.dataset.goatcounter).toBe("https://example.goatcounter.com/count");
    expect(JSON.parse(script.dataset.goatcounterSettings ?? "{}")).toEqual({ no_onload: true });

    const count = vi.fn();
    window.goatcounter = { count };
    script.onload?.(new Event("load"));
    await vi.waitFor(() => expect(count).toHaveBeenCalledTimes(2));
    expect(count).toHaveBeenCalledWith({ path: "/whoami/pt/" });
    expect(count).toHaveBeenCalledWith({ path: "cv-download", title: "cv-download", event: true });
  });
});
