import { resolvedNpm } from ".";

describe("resolvedNpm function", () => {
  it("should correctly resolve an npm package and return all paths and package data", () => {
    const result = resolvedNpm({ name: "rollup" });

    expect(result.moduleEntryPath).toMatch(/dist\/rollup.js/);
    expect(result.modulePath).toMatch(/node_modules\/rollup/);
    expect(result.packageJson).toMatchObject({
      name: "rollup",
      version: expect.any(String),
      main: "dist/rollup.js",
    });
  });

  it("should return null if the package does not exist", () => {
    expect(() => {
      resolvedNpm({ name: "nonexistent-package" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Module 'nonexistent-package' not found in any 'node_modules' directory from current path."`
    );
  });
});
