import { HTMLDependencyManager } from "@/src/htmlDependencyManager";
import { JSDOM } from "jsdom";
import { jest } from "@jest/globals";

describe("HTMLDependencyManager getSortedDependencies", () => {
  let manager: HTMLDependencyManager;
  const mockFetchVersionList =
    jest.fn<(dependencyName: string) => Promise<string[]>>();

  beforeEach(async () => {
    mockFetchVersionList.mockReset();
    mockFetchVersionList.mockImplementation((dependencyName: string) => {
      const versions: Record<string, string[]> = {
        react: ["16.8.0", "16.13.1", "17.0.0", "17.0.2"],
        "react-dom": ["16.8.0", "16.13.1", "17.0.0", "17.0.2"],
        redux: ["4.0.4", "4.0.5", "4.1.0"],
        lodash: ["3.0.0", "4.17.15", "4.17.20"],
      };
      return Promise.resolve(versions[dependencyName] || []);
    });

    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    manager = new HTMLDependencyManager({
      fetchVersionList: mockFetchVersionList,
      document: jsdom.window.document,
    });
  });

  test("handles multiple versions of the same dependency independently", async () => {
    // React 16 used in one part of the project
    await manager.addDependency("react", "^16.8.0", {
      "react-dom": "^16.8.0",
    });
    // React 17 used in another part of the project
    await manager.addDependency("react", "^17.0.0", {
      "react-dom": "^17.0.0",
    });

    const sortedDependencies = manager.getSortedDependencies();
    expect(sortedDependencies).toMatchInlineSnapshot(`
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
          "name": "react-dom",
          "subDependencies": {},
          "version": {
            "exact": "17.0.2",
            "range": "^17.0.0",
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
                "exact": "17.0.2",
                "range": "^17.0.0",
              },
            },
          },
          "version": {
            "exact": "17.0.2",
            "range": "^17.0.0",
          },
        },
      ]
    `);
  });

  test("handles dependencies where different versions have different subdependencies", async () => {
    // Adding dependencies with different subdependencies across versions
    await manager.addDependency("lodash", "^4.17.15");
    await manager.addDependency("redux", "^4.0.5", {
      lodash: "^3.0.0", // Higher version required by redux
    });

    const sortedDependencies = manager.getSortedDependencies();
    expect(sortedDependencies).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": true,
          "name": "lodash",
          "subDependencies": {},
          "version": {
            "exact": "4.17.20",
            "range": "^4.17.15",
          },
        },
        {
          "isGlobal": false,
          "name": "lodash",
          "subDependencies": {},
          "version": {
            "exact": "3.0.0",
            "range": "^3.0.0",
          },
        },
        {
          "isGlobal": true,
          "name": "redux",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": {
                "exact": "3.0.0",
                "range": "^3.0.0",
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

  test("consistency check for dependencies across different versions", async () => {
    // Adding multiple versions where earlier versions might be indirectly upgraded
    await manager.addDependency("react", "^16.8.0");
    await manager.addDependency("redux", "^4.0.5", {
      react: "^17.0.0", // This might indirectly affect previously added react dependency
    });

    const sortedDependencies = manager.getSortedDependencies();
    expect(sortedDependencies).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {},
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
            "exact": "17.0.2",
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
                "exact": "17.0.2",
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
