import { DependencyManager } from "@/src/htmlDependencyManager/dependencyManager";
import { jest } from "@jest/globals";

describe("DependencyManager range", () => {
  let dm: DependencyManager;
  const versionList = {
    react: ["16.8.0", "17.0.1", "16.0.0", "15.6.2"],
    lodash: ["4.17.21", "4.17.15", "4.16.0"],
  };

  beforeEach(() => {
    dm = new DependencyManager(versionList);
  });

  test("should handle version ranges by selecting the best match from the list", () => {
    dm.addDependency("react", "^16.0.0");
    expect(dm.getDependencies()["react"][0].version.exact).toBe("16.8.0");
  });

  test("should not add a dependency if no version in the list matches the range", () => {
    dm.addDependency("react", "^18.0.0");
    expect(dm.getDependencies()["react"]).toBeUndefined();
  });

  test("should add exact versions correctly when specified", () => {
    dm.addDependency("react", "17.0.1");
    expect(dm.getDependencies()["react"][0].version.exact).toBe("17.0.1");
  });

  test("should handle multiple dependencies with mixed version types", () => {
    dm.addDependency("react", "16.8.0");
    dm.addDependency("react", "^17.0.0");
    expect(dm.getDependencies()["react"].length).toBe(2);
    expect(dm.getDependencies()["react"][0].version.exact).toBe("16.8.0");
    expect(dm.getDependencies()["react"][1].version.exact).toBe("17.0.1");
  });
});
