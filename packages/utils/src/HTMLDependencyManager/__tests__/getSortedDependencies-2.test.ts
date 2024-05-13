import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";
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
        react: ["16.8.0", "16.13.1", "17.0.0"],
        "react-dom": ["16.8.0", "16.13.1", "17.0.0"],
        redux: ["4.0.4", "4.0.5", "4.1.0"],
        lodash: ["4.17.15", "4.17.19"],
        moment: ["2.24.0", "2.25.0"],
        "react-router": ["5.1.2", "5.2.0"],
      };
      return Promise.resolve(versions[dependencyName] || []);
    });

    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    manager = new HTMLDependencyManager({
      fetchVersionList: mockFetchVersionList,
      document: jsdom.window.document,
    });
  });

  test("handles multiple layers of dependencies", async () => {
    await manager.addDependency("react", "^16.8.0", {
      "react-dom": "^16.8.0",
      "react-router": "^5.1.2",
    });
    await manager.addDependency("react-router", "^5.1.2", {
      lodash: "^4.17.15",
    });
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
          "isGlobal": false,
          "name": "lodash",
          "subDependencies": {},
          "version": {
            "exact": "4.17.19",
            "range": "^4.17.15",
          },
        },
        {
          "isGlobal": true,
          "name": "react-router",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": {
                "exact": "4.17.19",
                "range": "^4.17.15",
              },
            },
          },
          "version": {
            "exact": "5.2.0",
            "range": "^5.1.2",
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
            "react-router": {
              "isGlobal": true,
              "name": "react-router",
              "subDependencies": {
                "lodash": {
                  "isGlobal": false,
                  "name": "lodash",
                  "subDependencies": {},
                  "version": {
                    "exact": "4.17.19",
                    "range": "^4.17.15",
                  },
                },
              },
              "version": {
                "exact": "5.2.0",
                "range": "^5.1.2",
              },
            },
          },
          "version": {
            "exact": "16.13.1",
            "range": "^16.8.0",
          },
        },
      ]
    `);
  });

  test("handles multiple versions of the same dependency", async () => {
    await manager.addDependency("lodash", "^4.17.15");
    await manager.addDependency("lodash", "^4.17.19");
    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": true,
          "name": "lodash",
          "subDependencies": {},
          "version": {
            "exact": "4.17.19",
            "range": "^4.17.15",
          },
        },
      ]
    `);
  });

  test("handles cross dependencies", async () => {
    await manager.addDependency("redux", "^4.0.5", {
      react: "^17.0.0",
      lodash: "^4.17.19",
    });
    await manager.addDependency("react", "^16.8.0", { redux: "^4.0.5" });
    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`
      [
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
          "isGlobal": false,
          "name": "lodash",
          "subDependencies": {},
          "version": {
            "exact": "4.17.19",
            "range": "^4.17.19",
          },
        },
        {
          "isGlobal": false,
          "name": "redux",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": {
                "exact": "4.17.19",
                "range": "^4.17.19",
              },
            },
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
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "redux": {
              "isGlobal": false,
              "name": "redux",
              "subDependencies": {
                "lodash": {
                  "isGlobal": false,
                  "name": "lodash",
                  "subDependencies": {},
                  "version": {
                    "exact": "4.17.19",
                    "range": "^4.17.19",
                  },
                },
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
          },
          "version": {
            "exact": "16.13.1",
            "range": "^16.8.0",
          },
        },
      ]
    `);
  });

  test("handles repeated additions of the same dependency", async () => {
    await manager.addDependency("moment", "^2.24.0");
    await manager.addDependency("moment", "^2.24.0"); // Intentional repeat
    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": true,
          "name": "moment",
          "subDependencies": {},
          "version": {
            "exact": "2.25.0",
            "range": "^2.24.0",
          },
        },
      ]
    `);
  });

  test("handles cases with no dependencies", async () => {
    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`[]`);
  });
});
