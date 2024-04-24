import semver from "semver";

interface DependencyDetail {
  version: string;
  subDependencies: Record<string, DependencyDetail>;
}

class DependencyManager {
  private dependencies: { [key: string]: any[] };
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

    // 检查是否已存在该依赖项
    if (!this.dependencies[dependency]) {
      this.dependencies[dependency] = [];
    }

    let existingDep = this.dependencies[dependency].find(
      (dep) => dep.version === resolvedVersion,
    );

    if (existingDep) {
      // 更新现有依赖的子依赖
      if (subDependencies) {
        for (let subDep in subDependencies) {
          let subVersion = this.resolveVersion(subDep, subDependencies[subDep]);
          if (subVersion) {
            existingDep.subDependencies[subDep] = { version: subVersion };
          } else {
            // 如果找不到合适的版本，可能需要移除该子依赖
            delete existingDep.subDependencies[subDep];
          }
        }
      }
    } else {
      // 添加新的依赖项
      let dependencyObject: DependencyDetail = {
        version: resolvedVersion,
        subDependencies: {},
      };

      if (subDependencies) {
        for (let subDep in subDependencies) {
          let subVersion = this.resolveVersion(subDep, subDependencies[subDep]);
          if (subVersion) {
            dependencyObject.subDependencies[subDep] = {
              version: subVersion,
              subDependencies: {},
            };
          }
        }
      }

      this.dependencies[dependency].push(dependencyObject);
    }
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
    for (let version of sortedVersions) {
      if (semver.satisfies(version, versionRange)) {
        return version;
      }
    }
    return undefined;
  }
}

export { DependencyManager };
