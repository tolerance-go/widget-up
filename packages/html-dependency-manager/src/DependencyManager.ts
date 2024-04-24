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
      .sort((a, b) => semver.rcompare(a.version, b.version))
      .shift(); // 取最高版本

    if (!versionsToRemove) {
      console.warn("No version found matching the provided range.");
      return;
    }

    // 检查是否有其他依赖项依赖于即将删除的版本
    if (this.isDependedOn(dependency, versionsToRemove.version)) {
      console.warn(
        `Cannot remove ${dependency}@${versionsToRemove.version} as it is still required by another package.`,
      );
      return;
    }

    // 如果没有其他依赖项依赖于它，则进行删除
    this.dependencies[dependency] = this.dependencies[dependency].filter(
      (dep) => dep.version !== versionsToRemove.version,
    );

    // 如果删除后依赖为空，则删除该依赖项
    if (this.dependencies[dependency].length === 0) {
      delete this.dependencies[dependency];
    }
  }

  private isDependedOn(dependency: string, version: string): boolean {
    for (let key in this.dependencies) {
      for (let dep of this.dependencies[key]) {
        if (
          dep.subDependencies[dependency] &&
          dep.subDependencies[dependency].version === version
        ) {
          return true;
        }
      }
    }
    return false;
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
