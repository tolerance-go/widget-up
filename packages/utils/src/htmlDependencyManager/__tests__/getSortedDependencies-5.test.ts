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
        lodash: ["4.17.15", "4.17.19", "4.17.21"],
        react: ["16.8.0", "16.12.0", "17.0.0"],
        moment: ["2.24.0", "2.29.1"],
        webpack: ["4.44.0", "4.44.1", "5.0.0"],
        "babel-core": ["6.26.0", "7.0.0"],
        "react-dom": ["16.8.0", "16.12.0", "17.0.0"],
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
    await manager.addDependency("webpack", "^4.44.0", {
      "babel-core": "^7.0.0", // Level 1 dependency
      lodash: "4.17.21", // Level 1 dependency
      react: "^17.0.0", // Level 1 dependency with further sub-dependencies
    });

    await manager.addDependency("react", "^17.0.0", {
      "react-dom": "^17.0.0", // Level 2 dependency of react
    });

    await manager.addDependency("react-dom", "^17.0.0", {
      lodash: "4.17.21", // Level 2 dependency of react
    });

    expect(manager.getDependencies()).toMatchInlineSnapshot(`
      {
        "babel-core": [
          {
            "isGlobal": false,
            "name": "babel-core",
            "subDependencies": {},
            "version": {
              "exact": "7.0.0",
              "range": "^7.0.0",
            },
          },
        ],
        "lodash": [
          {
            "isGlobal": false,
            "name": "lodash",
            "subDependencies": {},
            "version": {
              "exact": "4.17.21",
              "range": "4.17.21",
            },
          },
        ],
        "react": [
          {
            "isGlobal": true,
            "name": "react",
            "subDependencies": {
              "react-dom": {
                "isGlobal": true,
                "name": "react-dom",
                "subDependencies": {
                  "lodash": {
                    "isGlobal": false,
                    "name": "lodash",
                    "subDependencies": {},
                    "version": {
                      "exact": "4.17.21",
                      "range": "4.17.21",
                    },
                  },
                },
                "version": {
                  "exact": "17.0.0",
                  "range": "^17.0.0",
                },
              },
            },
            "version": {
              "exact": "17.0.0",
              "range": "^17.0.0",
            },
          },
        ],
        "react-dom": [
          {
            "isGlobal": true,
            "name": "react-dom",
            "subDependencies": {
              "lodash": {
                "isGlobal": false,
                "name": "lodash",
                "subDependencies": {},
                "version": {
                  "exact": "4.17.21",
                  "range": "4.17.21",
                },
              },
            },
            "version": {
              "exact": "17.0.0",
              "range": "^17.0.0",
            },
          },
        ],
        "webpack": [
          {
            "isGlobal": true,
            "name": "webpack",
            "subDependencies": {
              "babel-core": {
                "isGlobal": false,
                "name": "babel-core",
                "subDependencies": {},
                "version": {
                  "exact": "7.0.0",
                  "range": "^7.0.0",
                },
              },
              "lodash": {
                "isGlobal": false,
                "name": "lodash",
                "subDependencies": {},
                "version": {
                  "exact": "4.17.21",
                  "range": "4.17.21",
                },
              },
              "react": {
                "isGlobal": true,
                "name": "react",
                "subDependencies": {
                  "react-dom": {
                    "isGlobal": true,
                    "name": "react-dom",
                    "subDependencies": {
                      "lodash": {
                        "isGlobal": false,
                        "name": "lodash",
                        "subDependencies": {},
                        "version": {
                          "exact": "4.17.21",
                          "range": "4.17.21",
                        },
                      },
                    },
                    "version": {
                      "exact": "17.0.0",
                      "range": "^17.0.0",
                    },
                  },
                },
                "version": {
                  "exact": "17.0.0",
                  "range": "^17.0.0",
                },
              },
            },
            "version": {
              "exact": "4.44.1",
              "range": "^4.44.0",
            },
          },
        ],
      }
    `);

    const sortedDependencies = manager.getSortedDependencies();

    expect(sortedDependencies).toMatchInlineSnapshot(`
      [
        {
          "isGlobal": false,
          "name": "babel-core",
          "subDependencies": {},
          "version": {
            "exact": "7.0.0",
            "range": "^7.0.0",
          },
        },
        {
          "isGlobal": false,
          "name": "lodash",
          "subDependencies": {},
          "version": {
            "exact": "4.17.21",
            "range": "4.17.21",
          },
        },
        {
          "isGlobal": true,
          "name": "react-dom",
          "subDependencies": {
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": {
                "exact": "4.17.21",
                "range": "4.17.21",
              },
            },
          },
          "version": {
            "exact": "17.0.0",
            "range": "^17.0.0",
          },
        },
        {
          "isGlobal": true,
          "name": "react",
          "subDependencies": {
            "react-dom": {
              "isGlobal": true,
              "name": "react-dom",
              "subDependencies": {
                "lodash": {
                  "isGlobal": false,
                  "name": "lodash",
                  "subDependencies": {},
                  "version": {
                    "exact": "4.17.21",
                    "range": "4.17.21",
                  },
                },
              },
              "version": {
                "exact": "17.0.0",
                "range": "^17.0.0",
              },
            },
          },
          "version": {
            "exact": "17.0.0",
            "range": "^17.0.0",
          },
        },
        {
          "isGlobal": true,
          "name": "webpack",
          "subDependencies": {
            "babel-core": {
              "isGlobal": false,
              "name": "babel-core",
              "subDependencies": {},
              "version": {
                "exact": "7.0.0",
                "range": "^7.0.0",
              },
            },
            "lodash": {
              "isGlobal": false,
              "name": "lodash",
              "subDependencies": {},
              "version": {
                "exact": "4.17.21",
                "range": "4.17.21",
              },
            },
            "react": {
              "isGlobal": true,
              "name": "react",
              "subDependencies": {
                "react-dom": {
                  "isGlobal": true,
                  "name": "react-dom",
                  "subDependencies": {
                    "lodash": {
                      "isGlobal": false,
                      "name": "lodash",
                      "subDependencies": {},
                      "version": {
                        "exact": "4.17.21",
                        "range": "4.17.21",
                      },
                    },
                  },
                  "version": {
                    "exact": "17.0.0",
                    "range": "^17.0.0",
                  },
                },
              },
              "version": {
                "exact": "17.0.0",
                "range": "^17.0.0",
              },
            },
          },
          "version": {
            "exact": "4.44.1",
            "range": "^4.44.0",
          },
        },
      ]
    `);
  });
});
