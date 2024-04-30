import { DependencyManager } from "@/src/HtmlDependencyManager/DependencyManager";

describe("DependencyManager", () => {
  let manager: DependencyManager;
  const versionList = {
    lodash: ["4.17.15", "4.17.20"],
    react: ["16.13.1", "17.0.0"],
  };

  beforeEach(() => {
    manager = new DependencyManager(versionList);
  });

  test("should remove a specified dependency correctly", () => {
    manager.addDependency("lodash", "^4.17.15");
    expect(manager.getDependencies().lodash).toHaveLength(1);

    manager.removeDependency("lodash", "4.17.15");
    expect(manager.getDependencies().lodash).toHaveLength(1);

    manager.removeDependency("lodash", "4.17.20");
    expect(manager.getDependencies().lodash).toBeUndefined(); // 确认已删除
  });

  test("should handle the case where the dependency does not exist", () => {
    manager.removeDependency("react", "17.0.0");
    expect(manager.getDependencies().react).toBeUndefined(); // 确认操作前后没有变化
  });
});
