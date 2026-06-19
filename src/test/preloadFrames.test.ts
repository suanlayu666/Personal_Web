import { describe, expect, it, vi } from "vitest";
import { preloadFrames } from "../lib/preloadFrames";

class TestImage {
  decoding = "";
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = "";

  constructor() {
    setTimeout(() => this.onload?.(), 0);
  }
}

describe("preloadFrames", () => {
  it("notifies after each loaded batch so the canvas can render the first frame early", async () => {
    vi.stubGlobal("Image", TestImage);
    const onProgress = vi.fn();

    const result = await preloadFrames(["frame-0.jpg", "frame-1.jpg", "frame-2.jpg"], 1, onProgress);

    expect(result.loaded).toHaveLength(3);
    expect(onProgress).toHaveBeenCalledTimes(3);
    expect(onProgress.mock.calls[0][0].loaded).toHaveLength(1);
    expect(onProgress.mock.calls[1][0].loaded).toHaveLength(2);
    expect(onProgress.mock.calls[2][0].loaded).toHaveLength(3);

    vi.unstubAllGlobals();
  });
});
