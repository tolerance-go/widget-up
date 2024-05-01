import { JSDOM } from "jsdom";
import { formatHeadHtml } from "@/__tests__/_utils";
import { HTMLDependencyManager } from "../HTMLDependencyManager";
import { DependencyDetail } from "../DependencyManager";

describe("HTMLDependencyManager", () => {
  let manager: HTMLDependencyManager;
  let document: Document;

  beforeEach(() => {
    // 使用 JSDOM 创建一个新的 Document 对象
    document = new JSDOM(`<html><head></head><body></body></html>`).window
      .document;
    // 创建 HTMLDependencyManager 的实例
    manager = new HTMLDependencyManager({
      fetchVersionList: async () => ["1.0.0", "2.0.0"],
      document,
      scriptSrcBuilder: (dep: DependencyDetail) =>
        `path/to/${dep.name}@${dep.version}.js`,
      linkHrefBuilder: (dep: DependencyDetail) =>
        `path/to/${dep.name}@${dep.version}.css`,
    });
  });

  it("should correctly update script tags when dependencies are added", async () => {
    // 依赖更新前，确保无脚本标签
    expect(document.head.querySelectorAll("script").length).toBe(0);

    // 添加依赖
    await manager.addDependency("libA", "^1.0.0");

    // 验证脚本标签被添加
    let scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(1);
    expect(scripts[0].src).toBe("path/to/libA@1.0.0.js");

    // 添加另一个依赖
    await manager.addDependency("libB", "^2.0.0");

    // 验证新脚本标签被添加
    scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(2);

    expect(formatHeadHtml(document)).toMatchInlineSnapshot(`
      "<link href="path/to/libA@1.0.0.css" rel="stylesheet" data-managed="true">
      <script src="path/to/libA@1.0.0.js" async="true" data-managed="true"></script>
      <link href="path/to/libB@2.0.0.css" rel="stylesheet" data-managed="true">
      <script src="path/to/libB@2.0.0.js" async="true" data-managed="true"></script>"
    `);
  });

  it("should correctly remove outdated script tags when dependencies are updated", async () => {
    // 首先添加一个脚本标签
    const script = document.createElement("script");
    script.src = "path/to/libA@1.0.0.js";
    document.head.appendChild(script);

    // 添加依赖并触发更新
    await manager.addDependency("libA", "^2.0.0");

    const scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(2);
    expect(formatHeadHtml(document)).toMatchInlineSnapshot(`
      "<link href="path/to/libA@2.0.0.css" rel="stylesheet" data-managed="true">
      <script src="path/to/libA@1.0.0.js"></script>
      <script src="path/to/libA@2.0.0.js" async="true" data-managed="true"></script>"
    `);
  });

  it("should handle multiple updates correctly", async () => {
    // 添加初始依赖
    await manager.addDependency("libA", "^1.0.0");
    await manager.addDependency("libB", "^1.0.0");

    // 更新一个依赖版本
    await manager.addDependency("libA", "^2.0.0");

    // 验证正确的脚本更新
    const scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(3);

    expect(formatHeadHtml(document)).toMatchInlineSnapshot(`
      "<link href="path/to/libA@1.0.0.css" rel="stylesheet" data-managed="true">
      <script src="path/to/libA@1.0.0.js" async="true" data-managed="true"></script>
      <script src="path/to/libB@1.0.0.js" async="true" data-managed="true"></script>
      <link href="path/to/libA@2.0.0.css" rel="stylesheet" data-managed="true">
      <script src="path/to/libA@2.0.0.js" async="true" data-managed="true"></script>
      <link href="path/to/libB@1.0.0.css" rel="stylesheet" data-managed="true">"
    `);
  });
});
