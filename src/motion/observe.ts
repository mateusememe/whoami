/**
 * Shared IntersectionObservers: one observer per option set instead of one
 * per element. Without IntersectionObserver (jsdom, very old browsers) the
 * callback never fires and callers keep their default, visible state.
 */
type Callback = (entry: IntersectionObserverEntry) => void;

interface Pool {
  observer: IntersectionObserver;
  callbacks: Map<Element, Callback>;
}

const pools = new Map<string, Pool>();

export interface ObserveOptions {
  rootMargin?: string;
  threshold?: number;
}

export function observe(element: Element, callback: Callback, options: ObserveOptions = {}): () => void {
  if (typeof IntersectionObserver === "undefined") return () => undefined;

  const rootMargin = options.rootMargin ?? "0px";
  const threshold = options.threshold ?? 0;
  const key = `${rootMargin}|${threshold}`;

  let pool = pools.get(key);
  if (!pool) {
    const callbacks = new Map<Element, Callback>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) callbacks.get(entry.target)?.(entry);
      },
      { rootMargin, threshold },
    );
    pool = { observer, callbacks };
    pools.set(key, pool);
  }

  pool.callbacks.set(element, callback);
  pool.observer.observe(element);

  const owner = pool;
  return () => {
    owner.callbacks.delete(element);
    owner.observer.unobserve(element);
  };
}

export function supportsObserver(): boolean {
  return typeof IntersectionObserver !== "undefined";
}
