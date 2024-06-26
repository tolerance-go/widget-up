import { HTMLDependencyManager } from "@/src/htmlDependencyManager";
import { JSDOM } from "jsdom";
import { jest } from "@jest/globals";

describe("HTMLDependencyManager fetchVersionList", () => {
  let manager: HTMLDependencyManager;
  const mockFetchVersionList = jest.fn<(dependencyName: string) => Promise<string[]>>();

  beforeEach(() => {
    // 每个测试前重置 mock 和实例
    mockFetchVersionList.mockReset();
    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    manager = new HTMLDependencyManager({
      fetchVersionList: mockFetchVersionList,
      document: jsdom.window.document,
    });
  });

  test("fetchVersionList is called with the correct argument", async () => {
    const dependency = "vue";
    const versionRange = "^2.6.0";
    const versions = ["2.6.10", "2.6.11", "2.7.0"];

    // 设置 mock 返回值
    mockFetchVersionList.mockResolvedValue(versions);

    await manager.addDependency(dependency, versionRange);

    // 检查 fetchVersionList 是否用正确的参数调用
    expect(mockFetchVersionList).toHaveBeenCalledWith(dependency);
    expect(mockFetchVersionList).toHaveBeenCalledTimes(1);
  });

  // 可以添加更多测试用例来验证 addDependency、removeDependency 等行为
});
