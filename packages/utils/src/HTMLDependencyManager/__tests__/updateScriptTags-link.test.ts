import { JSDOM } from "jsdom";
import { formatElementHtml, formatHeadHtml } from "@/__tests__/_utils";
import { HTMLDependencyManager } from "../HTMLDependencyManager";
import { DependencyListItem } from "../types";

describe("HTMLDependencyManager", () => {
  let manager: HTMLDependencyManager;
  let document: Document;
  let scriptContainer: HTMLElement;
  let linkContainer: HTMLElement;

  beforeEach(() => {
    // 使用 JSDOM 创建一个新的 Document 对象
    document = new JSDOM(`<html><head></head><body></body></html>`).window
      .document;
    // 创建 HTMLDependencyManager 的实例
    manager = new HTMLDependencyManager({
      fetchVersionList: async () => ["1.0.0", "2.0.0"],
      document,
      scriptSrcBuilder: (dep: DependencyListItem) =>
        `path/to/${dep.name}@${dep.version}.js`,
      linkHrefBuilder: (dep: DependencyListItem) =>
        `path/to/${dep.name}@${dep.version}.css`,
    });
    scriptContainer = manager.tagManager.getScriptContainer();
    linkContainer = manager.tagManager.getLinkContainer();
  });

  it("should correctly update script tags when dependencies are added", async () => {
    // 依赖更新前，确保无脚本标签
    expect(scriptContainer.querySelectorAll("script").length).toBe(0);

    // 添加依赖
    await manager.addDependency("libA", "^1.0.0");

    // 验证脚本标签被添加
    let scripts = scriptContainer.querySelectorAll("script");
    expect(scripts.length).toBe(1);
    expect(scripts[0].src).toBe("path/to/libA@1.0.0.js");

    // 添加另一个依赖
    await manager.addDependency("libB", "^2.0.0");

    // 验证新脚本标签被添加
    scripts = scriptContainer.querySelectorAll("script");
    expect(scripts.length).toBe(2);

    expect(formatElementHtml(scriptContainer)).toMatchInlineSnapshot(`
      "<script src="path/to/libA@1.0.0.js" async="true" data-managed="true"></script>
      <script src="path/to/libB@2.0.0.js" async="true" data-managed="true"></script>"
    `);
    expect(formatElementHtml(linkContainer)).toMatchInlineSnapshot(`
      "<link href="path/to/libA@1.0.0.css" rel="stylesheet" data-managed="true">
      <link href="path/to/libB@2.0.0.css" rel="stylesheet" data-managed="true">"
    `);
  });

  it("should correctly remove outdated script tags when dependencies are updated", async () => {
    // 首先添加一个脚本标签
    const script = document.createElement("script");
    script.src = "path/to/libA@1.0.0.js";
    scriptContainer.appendChild(script);

    // 添加依赖并触发更新
    await manager.addDependency("libA", "^2.0.0");

    const scripts = scriptContainer.querySelectorAll("script");
    expect(scripts.length).toBe(2);
    expect(formatElementHtml(scriptContainer)).toMatchInlineSnapshot(`
      "<script src="path/to/libA@2.0.0.js" async="true" data-managed="true"></script>
      <script src="path/to/libA@1.0.0.js"></script>"
    `);
    expect(formatElementHtml(linkContainer)).toMatchInlineSnapshot(
      `"<link href="path/to/libA@2.0.0.css" rel="stylesheet" data-managed="true">"`
    );
  });

  it("should handle multiple updates correctly", async () => {
    // 添加初始依赖
    await manager.addDependency("libA", "^1.0.0");
    await manager.addDependency("libB", "^1.0.0");

    // 更新一个依赖版本
    await manager.addDependency("libA", "^2.0.0");

    // 验证正确的脚本更新
    const scripts = scriptContainer.querySelectorAll("script");
    expect(scripts.length).toBe(3);

    expect(formatElementHtml(scriptContainer)).toMatchInlineSnapshot(`
      "<script src="path/to/libA@1.0.0.js" async="true" data-managed="true"></script>
      <script src="path/to/libA@2.0.0.js" async="true" data-managed="true"></script>
      <script src="path/to/libB@1.0.0.js" async="true" data-managed="true"></script>"
    `);
    expect(formatElementHtml(linkContainer)).toMatchInlineSnapshot(`
      "<link href="path/to/libA@1.0.0.css" rel="stylesheet" data-managed="true">
      <link href="path/to/libA@2.0.0.css" rel="stylesheet" data-managed="true">
      <link href="path/to/libB@1.0.0.css" rel="stylesheet" data-managed="true">"
    `);
  });
});
