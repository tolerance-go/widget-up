import { HTMLDependencyManager } from "@/src/HTMLDependencyManager";
import { JSDOM } from "jsdom";

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
        axios: ["0.19.0", "0.21.1"],
        "redux-thunk": ["2.3.0", "2.4.0"],
      };
      return Promise.resolve(versions[dependencyName] || []);
    });

    const jsdom = new JSDOM(`<!DOCTYPE html>`);
    manager = new HTMLDependencyManager(mockFetchVersionList, jsdom.window.document);
  });

  test("handles three levels of dependencies", async () => {
    // Adding a dependency chain of three levels deep
    await manager.addDependency("redux", "^4.0.5", {
      react: "^17.0.0", // Second level
      "redux-thunk": "^2.3.0", // Second level
    });
    await manager.addDependency("react", "^17.0.0", {
      "react-dom": "^16.8.0", // Third level
    });
    await manager.addDependency("redux-thunk", "^2.3.0", {
      axios: "^0.21.1", // Third level
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
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "react-dom": {
              "isGlobal": false,
              "name": "react-dom",
              "subDependencies": {},
              "version": "16.13.1",
            },
          },
          "version": "17.0.0",
        },
        {
          "isGlobal": false,
          "name": "axios",
          "subDependencies": {},
          "version": "0.21.1",
        },
        {
          "isGlobal": true,
          "name": "redux-thunk",
          "subDependencies": {
            "axios": {
              "isGlobal": false,
              "name": "axios",
              "subDependencies": {},
              "version": "0.21.1",
            },
          },
          "version": "2.4.0",
        },
        {
          "isGlobal": true,
          "name": "redux",
          "subDependencies": {
            "react": {
              "isGlobal": true,
              "name": "react",
              "subDependencies": {
                "react-dom": {
                  "isGlobal": false,
                  "name": "react-dom",
                  "subDependencies": {},
                  "version": "16.13.1",
                },
              },
              "version": "17.0.0",
            },
            "redux-thunk": {
              "isGlobal": true,
              "name": "redux-thunk",
              "subDependencies": {
                "axios": {
                  "isGlobal": false,
                  "name": "axios",
                  "subDependencies": {},
                  "version": "0.21.1",
                },
              },
              "version": "2.4.0",
            },
          },
          "version": "4.1.0",
        },
      ]
    `);
  });

  test("handles mixed dependencies with shared subdependencies", async () => {
    // React and Redux both depend on lodash, but at different levels
    await manager.addDependency("react", "^16.8.0", {
      lodash: "^4.17.15",
    });
    await manager.addDependency("redux", "^4.0.5", {
      "redux-thunk": "^2.3.0",
    });
    await manager.addDependency("redux-thunk", "^2.3.0", {
      lodash: "^4.17.19", // Higher version required at a deeper level
    });

    expect(manager.getSortedDependencies()).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": false,
          "name": "lodash",
          "subDependencies": {},
          "version": "4.17.19",
        },
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": "4.17.19",
            },
          },
          "version": "16.13.1",
        },
        {
          "isGlobal": true,
          "name": "redux-thunk",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": "4.17.19",
            },
          },
          "version": "2.4.0",
        },
        {
          "isGlobal": true,
          "name": "redux",
          "subDependencies": {
            "redux-thunk": {
              "isGlobal": true,
              "name": "redux-thunk",
              "subDependencies": {
                "lodash": {
                  "isGlobal": false,
                  "name": "lodash",
                  "subDependencies": {},
                  "version": "4.17.19",
                },
              },
              "version": "2.4.0",
            },
          },
          "version": "4.1.0",
        },
      ]
    `);
  });
});
