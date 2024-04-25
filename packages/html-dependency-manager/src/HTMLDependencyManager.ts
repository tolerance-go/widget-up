import { DependencyManager, DependencyDetail } from "./DependencyManager";
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

  // 更新依赖版本列表，如果没有缓存
  private async updateVersionList(dependency: string) {
    if (!this.versionCache[dependency]) {
      const versions = await this.fetchVersionList(dependency);
      this.versionCache[dependency] = versions;
      this.dependencyManager.updateVersionList({ [dependency]: versions });
    }
  }

  // 收集并去重所有需要更新的依赖列表
  private async collectDependencies(
    dependency: string,
    subDependencies?: { [key: string]: string },
    collectedDependencies = new Set<string>(),
  ) {
    collectedDependencies.add(dependency);

    if (subDependencies) {
      for (const subDependency in subDependencies) {
        this.collectDependencies(
          subDependency,
          undefined,
          collectedDependencies,
        );
      }
    }

    return collectedDependencies;
  }

  // 更新所有收集到的依赖版本列表
  private async updateAllVersionLists(dependencies: Set<string>) {
    for (const dependency of dependencies) {
      await this.updateVersionList(dependency);
    }
  }

  // 递归收集所有相关依赖并更新版本列表
  async collectAndUpdateVersionLists(
    dependency: string,
    subDependencies?: { [key: string]: string },
  ) {
    const allDependencies = await this.collectDependencies(
      dependency,
      subDependencies,
    );
    await this.updateAllVersionLists(allDependencies);
  }

  async addDependency(
    dependency: string,
    versionRange: string,
    subDependencies?: { [key: string]: string },
  ): Promise<string | undefined> {
    // 确保依赖版本列表是最新的
    await this.collectAndUpdateVersionLists(dependency, subDependencies);

    // 添加主依赖项
    return this.dependencyManager.addDependency(
      dependency,
      versionRange,
      subDependencies,
    );
  }

  removeDependency(dependency: string, versionRange: string) {
    this.dependencyManager.removeDependency(dependency, versionRange);
  }

  getDependencies() {
    return this.dependencyManager.getDependencies();
  }
}

export { HTMLDependencyManager };
