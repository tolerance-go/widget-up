import { convertDependenciesTreeToList } from ".";
import { PeerDependenciesTree } from "@/types";

describe("convertDependenciesTreeToList", () => {
  it("应将包含一个叶子节点的简单树转换为列表", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        peerDependencies: {},
        packageConfig: {
          name: "packageA",
          version: "1.0.0",
        },
        hostModulePath: "",
        moduleEntries: {
          modulePath: "",
          moduleEntryAbsPath: "",
          moduleEntryRelPath: "",
        },
      },
    };

    expect(convertDependenciesTreeToList(tree)).toMatchInlineSnapshot(`
      [
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageA",
          "packageConfig": {
            "name": "packageA",
            "version": "1.0.0",
          },
          "peerDependencies": {},
          "version": {
            "exact": "1.0.0",
            "range": "^1.0.0",
          },
        },
      ]
    `);
  });

  it("应将嵌套树转换为叶子节点列表", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        packageConfig: {
          name: "packageA",
          version: "1.0.0",
        },
        hostModulePath: "",
        moduleEntries: {
          modulePath: "",
          moduleEntryAbsPath: "",
          moduleEntryRelPath: "",
        },
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            packageConfig: {
              name: "packageB",
              version: "1.1.0",
            },
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                name: "packageC",
                peerDependencies: {},
                packageConfig: {
                  name: "packageC",
                  version: "1.2.0",
                },
                hostModulePath: "",
                moduleEntries: {
                  modulePath: "",
                  moduleEntryAbsPath: "",
                  moduleEntryRelPath: "",
                },
              },
            },
            hostModulePath: "",
            moduleEntries: {
              modulePath: "",
              moduleEntryAbsPath: "",
              moduleEntryRelPath: "",
            },
          },
        },
      },
    };

    expect(convertDependenciesTreeToList(tree)).toMatchInlineSnapshot(`
      [
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageA",
          "packageConfig": {
            "name": "packageA",
            "version": "1.0.0",
          },
          "peerDependencies": {
            "packageB": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageB",
              "packageConfig": {
                "name": "packageB",
                "version": "1.1.0",
              },
              "peerDependencies": {
                "packageC": {
                  "hostModulePath": "",
                  "moduleEntries": {
                    "moduleEntryAbsPath": "",
                    "moduleEntryRelPath": "",
                    "modulePath": "",
                  },
                  "name": "packageC",
                  "packageConfig": {
                    "name": "packageC",
                    "version": "1.2.0",
                  },
                  "peerDependencies": {},
                  "version": {
                    "exact": "1.2.0",
                    "range": "^1.2.0",
                  },
                },
              },
              "version": {
                "exact": "1.1.0",
                "range": "^1.1.0",
              },
            },
          },
          "version": {
            "exact": "1.0.0",
            "range": "^1.0.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageB",
          "packageConfig": {
            "name": "packageB",
            "version": "1.1.0",
          },
          "peerDependencies": {
            "packageC": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageC",
              "packageConfig": {
                "name": "packageC",
                "version": "1.2.0",
              },
              "peerDependencies": {},
              "version": {
                "exact": "1.2.0",
                "range": "^1.2.0",
              },
            },
          },
          "version": {
            "exact": "1.1.0",
            "range": "^1.1.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageC",
          "packageConfig": {
            "name": "packageC",
            "version": "1.2.0",
          },
          "peerDependencies": {},
          "version": {
            "exact": "1.2.0",
            "range": "^1.2.0",
          },
        },
      ]
    `);
  });

  it("应正确处理具有多个分支的树", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        name: "packageA",
        packageConfig: {
          name: "packageA",
          version: "1.0.0",
        },
        hostModulePath: "",
        moduleEntries: {
          modulePath: "",
          moduleEntryAbsPath: "",
          moduleEntryRelPath: "",
        },
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            name: "packageB",
            packageConfig: {
              name: "packageB",
              version: "1.1.0",
            },
            peerDependencies: {},
            hostModulePath: "",
            moduleEntries: {
              modulePath: "",
              moduleEntryAbsPath: "",
              moduleEntryRelPath: "",
            },
          },
          packageC: {
            version: {
              exact: "1.2.0",
              range: "^1.2.0",
            },
            name: "packageC",
            packageConfig: {
              name: "packageC",
              version: "1.2.0",
            },
            peerDependencies: {},
            hostModulePath: "",
            moduleEntries: {
              modulePath: "",
              moduleEntryAbsPath: "",
              moduleEntryRelPath: "",
            },
          },
        },
      },
    };

    expect(convertDependenciesTreeToList(tree)).toMatchInlineSnapshot(`
      [
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageA",
          "packageConfig": {
            "name": "packageA",
            "version": "1.0.0",
          },
          "peerDependencies": {
            "packageB": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageB",
              "packageConfig": {
                "name": "packageB",
                "version": "1.1.0",
              },
              "peerDependencies": {},
              "version": {
                "exact": "1.1.0",
                "range": "^1.1.0",
              },
            },
            "packageC": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageC",
              "packageConfig": {
                "name": "packageC",
                "version": "1.2.0",
              },
              "peerDependencies": {},
              "version": {
                "exact": "1.2.0",
                "range": "^1.2.0",
              },
            },
          },
          "version": {
            "exact": "1.0.0",
            "range": "^1.0.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageB",
          "packageConfig": {
            "name": "packageB",
            "version": "1.1.0",
          },
          "peerDependencies": {},
          "version": {
            "exact": "1.1.0",
            "range": "^1.1.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageC",
          "packageConfig": {
            "name": "packageC",
            "version": "1.2.0",
          },
          "peerDependencies": {},
          "version": {
            "exact": "1.2.0",
            "range": "^1.2.0",
          },
        },
      ]
    `);
  });

  it("应处理空树", () => {
    const tree: PeerDependenciesTree = {};

    expect(convertDependenciesTreeToList(tree)).toMatchInlineSnapshot(`[]`);
  });

  it("应处理具有多个嵌套依赖项的复杂树", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        hostModulePath: "",
        moduleEntries: {
          modulePath: "",
          moduleEntryAbsPath: "",
          moduleEntryRelPath: "",
        },
        name: "packageA",
        packageConfig: {
          name: "packageA",
          version: "1.0.0",
        },
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            hostModulePath: "",
            moduleEntries: {
              modulePath: "",
              moduleEntryAbsPath: "",
              moduleEntryRelPath: "",
            },
            name: "packageB",
            packageConfig: {
              name: "packageB",
              version: "1.1.0",
            },
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                name: "packageC",
                packageConfig: {
                  name: "packageC",
                  version: "1.2.0",
                },
                peerDependencies: {},
                hostModulePath: "",
                moduleEntries: {
                  modulePath: "",
                  moduleEntryAbsPath: "",
                  moduleEntryRelPath: "",
                },
              },
              packageD: {
                version: {
                  exact: "1.3.0",
                  range: "^1.3.0",
                },
                name: "packageD",
                packageConfig: {
                  name: "packageD",
                  version: "1.3.0",
                },
                peerDependencies: {
                  packageE: {
                    version: {
                      exact: "1.4.0",
                      range: "^1.4.0",
                    },
                    name: "packageE",
                    packageConfig: {
                      name: "packageE",
                      version: "1.4.0",
                    },
                    peerDependencies: {},
                    hostModulePath: "",
                    moduleEntries: {
                      modulePath: "",
                      moduleEntryAbsPath: "",
                      moduleEntryRelPath: "",
                    },
                  },
                },
                hostModulePath: "",
                moduleEntries: {
                  modulePath: "",
                  moduleEntryAbsPath: "",
                  moduleEntryRelPath: "",
                },
              },
            },
          },
        },
      },
    };

    expect(convertDependenciesTreeToList(tree)).toMatchInlineSnapshot(`
      [
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageA",
          "packageConfig": {
            "name": "packageA",
            "version": "1.0.0",
          },
          "peerDependencies": {
            "packageB": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageB",
              "packageConfig": {
                "name": "packageB",
                "version": "1.1.0",
              },
              "peerDependencies": {
                "packageC": {
                  "hostModulePath": "",
                  "moduleEntries": {
                    "moduleEntryAbsPath": "",
                    "moduleEntryRelPath": "",
                    "modulePath": "",
                  },
                  "name": "packageC",
                  "packageConfig": {
                    "name": "packageC",
                    "version": "1.2.0",
                  },
                  "peerDependencies": {},
                  "version": {
                    "exact": "1.2.0",
                    "range": "^1.2.0",
                  },
                },
                "packageD": {
                  "hostModulePath": "",
                  "moduleEntries": {
                    "moduleEntryAbsPath": "",
                    "moduleEntryRelPath": "",
                    "modulePath": "",
                  },
                  "name": "packageD",
                  "packageConfig": {
                    "name": "packageD",
                    "version": "1.3.0",
                  },
                  "peerDependencies": {
                    "packageE": {
                      "hostModulePath": "",
                      "moduleEntries": {
                        "moduleEntryAbsPath": "",
                        "moduleEntryRelPath": "",
                        "modulePath": "",
                      },
                      "name": "packageE",
                      "packageConfig": {
                        "name": "packageE",
                        "version": "1.4.0",
                      },
                      "peerDependencies": {},
                      "version": {
                        "exact": "1.4.0",
                        "range": "^1.4.0",
                      },
                    },
                  },
                  "version": {
                    "exact": "1.3.0",
                    "range": "^1.3.0",
                  },
                },
              },
              "version": {
                "exact": "1.1.0",
                "range": "^1.1.0",
              },
            },
          },
          "version": {
            "exact": "1.0.0",
            "range": "^1.0.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageB",
          "packageConfig": {
            "name": "packageB",
            "version": "1.1.0",
          },
          "peerDependencies": {
            "packageC": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageC",
              "packageConfig": {
                "name": "packageC",
                "version": "1.2.0",
              },
              "peerDependencies": {},
              "version": {
                "exact": "1.2.0",
                "range": "^1.2.0",
              },
            },
            "packageD": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageD",
              "packageConfig": {
                "name": "packageD",
                "version": "1.3.0",
              },
              "peerDependencies": {
                "packageE": {
                  "hostModulePath": "",
                  "moduleEntries": {
                    "moduleEntryAbsPath": "",
                    "moduleEntryRelPath": "",
                    "modulePath": "",
                  },
                  "name": "packageE",
                  "packageConfig": {
                    "name": "packageE",
                    "version": "1.4.0",
                  },
                  "peerDependencies": {},
                  "version": {
                    "exact": "1.4.0",
                    "range": "^1.4.0",
                  },
                },
              },
              "version": {
                "exact": "1.3.0",
                "range": "^1.3.0",
              },
            },
          },
          "version": {
            "exact": "1.1.0",
            "range": "^1.1.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageC",
          "packageConfig": {
            "name": "packageC",
            "version": "1.2.0",
          },
          "peerDependencies": {},
          "version": {
            "exact": "1.2.0",
            "range": "^1.2.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageD",
          "packageConfig": {
            "name": "packageD",
            "version": "1.3.0",
          },
          "peerDependencies": {
            "packageE": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageE",
              "packageConfig": {
                "name": "packageE",
                "version": "1.4.0",
              },
              "peerDependencies": {},
              "version": {
                "exact": "1.4.0",
                "range": "^1.4.0",
              },
            },
          },
          "version": {
            "exact": "1.3.0",
            "range": "^1.3.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageE",
          "packageConfig": {
            "name": "packageE",
            "version": "1.4.0",
          },
          "peerDependencies": {},
          "version": {
            "exact": "1.4.0",
            "range": "^1.4.0",
          },
        },
      ]
    `);
  });

  it("应处理重复的依赖项", () => {
    const tree: PeerDependenciesTree = {
      packageA: {
        version: {
          exact: "1.0.0",
          range: "^1.0.0",
        },
        hostModulePath: "",
        moduleEntries: {
          modulePath: "",
          moduleEntryAbsPath: "",
          moduleEntryRelPath: "",
        },
        name: "packageA",
        packageConfig: {
          name: "packageA",
          version: "1.0.0",
        },
        peerDependencies: {
          packageB: {
            version: {
              exact: "1.1.0",
              range: "^1.1.0",
            },
            hostModulePath: "",
            moduleEntries: {
              modulePath: "",
              moduleEntryAbsPath: "",
              moduleEntryRelPath: "",
            },
            name: "packageB",
            packageConfig: {
              name: "packageB",
              version: "1.1.0",
            },
            peerDependencies: {
              packageC: {
                version: {
                  exact: "1.2.0",
                  range: "^1.2.0",
                },
                hostModulePath: "",
                moduleEntries: {
                  modulePath: "",
                  moduleEntryAbsPath: "",
                  moduleEntryRelPath: "",
                },
                name: "packageC",
                packageConfig: {
                  name: "packageC",
                  version: "1.2.0",
                },
                peerDependencies: {},
              },
            },
          },
          packageC: {
            version: {
              exact: "1.2.0",
              range: "^1.2.0",
            },
            hostModulePath: "",
            moduleEntries: {
              modulePath: "",
              moduleEntryAbsPath: "",
              moduleEntryRelPath: "",
            },
            name: "packageC",
            packageConfig: {
              name: "packageC",
              version: "1.2.0",
            },
            peerDependencies: {},
          },
        },
      },
    };

    expect(convertDependenciesTreeToList(tree)).toMatchInlineSnapshot(`
      [
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageA",
          "packageConfig": {
            "name": "packageA",
            "version": "1.0.0",
          },
          "peerDependencies": {
            "packageB": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageB",
              "packageConfig": {
                "name": "packageB",
                "version": "1.1.0",
              },
              "peerDependencies": {
                "packageC": {
                  "hostModulePath": "",
                  "moduleEntries": {
                    "moduleEntryAbsPath": "",
                    "moduleEntryRelPath": "",
                    "modulePath": "",
                  },
                  "name": "packageC",
                  "packageConfig": {
                    "name": "packageC",
                    "version": "1.2.0",
                  },
                  "peerDependencies": {},
                  "version": {
                    "exact": "1.2.0",
                    "range": "^1.2.0",
                  },
                },
              },
              "version": {
                "exact": "1.1.0",
                "range": "^1.1.0",
              },
            },
            "packageC": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageC",
              "packageConfig": {
                "name": "packageC",
                "version": "1.2.0",
              },
              "peerDependencies": {},
              "version": {
                "exact": "1.2.0",
                "range": "^1.2.0",
              },
            },
          },
          "version": {
            "exact": "1.0.0",
            "range": "^1.0.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageB",
          "packageConfig": {
            "name": "packageB",
            "version": "1.1.0",
          },
          "peerDependencies": {
            "packageC": {
              "hostModulePath": "",
              "moduleEntries": {
                "moduleEntryAbsPath": "",
                "moduleEntryRelPath": "",
                "modulePath": "",
              },
              "name": "packageC",
              "packageConfig": {
                "name": "packageC",
                "version": "1.2.0",
              },
              "peerDependencies": {},
              "version": {
                "exact": "1.2.0",
                "range": "^1.2.0",
              },
            },
          },
          "version": {
            "exact": "1.1.0",
            "range": "^1.1.0",
          },
        },
        {
          "hostModulePath": "",
          "moduleEntries": {
            "moduleEntryAbsPath": "",
            "moduleEntryRelPath": "",
            "modulePath": "",
          },
          "name": "packageC",
          "packageConfig": {
            "name": "packageC",
            "version": "1.2.0",
          },
          "peerDependencies": {},
          "version": {
            "exact": "1.2.0",
            "range": "^1.2.0",
          },
        },
      ]
    `);
  });
});
