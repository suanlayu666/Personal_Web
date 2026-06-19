import { describe, expect, it } from "vitest";
import { buildFrameList, getFrameSrc } from "../lib/framePaths";

describe("framePaths", () => {
  it("builds padded image frame urls with the Vite base url", () => {
    expect(getFrameSrc("desktop", 0, "/SuanLayu_Web/")).toBe("/SuanLayu_Web/image/frames0000.jpg");
    expect(getFrameSrc("mobile", 23, "./")).toBe("./image/frames0023.jpg");
  });

  it("builds a finite list for positive counts", () => {
    expect(buildFrameList("desktop", 3, "/")).toEqual([
      "/image/frames0000.jpg",
      "/image/frames0001.jpg",
      "/image/frames0002.jpg",
    ]);
  });

  it("returns an empty list when no frames are available", () => {
    expect(buildFrameList("desktop", 0, "/")).toEqual([]);
  });
});
