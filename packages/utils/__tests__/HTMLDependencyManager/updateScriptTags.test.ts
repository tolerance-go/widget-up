import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";
import { JSDOM } from "jsdom";
import { formatHeadHtml } from "../_utils";

describe("HTMLDependencyManager", () => {
  let htmlDependencyManager: HTMLDependencyManager;
  let document: Document;

  beforeEach(() => {
    // 使用 JSDOM 创建一个新的 Document 对象
    document = new JSDOM(`<html><head></head><body></body></html>`).window
      .document;
    // 创建 HTMLDependencyManager 的实例
    htmlDependencyManager = new HTMLDependencyManager(
      async () => ["1.0.0", "2.0.0"],
      document,
      (dep) => `path/to/${dep.name}@${dep.version}.js`
    );
  });

  it("should correctly update script tags when dependencies are added", async () => {
    // 依赖更新前，确保无脚本标签
    expect(document.head.querySelectorAll("script").length).toBe(0);

    // 添加依赖
    await htmlDependencyManager.addDependency("libA", "^1.0.0");

    // 验证脚本标签被添加
    let scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(1);
    expect(scripts[0].src).toBe("path/to/libA@1.0.0.js");

    // 添加另一个依赖
    await htmlDependencyManager.addDependency("libB", "^2.0.0");

    // 验证新脚本标签被添加
    scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(2);
    expect(scripts[1].src).toBe("path/to/libB@2.0.0.js");
  });

  it("should correctly remove outdated script tags when dependencies are updated", async () => {
    // 首先添加一个脚本标签
    const script = document.createElement("script");
    script.src = "path/to/libA@1.0.0.js";
    document.head.appendChild(script);

    // 添加依赖并触发更新
    await htmlDependencyManager.addDependency("libA", "^2.0.0");

    const scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(1);
    expect(scripts[0].src).toBe("path/to/libA@2.0.0.js");
  });

  it("should handle multiple updates correctly", async () => {
    // 添加初始依赖
    await htmlDependencyManager.addDependency("libA", "^1.0.0");
    await htmlDependencyManager.addDependency("libB", "^1.0.0");

    // 更新一个依赖版本
    await htmlDependencyManager.addDependency("libA", "^2.0.0");

    // 验证正确的脚本更新
    const scripts = document.head.querySelectorAll("script");
    expect(scripts.length).toBe(3);
    expect(scripts[0].src).toBe("path/to/libA@1.0.0.js");
    expect(scripts[1].src).toBe("path/to/libA@2.0.0.js");
    expect(scripts[2].src).toBe("path/to/libB@1.0.0.js");

    expect(formatHeadHtml(document)).toMatchInlineSnapshot(`
      "<script src="path/to/libA@1.0.0.js"></script>
      <script src="path/to/libA@2.0.0.js"></script>
      <script src="path/to/libB@1.0.0.js"></script>"
    `);
  });
});
