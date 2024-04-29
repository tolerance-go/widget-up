import { DependencyManager, DependencyDetail } from "./DependencyManager";

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
  private document: Document;
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
    // 确保依赖版本列表是最新的
    await this.collectAndUpdateVersionLists(dependency, subDependencies);

    // 添加主依赖项
    const newDependency = await this.dependencyManager.addDependency(
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

  private updateTags() {
    const newDependencies = this.getSortedDependencies();
    const scriptContainer = this.document.head;

    const currentScripts = Array.from(
      scriptContainer.querySelectorAll("script")
    );
    const currentLinks = Array.from(scriptContainer.querySelectorAll("link"));

    // 使用新的依赖关系构建期望的 src 和 href 列表
    const expectedScripts = newDependencies
      .map((dep) => this.scriptSrcBuilder(dep))
      .filter(Boolean);
    const expectedLinks = newDependencies
      .map((dep) => this.linkHrefBuilder(dep))
      .filter(Boolean);

    // 更新 scripts
    this.updateTagsInContainer(
      scriptContainer,
      currentScripts,
      expectedScripts,
      "script",
      "src"
    );
    // 更新 links
    this.updateTagsInContainer(
      scriptContainer,
      currentLinks,
      expectedLinks,
      "link",
      "href"
    );
  }

  private updateTagsInContainer(
    container: HTMLElement,
    currentTags: Element[],
    expectedSources: string[],
    tagName: "script" | "link",
    srcAttr: "src" | "href"
  ) {
    // 建立一个映射，用来快速查找现有标签
    const srcMap = new Map<string, Element>();
    currentTags.forEach((tag) => {
      const src = tag.getAttribute(srcAttr);
      if (src) srcMap.set(src, tag);
    });

    const toAdd = expectedSources.filter((src) => !srcMap.has(src));
    const toRemove = Array.from(srcMap.keys()).filter(
      (src) => !expectedSources.includes(src)
    );

    // 移除不再需要的标签
    toRemove.forEach((src) => {
      const tag = srcMap.get(src);
      if (tag) {
        container.removeChild(tag);
      }
    });

    // 确保标签在正确的位置或添加新标签
    expectedSources.forEach((src, index) => {
      const tag = srcMap.get(src);
      if (!tag) {
        // 如果当前src需要添加，创建新的标签
        if (toAdd.includes(src)) {
          const newTag = this.document.createElement(tagName) as
            | HTMLScriptElement
            | HTMLLinkElement;
          newTag.setAttribute(srcAttr, src);
          if (tagName === "link") {
            (newTag as HTMLLinkElement).rel = "stylesheet";
          }
          // 添加到容器中的正确位置
          const nextSibling = container.children[index] || null;
          container.insertBefore(newTag, nextSibling);
          srcMap.set(src, newTag);
        }
      } else {
        // 如果标签已存在，但位置不正确，则调整位置
        const existingTag = container.children[index];
        if (tag !== existingTag) {
          container.insertBefore(tag, existingTag);
        }
      }
    });
  }
}

export { HTMLDependencyManager };
