import semver from "semver";

interface DependencyDetail {
  version: string;
  subDependencies: Record<string, DependencyDetail>;
}

class DependencyManager {
  private dependencies: { [key: string]: DependencyDetail[] };
  private versionList: { [key: string]: string[] };

  constructor(versionList: { [key: string]: string[] }) {
    this.versionList = versionList;
    this.dependencies = {};
  }

  addDependency(
    dependency: string,
    versionRange: string,
    subDependencies?: { [key: string]: string },
  ) {
    let resolvedVersion = this.resolveVersion(dependency, versionRange);
    if (!resolvedVersion) return;

    if (!this.dependencies[dependency]) {
      this.dependencies[dependency] = [];
    }

    let existingDep = this.dependencies[dependency].find(
      (dep) => dep.version === resolvedVersion,
    );

    if (!existingDep) {
      existingDep = {
        version: resolvedVersion,
        subDependencies: {},
      };
      this.dependencies[dependency].push(existingDep);
    }

    if (subDependencies) {
      for (let subDep in subDependencies) {
        let subResolvedVersion = this.addDependency(
          subDep,
          subDependencies[subDep],
        ); // 直接以顶级依赖形式添加子依赖
        if (subResolvedVersion) {
          // 在父依赖的subDependencies中保存对子依赖的引用
          existingDep.subDependencies[subDep] = {
            version: subResolvedVersion,
            subDependencies: {},
          };
        }
      }
    }

    return resolvedVersion;
  }

  removeDependency(dependency: string, versionRange: string) {
    if (!this.dependencies[dependency]) {
      return;
    }

    // 找到所有满足版本范围的依赖，并找到最高的版本
    const versionsToRemove = this.dependencies[dependency]
      .filter((dep) => semver.satisfies(dep.version, versionRange))
      .sort((a, b) => semver.rcompare(a.version, b.version));

    if (versionsToRemove.length === 0) {
      console.warn("No version found matching the provided range.");
      return;
    }

    // 从版本列表中选择要删除的最高版本
    const versionToRemove = versionsToRemove.shift()!;

    // 检查是否有其他依赖项依赖于即将删除的版本
    if (this.isDependedOn(dependency, versionToRemove.version)) {
      console.warn(
        `Cannot remove ${dependency}@${versionToRemove.version} as it is still required by another package.`,
      );
      return;
    }

    // 删除选定版本
    this.dependencies[dependency] = this.dependencies[dependency].filter(
      (dep) => dep.version !== versionToRemove.version,
    );

    // 递归删除所有子依赖
    Object.keys(versionToRemove.subDependencies).forEach((subDep) => {
      this.removeDependency(
        subDep,
        versionToRemove.subDependencies[subDep].version,
      );
    });

    // 如果删除后依赖为空，则从依赖项列表中完全删除该依赖
    if (this.dependencies[dependency].length === 0) {
      delete this.dependencies[dependency];
    }
  }

  private isDependedOn(dependency: string, version: string): boolean {
    // 遍历所有顶级依赖项的子依赖，检查是否存在依赖于指定版本的依赖
    return Object.values(this.dependencies).some((topLevelDeps) =>
      topLevelDeps.some((topLevelDep) =>
        Object.entries(topLevelDep.subDependencies).some(
          ([key, subDep]) => key === dependency && subDep.version === version,
        ),
      ),
    );
  }

  getDependencies() {
    return this.dependencies;
  }

  private resolveVersion(
    dependency: string,
    versionRange: string,
  ): string | undefined {
    const versions = this.versionList[dependency];
    if (!versions) return undefined;

    const sortedVersions = versions.sort(semver.rcompare);
    return sortedVersions.find((version) =>
      semver.satisfies(version, versionRange),
    );
  }
}

export { DependencyManager };
