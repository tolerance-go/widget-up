import { jest } from "@jest/globals";
import { detectTechStack } from ".";

describe("detectTechStack function", () => {
  beforeEach(async () => {
    // 在每个测试前设置 mock
    jest.unstable_mockModule("fs", () => {
      const readFileSync = jest.fn((path: string) => {
        // 根据路径返回不同的 mock 数据
        if (
          path.includes("package.json") &&
          path.includes("node_modules/react")
        ) {
          return JSON.stringify({ version: "17.0.1" }); // 假设实际安装的版本
        } else if (
          path.includes("package.json") &&
          path.includes("node_modules/vue")
        ) {
          return JSON.stringify({ version: "3.0.5" }); // 假设实际安装的版本
        }
        return JSON.stringify({
          dependencies: {
            react: "^17.0.0",
            "react-dom": "^17.0.0",
            vue: "^3.0.0",
          },
          devDependencies: {},
        });
      });

      const existsSync = jest.fn((path: string): boolean => {
        return (
          path.includes("node_modules/react") ||
          path.includes("node_modules/vue")
        );
      });

      return {
        readFileSync,
        existsSync,
      };
    });

    jest.unstable_mockModule("path", async () => ({
      join: (...args: any[]) => args.join("/"),
    }));
  });

  afterEach(async () => {
    // 在每个测试后清理 mock
    jest.resetModules();
  });

  it("should detect React and Vue with their specific versions", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const result = detectTechStack({ fs, path });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "name": "React",
          "version": "17.0.1",
          "versionRange": "^17.0.0",
        },
        {
          "name": "Vue",
          "version": "3.0.5",
          "versionRange": "^3.0.0",
        },
      ]
    `);
  });
});
