import { expect, test } from "@playwright/test";

test.describe("personal homepage", () => {
  test("renders the cinematic single-page story and navigates between sections", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Build What You Want." })).toBeVisible();
    await expect(page.getByText("做你想做的")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" }).getByText("简介")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" }).getByText("作品")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" }).getByText("路线")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" }).getByText("联系")).toBeVisible();
    await expect(page.getByLabel("Profile and current section")).toContainText("酸辣鱼");
    await expect(page.getByLabel("Profile and current section")).toContainText("@suanlayu666");

    const canvas = page.locator(".frame-canvas canvas");
    await expect(canvas).toBeVisible();
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(300);
    expect(canvasBox?.height).toBeGreaterThan(300);

    await page.getByRole("link", { name: "作品" }).click();
    await expect(page.getByRole("heading", { name: "精选项目" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "STM32 平衡车" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "UniFlow Lab" })).toBeVisible();

    await page.getByRole("link", { name: "路线" }).click();
    await expect(page.getByRole("heading", { name: "从想法到可运行 Demo" })).toBeVisible();

    await page.getByRole("link", { name: "联系" }).click();
    await expect(page.getByRole("heading", { name: "保持连接" })).toBeVisible();
    await expect(page.getByRole("link", { name: "GitHub" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Never Forget" })).toBeVisible();
  });

  test("keeps the profile hud anchored over the lower-right watermark area on desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chrome", "desktop-only placement check");

    await page.goto("/");

    const hudBox = await page.getByLabel("Profile and current section").boundingBox();
    const viewport = page.viewportSize();

    expect(hudBox).not.toBeNull();
    expect(viewport).not.toBeNull();

    expect(hudBox!.x + hudBox!.width).toBeGreaterThan(viewport!.width - 72);
    expect(hudBox!.y + hudBox!.height).toBeGreaterThan(viewport!.height - 72);
    expect(hudBox!.width).toBeGreaterThan(240);
    expect(hudBox!.height).toBeGreaterThan(120);
  });
});
