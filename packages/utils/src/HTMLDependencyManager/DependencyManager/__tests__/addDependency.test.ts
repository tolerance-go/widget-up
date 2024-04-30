import { DependencyManager } from "..";

describe("DependencyManager addDependency", () => {
  let dependencyManager: DependencyManager;

  beforeEach(() => {
    // Initialize with some version data to use in tests
    dependencyManager = new DependencyManager({
      lodash: ["4.17.15", "4.17.19", "4.17.21"],
      react: ["16.8.0", "16.12.0", "17.0.0"],
      moment: ["2.24.0", "2.29.1"],
      webpack: ["4.44.0", "4.44.1", "5.0.0"],
      "babel-core": ["6.26.0", "7.0.0"],
      "react-dom": ["16.8.0", "16.12.0", "17.0.0"],
    });
  });

  it("should add a single dependency without sub-dependencies", () => {
    dependencyManager.addDependency("lodash", "4.17.19");
    expect(dependencyManager.getDependencies()).toMatchInlineSnapshot(`
      {
        "lodash": [
          {
            "isGlobal": true,
            "name": "lodash",
            "subDependencies": {},
            "version": "4.17.19",
            "versionRange": "4.17.19",
          },
        ],
      }
    `);
  });

  it("should handle adding a dependency with sub-dependencies", () => {
    dependencyManager.addDependency("react", "^16.8.0", {
      lodash: "4.17.15",
    });
    expect(dependencyManager.getDependencies()).toMatchInlineSnapshot(`
      {
        "lodash": [
          {
            "isGlobal": false,
            "name": "lodash",
            "subDependencies": {},
            "version": "4.17.15",
            "versionRange": "4.17.15",
          },
        ],
        "react": [
          {
            "isGlobal": true,
            "name": "react",
            "subDependencies": {
              "lodash": {
                "isGlobal": false,
                "name": "lodash",
                "subDependencies": {},
                "version": "4.17.15",
                "versionRange": "4.17.15",
              },
            },
            "version": "16.12.0",
            "versionRange": "^16.8.0",
          },
        ],
      }
    `);
  });

  it("should not add a dependency if version range does not match any available versions", () => {
    dependencyManager.addDependency("moment", "^3.0.0");
    expect(dependencyManager.getDependencies()).toMatchInlineSnapshot(`{}`);
  });

  it("should handle deeply nested dependencies", () => {
    dependencyManager.addDependency("webpack", "^4.44.0", {
      "babel-core": "^7.0.0", // Level 1 dependency
      lodash: "4.17.21", // Level 1 dependency
      react: "^17.0.0", // Level 1 dependency with further sub-dependencies
    });

    dependencyManager.addDependency("react", "^17.0.0", {
      "react-dom": "^17.0.0", // Level 2 dependency of react
    });

    dependencyManager.addDependency("react-dom", "^17.0.0", {
      lodash: "4.17.21", // Level 2 dependency of react
    });
    expect(dependencyManager.getDependencies()).toMatchInlineSnapshot(`
      {
        "babel-core": [
          {
            "isGlobal": false,
            "name": "babel-core",
            "subDependencies": {},
            "version": "7.0.0",
            "versionRange": "^7.0.0",
          },
        ],
        "lodash": [
          {
            "isGlobal": false,
            "name": "lodash",
            "subDependencies": {},
            "version": "4.17.21",
            "versionRange": "4.17.21",
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
                    "version": "4.17.21",
                    "versionRange": "4.17.21",
                  },
                },
                "version": "17.0.0",
                "versionRange": "^17.0.0",
              },
            },
            "version": "17.0.0",
            "versionRange": "^17.0.0",
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
                "version": "4.17.21",
                "versionRange": "4.17.21",
              },
            },
            "version": "17.0.0",
            "versionRange": "^17.0.0",
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
                "version": "7.0.0",
                "versionRange": "^7.0.0",
              },
              "lodash": {
                "isGlobal": false,
                "name": "lodash",
                "subDependencies": {},
                "version": "4.17.21",
                "versionRange": "4.17.21",
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
                        "version": "4.17.21",
                        "versionRange": "4.17.21",
                      },
                    },
                    "version": "17.0.0",
                    "versionRange": "^17.0.0",
                  },
                },
                "version": "17.0.0",
                "versionRange": "^17.0.0",
              },
            },
            "version": "4.44.1",
            "versionRange": "^4.44.0",
          },
        ],
      }
    `);
  });
});
