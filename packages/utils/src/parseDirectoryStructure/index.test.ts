import { jest } from "@jest/globals";
import { parseDirectoryStructure } from ".";

describe("parseDirectoryStructure", () => {
  beforeEach(() => {
    // 模拟 fs 模块
    jest.unstable_mockModule("fs", async () => ({
      existsSync: jest.fn((path) => true), // 假设所有路径都有效
      statSync: jest.fn((path: string) => ({
        isDirectory: () => !path.includes("."),
      })),
      readdirSync: jest.fn((dirPath) => {
        if (dirPath === "/fake/directory") {
          return ["subdir", "file.txt"];
        } else if (dirPath === "/fake/directory/subdir") {
          return ["nestedFile.txt"];
        }
        return [];
      }),
    }));

    // 模拟 path 模块
    jest.unstable_mockModule("path", async () => ({
      basename: (path: string) => path.split("/").pop(),
      join: (...args: string[]) => args.join("/"),
      relative: (from: string, to: string) => to.replace(from + "/", ""), // 计算相对路径
    }));
  });

  afterEach(async () => {
    jest.resetModules(); // 在每个测试后清理 mock
  });

  it("should correctly parse a directory structure with relative paths", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const result = parseDirectoryStructure("/fake/directory", fs, path);
    expect(result).toMatchObject({
      name: "directory",
      type: "directory",
      path: "/fake/directory",
      relPath: "",
      children: [
        {
          name: "subdir",
          type: "directory",
          path: "/fake/directory/subdir",
          relPath: "subdir",
          children: [
            {
              name: "nestedFile.txt",
              type: "file",
              path: "/fake/directory/subdir/nestedFile.txt",
              relPath: "subdir/nestedFile.txt",
            },
          ],
        },
        {
          name: "file.txt",
          type: "file",
          path: "/fake/directory/file.txt",
          relPath: "file.txt",
        },
      ],
    });
  });
});
