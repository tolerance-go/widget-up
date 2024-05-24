import { jest } from "@jest/globals";
import { getPeerDependTree } from ".";

describe("getPeerDependTree", () => {
  beforeEach(async () => {
    jest.unstable_mockModule("fs", async () => ({
      readFileSync: jest.fn((libPath: string) => {
        if (libPath.endsWith("other/package.json")) {
          return JSON.stringify({ version: "1.1.0" });
        } else if (libPath.endsWith("utils/package.json")) {
          return JSON.stringify({ version: "1.1.0" });
        } else if (libPath.endsWith("react/package.json")) {
          return JSON.stringify({
            version: "16.8.0",
            peerDependencies: {
              other: "^1.0.0",
            },
          });
        } else if (libPath.endsWith("react-dom/package.json")) {
          return JSON.stringify({
            version: "16.8.0",
            peerDependencies: {
              react: "^16.8.0",
            },
          });
        } else if (libPath.endsWith("/fake/directory/package.json")) {
          return JSON.stringify({
            name: "root-package",
            version: "1.0.0",
            peerDependencies: {
              "react-dom": "^16.8.0",
              utils: "^1.0.0",
            },
          });
        } else {
          return JSON.stringify({
            version: "16.8.0",
            peerDependencies: {
              "react-dom": "^16.8.0",
              utils: "^1.0.0",
            },
          });
        }
      }),
    }));
    jest.unstable_mockModule("path", async () => ({
      join: (...args: any[]) => args.join("/"),
    }));
  });

  afterEach(async () => {
    // 清理 mock
    jest.resetModules();
  });

  it("应正确解析 package.json 中的 peerDependencies", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const result = getPeerDependTree({ cwd: "/fake/directory" }, { fs, path });

    // 根据新的数据结构更新快照
    expect(result).toMatchInlineSnapshot(`
      {
        "react-dom": {
          "hostModulePath": "/fake/directory/node_modules/react-dom",
          "moduleEntries": {
            "moduleBrowserEntryPath": undefined,
            "moduleEntryPath": "\\fake\\directory\\node_modules\\react-dom\\index.js",
            "modulePath": "/fake/directory/node_modules/react-dom",
            "moduleStyleEntryPath": undefined,
          },
          "name": "react-dom",
          "packageConfig": {
            "peerDependencies": {
              "react": "^16.8.0",
            },
            "version": "16.8.0",
          },
          "peerDependencies": {
            "react": {
              "hostModulePath": "/fake/directory/node_modules/react-dom/node_modules/react",
              "moduleEntries": {
                "moduleBrowserEntryPath": undefined,
                "moduleEntryPath": "\\fake\\directory\\node_modules\\react-dom\\node_modules\\react\\index.js",
                "modulePath": "/fake/directory/node_modules/react-dom/node_modules/react",
                "moduleStyleEntryPath": undefined,
              },
              "name": "react",
              "packageConfig": {
                "peerDependencies": {
                  "other": "^1.0.0",
                },
                "version": "16.8.0",
              },
              "peerDependencies": {
                "other": {
                  "hostModulePath": "/fake/directory/node_modules/react-dom/node_modules/react/node_modules/other",
                  "moduleEntries": {
                    "moduleBrowserEntryPath": undefined,
                    "moduleEntryPath": "\\fake\\directory\\node_modules\\react-dom\\node_modules\\react\\node_modules\\other\\index.js",
                    "modulePath": "/fake/directory/node_modules/react-dom/node_modules/react/node_modules/other",
                    "moduleStyleEntryPath": undefined,
                  },
                  "name": "other",
                  "packageConfig": {
                    "version": "1.1.0",
                  },
                  "peerDependencies": {},
                  "version": {
                    "exact": "1.1.0",
                    "range": "^1.0.0",
                  },
                },
              },
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
        "utils": {
          "hostModulePath": "/fake/directory/node_modules/utils",
          "moduleEntries": {
            "moduleBrowserEntryPath": undefined,
            "moduleEntryPath": "\\fake\\directory\\node_modules\\utils\\index.js",
            "modulePath": "/fake/directory/node_modules/utils",
            "moduleStyleEntryPath": undefined,
          },
          "name": "utils",
          "packageConfig": {
            "version": "1.1.0",
          },
          "peerDependencies": {},
          "version": {
            "exact": "1.1.0",
            "range": "^1.0.0",
          },
        },
      }
    `);
  });

  it("当 includeRootPackage 为 true 时应包含根包", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const result = getPeerDependTree(
      { cwd: "/fake/directory", includeRootPackage: true },
      { fs, path }
    );

    // 根据新的数据结构更新快照
    expect(result).toMatchInlineSnapshot(`
      {
        "root-package": {
          "hostModulePath": "/fake/directory",
          "moduleEntries": {
            "moduleBrowserEntryPath": undefined,
            "moduleEntryPath": "\\fake\\directory\\index.js",
            "modulePath": "/fake/directory",
            "moduleStyleEntryPath": undefined,
          },
          "name": "root-package",
          "packageConfig": {
            "name": "root-package",
            "peerDependencies": {
              "react-dom": "^16.8.0",
              "utils": "^1.0.0",
            },
            "version": "1.0.0",
          },
          "peerDependencies": {
            "react-dom": {
              "hostModulePath": "/fake/directory/node_modules/react-dom",
              "moduleEntries": {
                "moduleBrowserEntryPath": undefined,
                "moduleEntryPath": "\\fake\\directory\\node_modules\\react-dom\\index.js",
                "modulePath": "/fake/directory/node_modules/react-dom",
                "moduleStyleEntryPath": undefined,
              },
              "name": "react-dom",
              "packageConfig": {
                "peerDependencies": {
                  "react": "^16.8.0",
                },
                "version": "16.8.0",
              },
              "peerDependencies": {
                "react": {
                  "hostModulePath": "/fake/directory/node_modules/react-dom/node_modules/react",
                  "moduleEntries": {
                    "moduleBrowserEntryPath": undefined,
                    "moduleEntryPath": "\\fake\\directory\\node_modules\\react-dom\\node_modules\\react\\index.js",
                    "modulePath": "/fake/directory/node_modules/react-dom/node_modules/react",
                    "moduleStyleEntryPath": undefined,
                  },
                  "name": "react",
                  "packageConfig": {
                    "peerDependencies": {
                      "other": "^1.0.0",
                    },
                    "version": "16.8.0",
                  },
                  "peerDependencies": {
                    "other": {
                      "hostModulePath": "/fake/directory/node_modules/react-dom/node_modules/react/node_modules/other",
                      "moduleEntries": {
                        "moduleBrowserEntryPath": undefined,
                        "moduleEntryPath": "\\fake\\directory\\node_modules\\react-dom\\node_modules\\react\\node_modules\\other\\index.js",
                        "modulePath": "/fake/directory/node_modules/react-dom/node_modules/react/node_modules/other",
                        "moduleStyleEntryPath": undefined,
                      },
                      "name": "other",
                      "packageConfig": {
                        "version": "1.1.0",
                      },
                      "peerDependencies": {},
                      "version": {
                        "exact": "1.1.0",
                        "range": "^1.0.0",
                      },
                    },
                  },
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
            "utils": {
              "hostModulePath": "/fake/directory/node_modules/utils",
              "moduleEntries": {
                "moduleBrowserEntryPath": undefined,
                "moduleEntryPath": "\\fake\\directory\\node_modules\\utils\\index.js",
                "modulePath": "/fake/directory/node_modules/utils",
                "moduleStyleEntryPath": undefined,
              },
              "name": "utils",
              "packageConfig": {
                "version": "1.1.0",
              },
              "peerDependencies": {},
              "version": {
                "exact": "1.1.0",
                "range": "^1.0.0",
              },
            },
          },
          "version": {
            "exact": "1.0.0",
            "range": "1.0.0",
          },
        },
      }
    `);
  });
});
