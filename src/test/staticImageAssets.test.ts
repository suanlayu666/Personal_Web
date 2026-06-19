import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { copyDirectoryRecursive, getPublicAssetRequestPath } from "../../vite.frame-assets";

describe("static image assets", () => {
  it("copies extracted frame assets into the build output image directory", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "personal-web-assets-"));
    const source = path.join(root, "image");
    const target = path.join(root, "dist", "image");
    const framePath = path.join(source, "frames0000.jpg");

    await mkdir(source, { recursive: true });
    await writeFile(framePath, "frame-binary");

    await copyDirectoryRecursive(source, target);

    expect(existsSync(path.join(target, "frames0000.jpg"))).toBe(true);
    await expect(readFile(path.join(target, "frames0000.jpg"), "utf8")).resolves.toBe("frame-binary");
  });

  it("maps public image requests only when they stay inside the image route", () => {
    expect(getPublicAssetRequestPath("/image/frames0000.jpg?raw=1", "/image")).toBe("frames0000.jpg");
    expect(getPublicAssetRequestPath("/assets/index.js", "/image")).toBeNull();
    expect(getPublicAssetRequestPath("/image/../package.json", "/image")).toBeNull();
  });
});
