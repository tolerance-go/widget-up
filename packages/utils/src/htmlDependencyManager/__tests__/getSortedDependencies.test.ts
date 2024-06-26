// HTMLDependencyManager.test.ts
import { JSDOM } from "jsdom";
import { jest } from "@jest/globals";
import { HTMLDependencyManager } from "@/src/htmlDependencyManager";

describe("HTMLDependencyManager getSortedDependencies", () => {
  let manager: HTMLDependencyManager;
  const mockFetchVersionList =
    jest.fn<(dependencyName: string) => Promise<string[]>>();
  let scriptContainer: HTMLElement;
  let linkContainer: HTMLElement;

  beforeEach(async () => {
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
    });
    scriptContainer = manager.tagManager.getScriptContainer();
    linkContainer = manager.tagManager.getLinkContainer();
  });

  test("getSortedDependencies should sort dependencies correctly", async () => {
    await manager.addDependency("react", "^16.8.0", { "react-dom": "^16.8.0" });
    await manager.addDependency("redux", "^4.0.5", { react: "^17.0.0" });
    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": false,
          "name": "react-dom",
          "subDependencies": {},
          "version": {
            "exact": "16.13.1",
            "range": "^16.8.0",
          },
        },
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "react-dom": {
              "isGlobal": false,
              "name": "react-dom",
              "subDependencies": {},
              "version": {
                "exact": "16.13.1",
                "range": "^16.8.0",
              },
            },
          },
          "version": {
            "exact": "16.13.1",
            "range": "^16.8.0",
          },
        },
        {
          "isGlobal": false,
          "name": "react",
          "subDependencies": {},
          "version": {
            "exact": "17.0.0",
            "range": "^17.0.0",
          },
        },
        {
          "isGlobal": true,
          "name": "redux",
          "subDependencies": {
            "react": {
              "isGlobal": false,
              "name": "react",
              "subDependencies": {},
              "version": {
                "exact": "17.0.0",
                "range": "^17.0.0",
              },
            },
          },
          "version": {
            "exact": "4.1.0",
            "range": "^4.0.5",
          },
        },
      ]
    `);
  });
});
