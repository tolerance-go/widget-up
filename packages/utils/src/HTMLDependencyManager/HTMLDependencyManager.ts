import { isExactVersion } from "../isExactVersion";
import { DependencyManager, DependencyDetail } from "./DependencyManager";

interface ConstructorOptions {
  fetchVersionList: (dependencyName: string) => Promise<string[]>;
  document: Document;
  scriptSrcBuilder?: (dep: DependencyDetail) => string;
  linkHrefBuilder?: (dep: DependencyDetail) => string;
}

interface TagDiff {
  insert: InsertionDetail[]; // 插入的标签及其位置
  remove: DependencyTag[]; // 需要删除的标签
  update: DependencyTag[]; // 需要更新的标签（如果有）
}

interface InsertionDetail {
  tag: DependencyTag;
  beforeSrc: string | null; // 插入在哪个标签之前，null 表示添加到末尾
}

interface DependencyTag {
  type: "script" | "link"; // 标识标签类型
  src: string; // script 的 src 或 link 的 href
  attributes: {
    // 其他需要管理的属性
    [key: string]: string;
  };
}

class HTMLDependencyManager {
  private dependencyManager: DependencyManager;
  private fetchVersionList: (dependencyName: string) => Promise<string[]>;
  private versionCache: { [key: string]: string[] };
  private document: Document;
  private lastTags: DependencyTag[] = []; // 上次的标签列表
  private scriptSrcBuilder: (dep: DependencyDetail) => string; // 新增参数用于自定义构造 src
  private linkHrefBuilder: (dep: DependencyDetail) => string; // 现在是可选的，返回 string 或 false

  constructor(options: ConstructorOptions) {
    this.fetchVersionList = options.fetchVersionList;
    this.dependencyManager = new DependencyManager({});
    this.versionCache = {};
    this.document = options.document;
    this.scriptSrcBuilder =
      options.scriptSrcBuilder || ((dep) => `${dep.name}@${dep.version}.js`);
    this.linkHrefBuilder = options.linkHrefBuilder || (() => "");
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
    this.updateTags();
    return newDependency;
  }

  removeDependency(dependency: string, versionRange: string) {
    this.dependencyManager.removeDependency(dependency, versionRange);
    this.updateTags();
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

  updateTags() {
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
  calculateDiffs(): TagDiff {
    const currentTags = this.getDependencyTags();
    const oldTagsMap = new Map(this.lastTags.map((tag) => [tag.src, tag]));
    const currentTagsMap = new Map(currentTags.map((tag) => [tag.src, tag]));

    const diff: TagDiff = {
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
        diff.insert.push({ tag: tag, beforeSrc: prevSrc });
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
  applyDiffs(diff: TagDiff): void {
    const head = this.document.head;

    // 处理插入的标签
    diff.insert.forEach((detail) => {
      const element = this.createElementFromTag(detail.tag);
      if (detail.beforeSrc) {
        // 寻找指定的前一个元素
        const referenceElement = head.querySelector(
          `[src="${detail.beforeSrc}"]`
        );
        const beforeElement = referenceElement
          ? referenceElement.nextSibling
          : null;
        // 如果找到位置，则插入到该位置
        if (beforeElement) {
          head.insertBefore(element, beforeElement);
        } else {
          // 如果没有找到前一个元素，插入到最后
          head.appendChild(element);
        }
      } else {
        // 如果没有指定 beforeSrc，即插入位置为第一个
        const firstChild = head.firstChild;
        if (firstChild) {
          head.insertBefore(element, firstChild);
        } else {
          // 如果头部容器为空，直接添加
          head.appendChild(element);
        }
      }
    });

    // Handling the removal of tags
    diff.remove.forEach((tag) => {
      const elements = head.querySelectorAll(`${tag.type}[src="${tag.src}"]`);
      elements.forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    });

    // Handle tag updates
    diff.update.forEach((tag) => {
      const elements = head.querySelectorAll(`${tag.type}[src="${tag.src}"]`);
      elements.forEach((el) => {
        Object.keys(tag.attributes).forEach((attr) => {
          el.setAttribute(attr, tag.attributes[attr]);
        });
      });
    });
  }

  // 辅助方法：从 DependencyTag 创建 DOM 元素
  private createElementFromTag(tag: DependencyTag): HTMLElement {
    const element = this.document.createElement(tag.type) as
      | HTMLScriptElement
      | HTMLLinkElement;

    // 根据标签类型设置对应的资源属性
    if (tag.type === "script") {
      const scriptEl = element as HTMLScriptElement;
      scriptEl.src = tag.src; // 为script设置src
    } else if (tag.type === "link") {
      const linkEl = element as HTMLLinkElement;
      linkEl.href = tag.src;
    }

    // 添加额外的属性
    Object.keys(tag.attributes).forEach((attr) => {
      element.setAttribute(attr, tag.attributes[attr]);
    });
    element.setAttribute("data-managed", "true"); // 标记管理的元素
    return element;
  }
}

export { HTMLDependencyManager };
