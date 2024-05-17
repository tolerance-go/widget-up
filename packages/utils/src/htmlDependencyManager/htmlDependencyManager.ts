import { isExactVersion } from "../../src/isExactVersion";
import { DependencyManager } from "./dependencyManager";
import { TagManager } from "./tagManager";
import {
  DependencyTag,
  DependencyListDiff,
  DependencyDetail,
  DependencyListItem,
  TagEvents,
} from "../../types/htmlDependencyManager";
import { EventBus } from "../../src/eventBus";
import { HTMLDependencyManagerLogger } from "./logger";

interface ConstructorOptions {
  fetchVersionList: (dependencyName: string) => Promise<string[]>;
  document: Document;
  scriptSrcBuilder?: (dep: DependencyListItem) => string;
  linkHrefBuilder?: (dep: DependencyListItem) => string;
  debug?: boolean;
  eventBus?: EventBus<TagEvents>;
}

class HTMLDependencyManager {
  private dependencyManager: DependencyManager;
  private fetchVersionList: (dependencyName: string) => Promise<string[]>;
  private versionCache: { [key: string]: string[] };
  public tagManager: TagManager;
  public lastDependencies: DependencyListItem[] = []; // 上次的依赖详情列表
  private scriptSrcBuilder: (dep: DependencyListItem) => string; // 新增参数用于自定义构造 src
  private linkHrefBuilder: (dep: DependencyListItem) => string; // 现在是可选的，返回 string 或 false

  constructor(options: ConstructorOptions) {
    this.fetchVersionList = options.fetchVersionList;
    this.dependencyManager = new DependencyManager({});
    this.versionCache = {};
    this.scriptSrcBuilder =
      options.scriptSrcBuilder || ((dep) => `${dep.name}@${dep.version}.js`);
    this.linkHrefBuilder = options.linkHrefBuilder || (() => "");
    this.tagManager = new TagManager({
      document: options.document,
      scriptSrcBuilder: this.scriptSrcBuilder,
      linkSrcBuilder: this.linkHrefBuilder,
      debug: options.debug,
      eventBus: options.eventBus,
    });
  }
  async addDependency(
    dependency: string,
    versionRange: string,
    subDependencies?: { [key: string]: string }
  ): Promise<string | undefined> {
    // 只有当版本号不是精确版本时，才进行版本列表的更新
    if (!isExactVersion(versionRange)) {
      // 确保依赖版本列表是最新的
      await this.collectAndUpdateVersionLists(dependency, subDependencies);
    }

    // 添加主依赖项
    const newDependency = this.dependencyManager.addDependency(
      dependency,
      versionRange,
      subDependencies
    );
    this.triggerDiffs();
    return newDependency;
  }

  removeDependency(dependency: string, versionRange: string) {
    this.dependencyManager.removeDependency(dependency, versionRange);
    this.triggerDiffs();
  }

  getDependencies() {
    return this.dependencyManager.getDependencies();
  }

  // getSortedDependencies 方法用于获取排序后的依赖列表
  getSortedDependencies() {
    // 获取当前所有依赖项的信息
    const dependencies = this.getDependencies();
    HTMLDependencyManagerLogger.log(
      "getSortedDependencies_dependencies",
      dependencies
    );
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
      const depIdentifier = dep.name + "@" + dep.version.exact;
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
      if (!visited[dep.name + "@" + dep.version.exact]) {
        dfs(dep);
      }
    });

    // 由于依赖关系的特性，我们需要反转结果数组，以确保依赖的正确安装顺序
    // 即：子依赖项应该在父依赖项之前出现在列表中
    return result;
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
    collectedDependencies = new Set<string>()
  ) {
    collectedDependencies.add(dependency);

    if (subDependencies) {
      for (const subDependency in subDependencies) {
        this.collectDependencies(
          subDependency,
          undefined,
          collectedDependencies
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
  private async collectAndUpdateVersionLists(
    dependency: string,
    subDependencies?: { [key: string]: string }
  ) {
    const allDependencies = await this.collectDependencies(
      dependency,
      subDependencies
    );
    await this.updateAllVersionLists(allDependencies);
  }

  triggerDiffs() {
    const diffs = this.calculateDiffs(); // 计算标签的差异
    this.applyDiffs(diffs); // 应用差异更新 DOM
  }

  // 新方法：转换依赖项到 DependencyTag 列表
  getDependencyList(): DependencyListItem[] {
    const dependencies = this.getSortedDependencies();

    // 遍历排序后的依赖列表，创建对应的 tag 对象
    return dependencies.map((dep) => {
      return {
        version: dep.version,
        name: dep.name,
      };
    });
  }

  // 新方法：计算依赖标签的差异
  // 新方法：计算依赖详情的差异
  calculateDiffs(): DependencyListDiff {
    const currentDependencies = this.getDependencyList(); // 获取当前排序后的依赖详情
    HTMLDependencyManagerLogger.log("currentDependencies", currentDependencies);
    const oldDependenciesMap = new Map(
      this.lastDependencies.map((dep) => [
        dep.name + "@" + dep.version.exact,
        dep,
      ])
    ); // 创建映射以快速访问旧依赖
    const currentDependenciesMap = new Map(
      currentDependencies.map((dep) => [
        dep.name + "@" + dep.version.exact,
        dep,
      ])
    ); // 创建映射以快速访问当前依赖

    const diff: DependencyListDiff = {
      insert: [],
      remove: [],
      update: [],
      move: [],
    };

    let lastMovedIndex = -1; // 上次移动的索引，用于优化移动操作的识别

    // 遍历当前依赖详情，判断每个依赖的状态（新增、移动、更新）
    currentDependencies.forEach((dep, index) => {
      const oldDep = oldDependenciesMap.get(dep.name + "@" + dep.version.exact);
      const oldIndex = this.lastDependencies.findIndex(
        (d) =>
          d.name + "@" + d.version.exact === dep.name + "@" + dep.version.exact
      );

      if (!oldDep) {
        // 如果旧依赖中不存在，表示为新增
        diff.insert.push({
          dep,
          prevDep: index > 0 ? currentDependencies[index - 1] : null,
        });
      } else {
        const isMoved = oldIndex >= 0 && oldIndex !== index;
        if (isMoved && oldIndex > lastMovedIndex) {
          // 如果位置改变，并且该改变是必需的（非重复移动）
          diff.move.push({
            dep,
            prevDep: index > 0 ? currentDependencies[index - 1] : null,
          });
          lastMovedIndex = index;
        }
        if (JSON.stringify(dep.data) !== JSON.stringify(oldDep.data)) {
          // 如果子依赖有更新
          diff.update.push(dep);
        }
      }
    });

    // 遍历旧依赖详情，判断是否有依赖需要移除
    this.lastDependencies.forEach((dep) => {
      if (!currentDependenciesMap.has(dep.name + "@" + dep.version.exact)) {
        diff.remove.push(dep);
      }
    });

    this.lastDependencies = currentDependencies; // 更新依赖详情缓存，供下次差异计算使用

    return diff;
  }

  // 新方法：根据差异信息更新 head 中的标签
  applyDiffs(diff: DependencyListDiff): void {
    HTMLDependencyManagerLogger.log("获得diff数据", diff);
    HTMLDependencyManagerLogger.log(
      "获得diff插入数据",
      JSON.stringify(diff.insert, null, 2)
    );
    this.tagManager.applyDependencyDiffs(diff);
  }
}

export { HTMLDependencyManager };
