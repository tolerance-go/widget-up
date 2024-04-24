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
    version: string,
    subDependencies?: { [key: string]: string },
  ) {
    let resolvedVersion = this.resolveVersion(dependency, version);
    if (!resolvedVersion) return;

    if (!this.dependencies[dependency]) {
      this.dependencies[dependency] = [];
    }

    let existingDep = this.dependencies[dependency].find(
      dep => dep.version === resolvedVersion
    );

    if (!existingDep) {
      existingDep = {
        version: resolvedVersion,
        subDependencies: {}
      };
      this.dependencies[dependency].push(existingDep);
    }

    if (subDependencies) {
      for (let subDep in subDependencies) {
        let subResolvedVersion = this.addDependency(subDep, subDependencies[subDep]); // 直接以顶级依赖形式添加子依赖
        if (subResolvedVersion) {
          // 在父依赖的subDependencies中保存对子依赖的引用
          existingDep.subDependencies[subDep] = {
            version: subResolvedVersion,
            subDependencies: {}
          };
        }
      }
    }

    return resolvedVersion;
  }

  removeDependency(dependency: string, version: string) {
    if (!this.dependencies[dependency]) {
      return;
    }

    this.dependencies[dependency] = this.dependencies[dependency].filter(
      dep => dep.version !== version
    );

    if (this.dependencies[dependency].length === 0) {
      delete this.dependencies[dependency];
    }
  }

  getDependencies() {
    return this.dependencies;
  }

  private resolveVersion(dependency: string, versionRange: string): string | undefined {
    const versions = this.versionList[dependency];
    if (!versions) return undefined;

    const sortedVersions = versions.sort(semver.rcompare);
    return sortedVersions.find(version => semver.satisfies(version, versionRange));
  }
}

export { DependencyManager };
