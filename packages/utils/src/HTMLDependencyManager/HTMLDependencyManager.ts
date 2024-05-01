import { isExactVersion } from "../isExactVersion";
import { DependencyManager, DependencyDetail } from "./DependencyManager";
import { TagManager } from "./TagManager";
import { DependencyTag, DependencyTagDiff } from "./types";

interface ConstructorOptions {
  fetchVersionList: (dependencyName: string) => Promise<string[]>;
  document: Document;
  scriptSrcBuilder?: (dep: DependencyDetail) => string;
  linkHrefBuilder?: (dep: DependencyDetail) => string;
}

class HTMLDependencyManager {
  private dependencyManager: DependencyManager;
  private fetchVersionList: (dependencyName: string) => Promise<string[]>;
  private versionCache: { [key: string]: string[] };
  private tagManager: TagManager;
  private lastTags: DependencyTag[] = []; // 上次的标签列表
  private scriptSrcBuilder: (dep: DependencyDetail) => string; // 新增参数用于自定义构造 src
  private linkHrefBuilder: (dep: DependencyDetail) => string; // 现在是可选的，返回 string 或 false

  constructor(options: ConstructorOptions) {
    this.fetchVersionList = options.fetchVersionList;
    this.dependencyManager = new DependencyManager({});
    this.versionCache = {};
    this.scriptSrcBuilder =
      options.scriptSrcBuilder || ((dep) => `${dep.name}@${dep.version}.js`);
    this.linkHrefBuilder = options.linkHrefBuilder || (() => "");
    this.tagManager = new TagManager({
      document: options.document,
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
  getDependencyTags(): DependencyTag[] {
    const dependencies = this.getSortedDependencies();
    const tags: DependencyTag[] = [];

    // 遍历排序后的依赖列表，创建对应的 tag 对象
    dependencies.forEach((dep) => {
      if (this.linkHrefBuilder(dep)) {
        tags.push({
          type: "link",
          src: this.linkHrefBuilder(dep),
          attributes: { rel: "stylesheet" },
        });
      }
      if (this.scriptSrcBuilder(dep)) {
        tags.push({
          type: "script",
          src: this.scriptSrcBuilder(dep),
          attributes: { async: "true" }, // 示例属性，可根据需求添加更多
        });
      }
    });

    return tags;
  }

  // 新方法：计算依赖标签的差异
  calculateDiffs(): DependencyTagDiff {
    const currentTags = this.getDependencyTags();
    const oldTagsMap = new Map(this.lastTags.map((tag) => [tag.src, tag]));
    const currentTagsMap = new Map(currentTags.map((tag) => [tag.src, tag]));

    const diff: DependencyTagDiff = {
      insert: [],
      remove: [],
      update: [],
    };

    // 跟踪前一个标签的 src，用于确定插入位置
    let prevSrc: string | null = null;

    currentTags.forEach((tag, index) => {
      const oldTag = oldTagsMap.get(tag.src);

      if (!oldTag) {
        // 新增标签，需要确定具体位置
        diff.insert.push({ tag: tag, prevSrc: prevSrc });
      } else {
        // 更新已有标签的属性，如果有变化
        if (
          JSON.stringify(tag.attributes) !== JSON.stringify(oldTag.attributes)
        ) {
          diff.update.push(tag);
        }
      }

      // 更新前一个标签的 src
      prevSrc = tag.src;
    });

    // 查找需要删除的标签
    this.lastTags.forEach((tag) => {
      if (!currentTagsMap.has(tag.src)) {
        diff.remove.push(tag);
      }
    });

    // 更新 lastTags 以用于下一次比较
    this.lastTags = currentTags;

    return diff;
  }

  // 新方法：根据差异信息更新 head 中的标签
  applyDiffs(diff: DependencyTagDiff): void {
    this.tagManager.applyDependencyDiffs(diff);
  }
}

export { HTMLDependencyManager };
