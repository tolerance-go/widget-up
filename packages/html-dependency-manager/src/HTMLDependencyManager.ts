import { DependencyManager, DependencyDetail } from "./DependencyManager";

class HTMLDependencyManager {
  private dependencyManager: DependencyManager;
  private fetchVersionList: (dependencyName: string) => Promise<string[]>;
  private versionCache: { [key: string]: string[] };
  private document: Document;
  private lastSortedDependencies: DependencyDetail[] = []; // 新增存储旧依赖的数组
  private scriptSrcBuilder: (dep: DependencyDetail) => string; // 新增参数用于自定义构造 src
  private linkHrefBuilder: (dep: DependencyDetail) => string; // 现在是可选的，返回 string 或 false

  constructor(
    fetchVersionList: (dependencyName: string) => Promise<string[]>,
    document: Document,
    scriptSrcBuilder: (dep: DependencyDetail) => string = (dep) =>
      `${dep.name}@${dep.version}.js`, // 默认值
    linkHrefBuilder: (dep: DependencyDetail) => string = (dep) => ""
  ) {
    this.fetchVersionList = fetchVersionList;
    this.dependencyManager = new DependencyManager({});
    this.versionCache = {};
    this.document = document;
    this.scriptSrcBuilder = scriptSrcBuilder;
    this.linkHrefBuilder = linkHrefBuilder;
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
  async collectAndUpdateVersionLists(
    dependency: string,
    subDependencies?: { [key: string]: string }
  ) {
    const allDependencies = await this.collectDependencies(
      dependency,
      subDependencies
    );
    await this.updateAllVersionLists(allDependencies);
  }

  async addDependency(
    dependency: string,
    versionRange: string,
    subDependencies?: { [key: string]: string }
  ): Promise<string | undefined> {
    this.lastSortedDependencies = this.getSortedDependencies();

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
    this.lastSortedDependencies = this.getSortedDependencies();
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

  // 比较并更新 DOM 中的 <script> 标签，确保顺序正确
  updateTags() {
    const newDependencies = this.getSortedDependencies();
    const scriptContainer = this.document.head;
    const oldScripts = this.lastSortedDependencies.map((dep) =>
      this.scriptSrcBuilder(dep)
    );
    const newScripts = newDependencies.map((dep) => this.scriptSrcBuilder(dep));

    const oldLinks = this.lastSortedDependencies.map((dep) =>
      this.linkHrefBuilder(dep)
    );
    const newLinks = newDependencies.map((dep) => this.linkHrefBuilder(dep));

    const toAddScripts = newScripts
      .filter((x) => !oldScripts.includes(x))
      .filter(Boolean);
    const toRemoveScripts = oldScripts.filter((x) => !newScripts.includes(x));
    const toAddLinks = newLinks
      .filter((x) => !oldLinks.includes(x))
      .filter(Boolean);
    const toRemoveLinks = oldLinks.filter((x) => !newLinks.includes(x));

    // 移除不再需要的 <script> 和 <link> 标签
    Array.from(scriptContainer.querySelectorAll("script, link")).forEach(
      (element) => {
        if (
          element.tagName.toLowerCase() === "script" &&
          toRemoveScripts.includes((element as HTMLScriptElement).src)
        ) {
          element.remove();
        }
        if (
          element.tagName.toLowerCase() === "link" &&
          toRemoveLinks.includes((element as HTMLLinkElement).href)
        ) {
          element.remove();
        }
      }
    );

    // 添加新的 <script> 和 <link> 标签
    newDependencies.forEach((dep) => {
      this.addTag(
        scriptContainer,
        dep,
        toAddScripts,
        this.scriptSrcBuilder,
        "script",
        "src"
      );
      this.addTag(
        scriptContainer,
        dep,
        toAddLinks,
        this.linkHrefBuilder,
        "link",
        "href"
      );
    });
  }

  private addTag(
    container: HTMLElement,
    dep: DependencyDetail,
    toAdd: string[],
    srcBuilder: (dep: DependencyDetail) => string,
    tagName: "script" | "link",
    srcAttr: "src" | "href"
  ) {
    const src = srcBuilder(dep);

    if (toAdd.includes(src)) {
      const tag = this.document.createElement(tagName) as
        | HTMLScriptElement
        | HTMLLinkElement;

      if (tagName === "script" && srcAttr === "src") {
        (tag as HTMLScriptElement).src = src;
      } else if (tagName === "link" && srcAttr === "href") {
        (tag as HTMLLinkElement).href = src;
        (tag as HTMLLinkElement).rel = "stylesheet";
      }

      let inserted = false;

      // 查找正确的插入点
      const tags = Array.from(container.querySelectorAll(tagName)) as (
        | HTMLScriptElement
        | HTMLLinkElement
      )[];
      for (let i = 0; i < tags.length; i++) {
        const nextTag = tags[i];
        const nextSrc =
          tagName === "script"
            ? (nextTag as HTMLScriptElement).src
            : (nextTag as HTMLLinkElement).href;

        if (toAdd.indexOf(nextSrc) > toAdd.indexOf(src)) {
          container.insertBefore(tag, tags[i]);
          inserted = true;
          break;
        }
      }

      // 如果没有找到适当的位置，则添加到最后
      if (!inserted) {
        container.appendChild(tag);
      }
    }
  }
}

export { HTMLDependencyManager };
