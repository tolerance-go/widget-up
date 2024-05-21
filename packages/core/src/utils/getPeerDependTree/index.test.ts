import { jest } from "@jest/globals";
import getPeerDependTree from ".";

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

  it("should correctly parse peerDependencies from package.json", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const result = getPeerDependTree({ cwd: "/fake/directory" }, { fs, path });

    // 根据新的数据结构更新快照
    expect(result).toMatchInlineSnapshot(`
      {
        "react-dom": {
          "name": "react-dom",
          "peerDependencies": {
            "react": {
              "name": "react",
              "peerDependencies": {
                "other": {
                  "name": "other",
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
          "name": "utils",
          "peerDependencies": {},
          "version": {
            "exact": "1.1.0",
            "range": "^1.0.0",
          },
        },
      }
    `);
  });
});
