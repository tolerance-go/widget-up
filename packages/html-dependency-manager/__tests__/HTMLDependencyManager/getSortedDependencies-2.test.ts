import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";

describe("HTMLDependencyManager getSortedDependencies", () => {
  let manager: HTMLDependencyManager;
  const mockFetchVersionList = jest.fn();

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

    manager = new HTMLDependencyManager(mockFetchVersionList);
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
          "version": "16.13.1",
        },
        {
          "isGlobal": false,
          "name": "lodash",
          "subDependencies": {},
          "version": "4.17.19",
        },
        {
          "isGlobal": true,
          "name": "react-router",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": "4.17.19",
            },
          },
          "version": "5.2.0",
        },
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "react-dom": {
              "isGlobal": false,
              "name": "react-dom",
              "subDependencies": {},
              "version": "16.13.1",
            },
            "react-router": {
              "isGlobal": true,
              "name": "react-router",
              "subDependencies": {
                "lodash": {
                  "isGlobal": false,
                  "name": "lodash",
                  "subDependencies": {},
                  "version": "4.17.19",
                },
              },
              "version": "5.2.0",
            },
          },
          "version": "16.13.1",
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
          "version": "4.17.19",
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
          "version": "17.0.0",
        },
        {
          "isGlobal": false,
          "name": "lodash",
          "subDependencies": {},
          "version": "4.17.19",
        },
        {
          "isGlobal": false,
          "name": "redux",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": "4.17.19",
            },
            "react": {
              "isGlobal": false,
              "name": "react",
              "subDependencies": {},
              "version": "17.0.0",
            },
          },
          "version": "4.1.0",
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
                  "version": "4.17.19",
                },
                "react": {
                  "isGlobal": false,
                  "name": "react",
                  "subDependencies": {},
                  "version": "17.0.0",
                },
              },
              "version": "4.1.0",
            },
          },
          "version": "16.13.1",
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
          "version": "2.25.0",
        },
      ]
    `);
  });

  test("handles cases with no dependencies", async () => {
    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`[]`);
  });
});
