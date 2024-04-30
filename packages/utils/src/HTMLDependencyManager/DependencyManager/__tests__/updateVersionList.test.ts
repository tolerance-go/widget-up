import { DependencyManager } from "@/src/HTMLDependencyManager/DependencyManager";
import semver from "semver";

describe("DependencyManager updateVersionList", () => {
  let depManager: DependencyManager;

  beforeEach(() => {
    // 每个测试用例开始前都重新初始化 DependencyManager 实例
    depManager = new DependencyManager();
  });

  test("should add new dependency version list correctly", () => {
    const newVersions = { lodash: ["4.17.20", "4.17.15"] };
    depManager.updateVersionList(newVersions);
    expect(depManager.versionList["lodash"]).toEqual(
      ["4.17.20", "4.17.15"].sort(semver.rcompare),
    );
  });

  test("should update existing dependency with new versions and remove duplicates", () => {
    // 初始设置一些版本
    depManager.updateVersionList({ react: ["16.8.0", "16.8.6"] });
    // 添加新的版本，并测试去重
    const additionalVersions = { react: ["16.8.6", "17.0.0"] };
    depManager.updateVersionList(additionalVersions);
    expect(depManager.versionList["react"]).toEqual(
      ["17.0.0", "16.8.6", "16.8.0"].sort(semver.rcompare),
    );
  });

  test("should maintain versions in descending order", () => {
    const unorderedVersions = { vue: ["2.6.11", "2.5.17", "2.6.12"] };
    depManager.updateVersionList(unorderedVersions);
    expect(depManager.versionList["vue"]).toEqual(
      ["2.6.12", "2.6.11", "2.5.17"].sort(semver.rcompare),
    );
  });
});
