import { resolveModuleInfo } from ".";

describe("resolvedNpm function", () => {
  it("should correctly resolve an npm package and return all paths and package data", () => {
    const result = resolveModuleInfo({ name: "rollup" });

    expect(result.moduleEntries.moduleEntryRelPath).toMatchInlineSnapshot(
      `"dist/rollup.js"`
    );
    expect(result.packageJSON).toMatchObject({
      name: "rollup",
      version: expect.any(String),
      main: "dist/rollup.js",
    });
  });

  it("should return null if the package does not exist", () => {
    expect(() => {
      resolveModuleInfo({ name: "nonexistent-package" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Module 'nonexistent-package' not found in any 'node_modules' directory from current path."`
    );
  });
});
