import { DependencyManager } from "@/src/htmlDependencyManager/dependencyManager";

describe("DependencyManager for multi-level dependencies", () => {
  let dm: DependencyManager;
  const versionList = {
    react: ["16.8.0", "17.0.1"],
    "react-dom": ["16.8.0", "17.0.1"],
    redux: ["4.0.5", "4.0.0"],
    "react-redux": ["7.2.0", "7.1.3"],
  };

  beforeEach(() => {
    dm = new DependencyManager(versionList);
  });

  test("should handle multiple levels of subdependencies", () => {
    dm.addDependency("react", "16.8.0", {
      "react-dom": "^16.0.0",
      redux: "^4.0.0",
    });
    dm.addDependency("redux", "4.0.5", {
      "react-redux": "^7.1.0",
    });

    const dependencies = dm.getDependencies();

    expect(dependencies).toMatchInlineSnapshot(`
      {
        "react": [
          {
            "isGlobal": true,
            "name": "react",
            "subDependencies": {
              "react-dom": {
                "isGlobal": false,
                "name": "react-dom",
                "subDependencies": {},
                "version": {
                  "exact": "16.8.0",
                  "range": "^16.0.0",
                },
              },
              "redux": {
                "isGlobal": true,
                "name": "redux",
                "subDependencies": {
                  "react-redux": {
                    "isGlobal": false,
                    "name": "react-redux",
                    "subDependencies": {},
                    "version": {
                      "exact": "7.2.0",
                      "range": "^7.1.0",
                    },
                  },
                },
                "version": {
                  "exact": "4.0.5",
                  "range": "^4.0.0",
                },
              },
            },
            "version": {
              "exact": "16.8.0",
              "range": "16.8.0",
            },
          },
        ],
        "react-dom": [
          {
            "isGlobal": false,
            "name": "react-dom",
            "subDependencies": {},
            "version": {
              "exact": "16.8.0",
              "range": "^16.0.0",
            },
          },
        ],
        "react-redux": [
          {
            "isGlobal": false,
            "name": "react-redux",
            "subDependencies": {},
            "version": {
              "exact": "7.2.0",
              "range": "^7.1.0",
            },
          },
        ],
        "redux": [
          {
            "isGlobal": true,
            "name": "redux",
            "subDependencies": {
              "react-redux": {
                "isGlobal": false,
                "name": "react-redux",
                "subDependencies": {},
                "version": {
                  "exact": "7.2.0",
                  "range": "^7.1.0",
                },
              },
            },
            "version": {
              "exact": "4.0.5",
              "range": "^4.0.0",
            },
          },
        ],
      }
    `);
  });

  test("should handle deep nested dependencies", () => {
    dm.addDependency("redux", "4.0.5", {
      "react-redux": "^7.1.0",
    });
    dm.addDependency("react-redux", "7.2.0", {
      react: "16.8.0",
      "react-dom": "^16.0.0",
    });

    const dependencies = dm.getDependencies();

    expect(dependencies).toMatchInlineSnapshot(`
      {
        "react": [
          {
            "isGlobal": false,
            "name": "react",
            "subDependencies": {},
            "version": {
              "exact": "16.8.0",
              "range": "16.8.0",
            },
          },
        ],
        "react-dom": [
          {
            "isGlobal": false,
            "name": "react-dom",
            "subDependencies": {},
            "version": {
              "exact": "16.8.0",
              "range": "^16.0.0",
            },
          },
        ],
        "react-redux": [
          {
            "isGlobal": true,
            "name": "react-redux",
            "subDependencies": {
              "react": {
                "isGlobal": false,
                "name": "react",
                "subDependencies": {},
                "version": {
                  "exact": "16.8.0",
                  "range": "16.8.0",
                },
              },
              "react-dom": {
                "isGlobal": false,
                "name": "react-dom",
                "subDependencies": {},
                "version": {
                  "exact": "16.8.0",
                  "range": "^16.0.0",
                },
              },
            },
            "version": {
              "exact": "7.2.0",
              "range": "^7.1.0",
            },
          },
        ],
        "redux": [
          {
            "isGlobal": true,
            "name": "redux",
            "subDependencies": {
              "react-redux": {
                "isGlobal": true,
                "name": "react-redux",
                "subDependencies": {
                  "react": {
                    "isGlobal": false,
                    "name": "react",
                    "subDependencies": {},
                    "version": {
                      "exact": "16.8.0",
                      "range": "16.8.0",
                    },
                  },
                  "react-dom": {
                    "isGlobal": false,
                    "name": "react-dom",
                    "subDependencies": {},
                    "version": {
                      "exact": "16.8.0",
                      "range": "^16.0.0",
                    },
                  },
                },
                "version": {
                  "exact": "7.2.0",
                  "range": "^7.1.0",
                },
              },
            },
            "version": {
              "exact": "4.0.5",
              "range": "4.0.5",
            },
          },
        ],
      }
    `);
  });

  test("should handle multiple levels of subdependencies remove", () => {
    dm.addDependency("react", "16.8.0", {
      "react-dom": "^16.0.0",
      redux: "^4.0.0",
    });
    dm.addDependency("redux", "4.0.5", {
      "react-redux": "^7.1.0",
    });

    dm.removeDependency("react", "16.8.0");

    const dependencies = dm.getDependencies();

    expect(dependencies).toMatchInlineSnapshot(`
      {
        "react-redux": [
          {
            "isGlobal": false,
            "name": "react-redux",
            "subDependencies": {},
            "version": {
              "exact": "7.2.0",
              "range": "^7.1.0",
            },
          },
        ],
        "redux": [
          {
            "isGlobal": true,
            "name": "redux",
            "subDependencies": {
              "react-redux": {
                "isGlobal": false,
                "name": "react-redux",
                "subDependencies": {},
                "version": {
                  "exact": "7.2.0",
                  "range": "^7.1.0",
                },
              },
            },
            "version": {
              "exact": "4.0.5",
              "range": "^4.0.0",
            },
          },
        ],
      }
    `);
  });

  test("getSortedDependencies should sort dependencies correctly", () => {
    const versionList = {
      react: ["16.8.0", "17.0.1"],
      "react-dom": ["16.8.0", "17.0.1"],
      redux: ["4.0.5", "4.0.0"],
      "react-redux": ["7.2.0", "7.1.3"],
    };
    const manager = new DependencyManager(versionList);

    manager.addDependency("react", "^16.8.0", { "react-dom": "^16.8.0" });
    manager.addDependency("redux", "^4.0.5", { react: "^17.0.0" });
    expect(manager.getDependencies()).toMatchInlineSnapshot(`
      {
        "react": [
          {
            "isGlobal": true,
            "name": "react",
            "subDependencies": {
              "react-dom": {
                "isGlobal": false,
                "name": "react-dom",
                "subDependencies": {},
                "version": {
                  "exact": "16.8.0",
                  "range": "^16.8.0",
                },
              },
            },
            "version": {
              "exact": "16.8.0",
              "range": "^16.8.0",
            },
          },
          {
            "isGlobal": false,
            "name": "react",
            "subDependencies": {},
            "version": {
              "exact": "17.0.1",
              "range": "^17.0.0",
            },
          },
        ],
        "react-dom": [
          {
            "isGlobal": false,
            "name": "react-dom",
            "subDependencies": {},
            "version": {
              "exact": "16.8.0",
              "range": "^16.8.0",
            },
          },
        ],
        "redux": [
          {
            "isGlobal": true,
            "name": "redux",
            "subDependencies": {
              "react": {
                "isGlobal": false,
                "name": "react",
                "subDependencies": {},
                "version": {
                  "exact": "17.0.1",
                  "range": "^17.0.0",
                },
              },
            },
            "version": {
              "exact": "4.0.5",
              "range": "^4.0.5",
            },
          },
        ],
      }
    `);
  });
});
