import { isExactVersion } from "@/src/isExactVersion";
import semver from "semver";
import { HTMLDependencyDetail } from "../../../types/htmlDependencyManager";

class DependencyManager {
  private dependencies: { [key: string]: HTMLDependencyDetail[] };
  public versionList: { [key: string]: string[] };

  constructor(versionList: { [key: string]: string[] } = {}) {
    this.versionList = versionList;
    this.dependencies = {};
  }

  // 更新或添加新的版本信息
  updateVersionList(newVersionList: { [dependencyName: string]: string[] }) {
    for (const dependency in newVersionList) {
      const newVersions = newVersionList[dependency];
      if (this.versionList[dependency]) {
        // 如果依赖已存在，合并新旧版本列表并去重
        this.versionList[dependency] = Array.from(
          new Set([...this.versionList[dependency], ...newVersions])
        ).sort(semver.rcompare);
      } else {
        // 如果依赖不存在，直接设置新版本列表
        this.versionList[dependency] = [...newVersions].sort(semver.rcompare);
      }
    }
  }

  addDependency(
    dependency: string,
    versionRange: string,
    subDependencies?: { [key: string]: string },
    isGlobal = true
  ) {
    let resolvedVersion = this.resolveVersion(dependency, versionRange);
    if (!resolvedVersion) return;

    if (!this.dependencies[dependency]) {
      this.dependencies[dependency] = [];
    }

    let existingDep = this.dependencies[dependency].find(
      (dep) => dep.version.exact === resolvedVersion
    );

    if (!existingDep) {
      existingDep = {
        version: {
          exact: resolvedVersion,
          range: versionRange,
        },
        subDependencies: {},
        isGlobal,
        name: dependency,
      };
      this.dependencies[dependency].push(existingDep);
    } else {
      // 更新是否为全局依赖
      existingDep.isGlobal = isGlobal;
    }

    if (subDependencies) {
      for (let subDep in subDependencies) {
        let subResolvedVersion = this.addDependency(
          subDep,
          subDependencies[subDep],
          undefined,
          false
        );
        if (subResolvedVersion) {
          const subDepInstance = this.dependencies[subDep]?.find(
            (dep) => dep.version.exact === subResolvedVersion
          );
          if (subDepInstance) {
            // 确保子依赖实例存在
            existingDep.subDependencies[subDep] = subDepInstance;
          }
        }
      }
    }

    return resolvedVersion;
  }

  removeDependency(dependency: string, versionRange: string, isGlobal = true) {
    if (!this.dependencies[dependency]) {
      return;
    }

    // 找到所有满足版本范围的依赖，并找到最高的版本
    const versionsToRemove = this.dependencies[dependency]
      .filter((dep) => semver.satisfies(dep.version.exact, versionRange))
      .sort((a, b) => semver.rcompare(a.version.exact, b.version.exact));

    if (versionsToRemove.length === 0) {
      console.warn("No version found matching the provided range.");
      return;
    }

    // 从版本列表中选择要删除的最高版本
    const versionToRemove = versionsToRemove.shift()!;

    if (!isGlobal) {
      if (versionToRemove.isGlobal) return;
    }

    // 检查是否有其他依赖项依赖于即将删除的版本
    if (this.isDependedOn(dependency, versionToRemove.version.exact)) {
      console.warn(
        `Cannot remove ${dependency}@${versionToRemove.version} as it is still required by another package.`
      );
      return;
    }

    // 删除选定版本
    this.dependencies[dependency] = this.dependencies[dependency].filter(
      (dep) => dep.version !== versionToRemove.version
    );

    // 递归删除所有子依赖
    Object.keys(versionToRemove.subDependencies).forEach((subDep) => {
      this.removeDependency(
        subDep,
        versionToRemove.subDependencies[subDep].version.exact,
        false
      );
    });

    // 如果删除后依赖为空，则从依赖项列表中完全删除该依赖
    if (this.dependencies[dependency].length === 0) {
      delete this.dependencies[dependency];
    }
  }

  getDependencies() {
    return this.dependencies;
  }

  private isDependedOn(dependency: string, version: string): boolean {
    // 遍历所有顶级依赖项的子依赖，检查是否存在依赖于指定版本的依赖
    return Object.values(this.dependencies).some((topLevelDeps) =>
      topLevelDeps.some((topLevelDep) =>
        Object.entries(topLevelDep.subDependencies).some(
          ([key, subDep]) => key === dependency && subDep.version.exact === version
        )
      )
    );
  }

   resolveVersion(
    dependency: string,
    versionRange: string
  ): string | undefined {
    // 如果版本范围是一个精确的版本号
    if (isExactVersion(versionRange)) {
      return versionRange;
    }

    const versions = this.versionList[dependency];
    if (!versions) return undefined;

    const sortedVersions = versions.sort(semver.rcompare);
    return sortedVersions.find((version) =>
      semver.satisfies(version, versionRange)
    );
  }
}

export { DependencyManager };
