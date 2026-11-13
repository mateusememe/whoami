import { damp, readScrollProgress } from "@/lib/motion";

/**
 * Tracks pointer position (normalized to -1..1) and page scroll progress
 * (0..1). Raw values update on events; smoothed values update once per frame.
 */
export class InputTracker {
  readonly pointer = { x: 0, y: 0 };
  scroll = 0;
  /** 0..1: rises while a mouse is moving, decays when it rests or leaves. */
  pointerPresence = 0;

  private lastMove = -Infinity;

  private readonly target = { x: 0, y: 0, scroll: 0 };

  constructor() {
    this.target.scroll = readScrollProgress();
    this.scroll = this.target.scroll;
    window.addEventListener("pointermove", this.handlePointer, { passive: true });
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleScroll);
  }

  update(delta: number): void {
    this.pointer.x = damp(this.pointer.x, this.target.x, 3, delta);
    this.pointer.y = damp(this.pointer.y, this.target.y, 3, delta);
    this.scroll = damp(this.scroll, this.target.scroll, 5, delta);
    const active = performance.now() - this.lastMove < 2600;
    this.pointerPresence = damp(this.pointerPresence, active ? 1 : 0, active ? 5 : 1.5, delta);
  }

  dispose(): void {
    window.removeEventListener("pointermove", this.handlePointer);
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleScroll);
  }

  private handlePointer = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    this.target.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.target.y = (event.clientY / window.innerHeight) * 2 - 1;
    this.lastMove = performance.now();
  };

  private handleScroll = () => {
    this.target.scroll = readScrollProgress();
  };
}
