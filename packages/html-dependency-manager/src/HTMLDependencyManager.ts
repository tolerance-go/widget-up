import { DependencyManager } from "./DependencyManager"; // 假设你已经将上面的代码保存为DependencyManager.ts
import semver from "semver";

class HTMLDependencyManager {
  private dependencyManager: DependencyManager;
  private fetchVersionList: (dependencyName: string) => Promise<string[]>;
  private versionCache: { [key: string]: string[] };

  constructor(fetchVersionList: (dependencyName: string) => Promise<string[]>) {
    this.fetchVersionList = fetchVersionList;
    this.dependencyManager = new DependencyManager({});
    this.versionCache = {};
  }

  async updateVersionList(dependency: string) {
    if (!this.versionCache[dependency]) {
      const versions = await this.fetchVersionList(dependency);
      this.versionCache[dependency] = versions;
      // 更新 DependencyManager 实例使用的版本列表
      this.dependencyManager = new DependencyManager(this.versionCache);
    }
  }

  async addDependency(
    dependency: string,
    versionRange: string,
    subDependencies?: { [key: string]: string },
    isGlobal = true,
  ): Promise<string | undefined> {
    await this.updateVersionList(dependency);
    return this.dependencyManager.addDependency(
      dependency,
      versionRange,
      subDependencies,
      isGlobal,
    );
  }

  async removeDependency(
    dependency: string,
    versionRange: string,
    isGlobal = true,
  ): Promise<void> {
    await this.updateVersionList(dependency);
    this.dependencyManager.removeDependency(dependency, versionRange, isGlobal);
  }

  getDependencies() {
    return this.dependencyManager.getDependencies();
  }
}

export { HTMLDependencyManager };
