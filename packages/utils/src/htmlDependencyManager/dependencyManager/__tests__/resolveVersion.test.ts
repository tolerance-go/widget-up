import { DependencyManager } from "@/src/htmlDependencyManager/dependencyManager";

describe("DependencyManager Version Resolution", () => {
  let dm: DependencyManager;
  const versionList = {
    react: ["16.8.0", "17.0.1", "16.13.1"],
    vue: ["2.6.11", "3.0.0"]
  };

  beforeEach(() => {
    dm = new DependencyManager(versionList);
  });

  test("returns the exact version when an exact version is provided", () => {
    const version = dm.resolveVersion("react", "16.8.0");
    expect(version).toBe("16.8.0");
  });

  test("returns the highest matching version when a range is provided", () => {
    const version = dm.resolveVersion("react", "^16.8.0");
    expect(version).toBe("16.13.1");
  });

  test("returns undefined when the exact version is not in the list", () => {
    const version = dm.resolveVersion("react", "15.0.0");
    expect(version).toBe("15.0.0");
  });

  test("returns undefined when no versions satisfy the range", () => {
    const version = dm.resolveVersion("react", "^18.0.0");
    expect(version).toBeUndefined();
  });

  test("handles non-existent dependencies gracefully", () => {
    const version = dm.resolveVersion("angular", "10.0.0");
    expect(version).toBe("10.0.0");
  });

  test("returns the exact version for vue when an exact version is provided", () => {
    const version = dm.resolveVersion("vue", "3.0.0");
    expect(version).toBe("3.0.0");
  });

  test("returns the highest matching version for vue when a range is provided", () => {
    const version = dm.resolveVersion("vue", "^2.6.0");
    expect(version).toBe("2.6.11");
  });
});
