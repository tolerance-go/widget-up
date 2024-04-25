import { DependencyManager, DependencyDetail } from "./DependencyManager";
import semver from "semver";

class HTMLDependencyManager {
  private dependencyManager: DependencyManager;
  private fetchVersionList: (dependencyName: string) => Promise<string[]>;
  private versionCache: { [key: string]: string[] };
  private document: Document;

  constructor(
    fetchVersionList: (dependencyName: string) => Promise<string[]>,
    document: Document,
  ) {
    this.fetchVersionList = fetchVersionList;
    this.dependencyManager = new DependencyManager({});
    this.versionCache = {};
    this.document = document;
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
    const oldSortedDependencies = this.getSortedDependencies();

    // 确保依赖版本列表是最新的
    await this.collectAndUpdateVersionLists(dependency, subDependencies);

    // 添加主依赖项
    const newDependency = await this.dependencyManager.addDependency(
      dependency,
      versionRange,
      subDependencies,
    );
    this.updateScriptTags(oldSortedDependencies);
    return newDependency;
  }

  removeDependency(dependency: string, versionRange: string) {
    const oldSortedDependencies = this.getSortedDependencies();
    this.dependencyManager.removeDependency(dependency, versionRange);
    this.updateScriptTags(oldSortedDependencies);
  }

  getDependencies() {
    return this.dependencyManager.getDependencies();
  }

  // getSortedDependencies 方法用于获取排序后的依赖列表
  getSortedDependencies() {
    // 获取当前所有依赖项的信息
    const dependencies = this.getDependencies();
    const allDependencies: DependencyDetail[] = [];
    const visited: { [key: string]: boolean } = {};
    const result: DependencyDetail[] = [];

    // 将依赖项从嵌套的结构转换为单个数组，方便处理
    for (const depKey in dependencies) {
      allDependencies.push(...dependencies[depKey]);
    }

    // DFS 助手函数，用于递归访问每一个依赖及其子依赖
    const dfs = (dep: DependencyDetail) => {
      // 生成唯一标识符，格式为“名称@版本”
      const depIdentifier = dep.name + "@" + dep.version;
      // 如果已访问过，则跳过
      if (visited[depIdentifier]) return;
      visited[depIdentifier] = true;

      // 递归地访问所有子依赖
      if (dep.subDependencies) {
        for (const subDepKey in dep.subDependencies) {
          dfs(dep.subDependencies[subDepKey]);
        }
      }

      // 所有子依赖访问完后，将当前依赖加入结果列表
      result.push(dep);
    };

    // 遍历所有依赖项，使用DFS确保每个依赖及其子依赖都被访问
    allDependencies.forEach((dep) => {
      if (!visited[dep.name + "@" + dep.version]) {
        dfs(dep);
      }
    });

    // 由于依赖关系的特性，我们需要反转结果数组，以确保依赖的正确安装顺序
    // 即：子依赖项应该在父依赖项之前出现在列表中
    return result;
  }

  // 比较并更新 DOM 中的 <script> 标签，确保顺序正确
  updateScriptTags(oldDependencies: DependencyDetail[]) {
    const newDependencies = this.getSortedDependencies();
    const scriptContainer = this.document.head;

    const oldScripts = oldDependencies.map(
      (dep) => `path/to/${dep.name}@${dep.version}.js`,
    );
    const newScripts = newDependencies.map(
      (dep) => `path/to/${dep.name}@${dep.version}.js`,
    );

    const toAdd = newScripts.filter((x) => !oldScripts.includes(x));
    const toRemove = oldScripts.filter((x) => !newScripts.includes(x));

    // 移除不再需要的 <script> 标签
    Array.from(scriptContainer.querySelectorAll("script")).forEach((script) => {
      if (toRemove.includes(script.src)) {
        script.remove();
      }
    });

    // 添加新的 <script> 标签，确保它们的顺序与 newDependencies 相匹配
    newDependencies.forEach((dep) => {
      const src = `path/to/${dep.name}@${dep.version}.js`;
      if (toAdd.includes(src)) {
        const script = this.document.createElement("script");
        script.src = src;
        let inserted = false;

        // 查找正确的插入点
        const scripts = Array.from(scriptContainer.querySelectorAll("script"));
        for (let i = 0; i < scripts.length; i++) {
          const nextScriptSrc = scripts[i].src;
          if (newScripts.indexOf(nextScriptSrc) > newScripts.indexOf(src)) {
            scriptContainer.insertBefore(script, scripts[i]);
            inserted = true;
            break;
          }
        }

        // 如果没有找到适当的位置，则添加到最后
        if (!inserted) {
          scriptContainer.appendChild(script);
        }
      }
    });
  }
}

export { HTMLDependencyManager };
