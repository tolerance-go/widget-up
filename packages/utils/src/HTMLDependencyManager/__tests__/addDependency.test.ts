import { HTMLDependencyManager } from "../HtmlDependencyManager";
import { JSDOM } from "jsdom";

describe("HTMLDependencyManager addDependency", () => {
  let manager: HTMLDependencyManager;
  const mockFetchVersionList = jest.fn();

  beforeEach(() => {
    mockFetchVersionList.mockReset();
    mockFetchVersionList.mockImplementation((dependencyName: string) => {
      const versions: Record<string, string[]> = {
        react: ["16.8.0", "16.13.1", "17.0.0"],
        "react-dom": ["16.8.0", "16.13.1", "17.0.0"],
        redux: ["4.0.4", "4.0.5", "4.1.0"],
      };
      return Promise.resolve(versions[dependencyName] || []);
    });

    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    manager = new HTMLDependencyManager({
      fetchVersionList: mockFetchVersionList,
      document: jsdom.window.document,
      scriptSrcBuilder: (dep) => `${dep.name}@${dep.version}.js`,
    });
  });

  test("does not fetch version list for exact version numbers", async () => {
    await manager.addDependency("react", "16.8.0"); // Exact version
    expect(mockFetchVersionList).not.toHaveBeenCalled();
  });

  test("fetches version list for version ranges", async () => {
    await manager.addDependency("react", "^16.8.0");
    expect(mockFetchVersionList).toHaveBeenCalled();
  });

  test("handles dependencies with subdependencies for exact versions", async () => {
    await manager.addDependency("redux", "4.0.4", { react: "16.8.0" });
    expect(mockFetchVersionList).toHaveBeenCalledTimes(0); // Only for redux, not for react
  });

  test("checks that exact version does not update the version cache", async () => {
    await manager.addDependency("react", "16.8.0");
    expect(manager["versionCache"]["react"]).toBeUndefined();
  });

  test("updates version cache when a version range is used", async () => {
    await manager.addDependency("redux", "^4.0.4");
    expect(manager["versionCache"]["redux"]).toEqual([
      "4.0.4",
      "4.0.5",
      "4.1.0",
    ]);
  });
});
