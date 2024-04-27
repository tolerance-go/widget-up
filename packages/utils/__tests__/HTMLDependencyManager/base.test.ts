import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";
import { JSDOM } from "jsdom";

describe("HTMLDependencyManager base", () => {
  let htmlDependencyManager: HTMLDependencyManager;
  const mockFetchVersionList = jest.fn();

  beforeEach(() => {
    // 每个测试前重置 mock 和实例
    mockFetchVersionList.mockReset();
    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    htmlDependencyManager = new HTMLDependencyManager(mockFetchVersionList, jsdom.window.document);
  });

  test("addDependency adds a new dependency correctly", async () => {
    const dependency = "react";
    const versionRange = "^16.8.0";
    const versions = ["16.8.0", "16.8.6", "17.0.0"];

    // 设置 mock 返回值
    mockFetchVersionList.mockResolvedValue(versions);

    const resolvedVersion = await htmlDependencyManager.addDependency(
      dependency,
      versionRange,
    );

    expect(resolvedVersion).toBe("16.8.6");
    expect(mockFetchVersionList).toHaveBeenCalledWith(dependency);
    expect(mockFetchVersionList).toHaveBeenCalledTimes(1);
    expect(htmlDependencyManager.getDependencies()).toHaveProperty(dependency);
  });

  test("removeDependency removes a specific version correctly", async () => {
    const dependency = "react";
    const versionRange = "^16.8.0";
    const versions = ["16.8.0", "16.8.6"];

    // 初始添加依赖
    mockFetchVersionList.mockResolvedValue(versions);
    await htmlDependencyManager.addDependency(dependency, versionRange);

    // 移除依赖
    await htmlDependencyManager.removeDependency(dependency, versionRange);

    // 检查依赖是否被移除
    const deps = htmlDependencyManager.getDependencies();
    expect(deps[dependency]).toBeUndefined();
  });
});
