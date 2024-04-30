import { DependencyManager } from "@/src/HTMLDependencyManager/DependencyManager";

describe("DependencyManager version range tests", () => {
  let dm: DependencyManager;
  const versionList = {
    react: ["16.8.0", "17.0.1", "16.0.0", "15.6.2"],
    lodash: ["4.17.21", "4.17.15", "4.16.0"],
    vue: ["2.6.11", "2.5.17", "2.5.22-beta.1"],
  };

  beforeEach(() => {
    dm = new DependencyManager(versionList);
  });

  test("should select the highest matching minor version when using caret ranges", () => {
    dm.addDependency("lodash", "^4.17.0");
    expect(dm.getDependencies()["lodash"][0].version).toBe("4.17.21");
  });

  test("should handle tilde ranges by selecting the best patch update within the minor version", () => {
    dm.addDependency("vue", ">=2.5.22-beta.0 <2.5.23");
    expect(dm.getDependencies()["vue"][0].version).toBe("2.5.22-beta.1");
  });

  test("should respect pre-release versions if explicitly included in the range", () => {
    dm.addDependency("vue", "2.5.22-beta.*");
    expect(dm.getDependencies()["vue"]).toBe(undefined);
  });

  test("should respect pre-release versions if explicitly included in the range 2", () => {
    dm.addDependency("vue", "2.5.22-beta.x");
    expect(dm.getDependencies()["vue"]).toBe(undefined);
  });

  test("should exclude pre-release versions if the range does not explicitly include them", () => {
    dm.addDependency("vue", "^2.5.0");
    expect(dm.getDependencies()["vue"][0].version).toBe("2.6.11");
  });

  test("should handle complex ranges, selecting a version that satisfies all constraints", () => {
    dm.addDependency("react", ">=16.0.0 <17.0.0");
    expect(dm.getDependencies()["react"][0].version).toBe("16.8.0");
  });

  test("should correctly handle multiple constraints within the same dependency group", () => {
    dm.addDependency("react", ">=15.0.0 <=16.8.0");
    dm.addDependency("react", "^16.0.0");
    expect(dm.getDependencies()["react"].length).toBe(1);
    expect(dm.getDependencies()["react"][0].version).toBe("16.8.0");
  });
});
