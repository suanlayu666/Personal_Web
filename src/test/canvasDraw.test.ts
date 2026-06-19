import { describe, expect, it } from "vitest";
import { getCoverDrawRect } from "../lib/canvasDraw";

describe("getCoverDrawRect", () => {
  it("covers a wide canvas with a tall source image", () => {
    expect(getCoverDrawRect(1920, 1080, 1080, 1920)).toEqual({
      dx: 0,
      dy: -1166.67,
      dw: 1920,
      dh: 3413.33,
    });
  });

  it("covers a tall canvas with a wide source image", () => {
    expect(getCoverDrawRect(390, 844, 1920, 1080)).toEqual({
      dx: -555.22,
      dy: 0,
      dw: 1500.44,
      dh: 844,
    });
  });
});
