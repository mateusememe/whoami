/**
 * Adaptive resolution. Averages frame time over a window and steps the pixel
 * ratio down when the GPU cannot hold the target frame rate. It never steps
 * back up, which avoids oscillating between two resolutions.
 */
export interface GovernorOptions {
  initialPixelRatio: number;
  minPixelRatio?: number;
  step?: number;
  /** Frame budget in seconds. Default: 1/45 s. */
  budget?: number;
  windowSize?: number;
}

export class PerformanceGovernor {
  pixelRatio: number;

  private readonly minPixelRatio: number;
  private readonly step: number;
  private readonly budget: number;
  private readonly windowSize: number;
  private total = 0;
  private frames = 0;

  constructor({ initialPixelRatio, minPixelRatio = 1, step = 0.25, budget = 1 / 45, windowSize = 90 }: GovernorOptions) {
    this.pixelRatio = initialPixelRatio;
    this.minPixelRatio = Math.min(minPixelRatio, initialPixelRatio);
    this.step = step;
    this.budget = budget;
    this.windowSize = windowSize;
  }

  /** Records one frame. Returns the new pixel ratio when it changed, otherwise null. */
  sample(delta: number): number | null {
    this.total += delta;
    this.frames += 1;
    if (this.frames < this.windowSize) return null;

    const average = this.total / this.frames;
    this.total = 0;
    this.frames = 0;

    if (average <= this.budget || this.pixelRatio <= this.minPixelRatio) return null;
    this.pixelRatio = Math.max(this.minPixelRatio, this.pixelRatio - this.step);
    return this.pixelRatio;
  }

  /** Drops the current window, e.g. after the tab was hidden. */
  reset(): void {
    this.total = 0;
    this.frames = 0;
  }
}
