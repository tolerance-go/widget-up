import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";
import { JSDOM } from "jsdom";

describe("HTMLDependencyManager fetchVersionList", () => {
  let htmlDependencyManager: HTMLDependencyManager;
  const mockFetchVersionList = jest.fn();

  beforeEach(() => {
    // 每个测试前重置 mock 和实例
    mockFetchVersionList.mockReset();
    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    htmlDependencyManager = new HTMLDependencyManager(mockFetchVersionList, jsdom.window.document);
  });

  test("fetchVersionList is called with the correct argument", async () => {
    const dependency = "vue";
    const versionRange = "^2.6.0";
    const versions = ["2.6.10", "2.6.11", "2.7.0"];

    // 设置 mock 返回值
    mockFetchVersionList.mockResolvedValue(versions);

    await htmlDependencyManager.addDependency(dependency, versionRange);

    // 检查 fetchVersionList 是否用正确的参数调用
    expect(mockFetchVersionList).toHaveBeenCalledWith(dependency);
    expect(mockFetchVersionList).toHaveBeenCalledTimes(1);
  });

  // 可以添加更多测试用例来验证 addDependency、removeDependency 等行为
});
