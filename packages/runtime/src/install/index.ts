import { HTMLDependencyManager, DependencyDetail } from "widget-up-utils";

// 定义一个类型来表示依赖树的节点
export interface DependencyTreeNode {
  name: string;
  version: string;
  scriptSrc?: (dep: DependencyDetail) => string;
  linkHref?: (dep: DependencyDetail) => string;
  depends?: DependencyTreeNode[];
}

// 实现`install`方法
export async function install(
  dependencies: DependencyTreeNode[],
  document: Document
) {
  const fetchVersionList = async (
    dependencyName: string
  ): Promise<string[]> => {
    const response = await fetch(
      `https://registry.npm.taobao.org/${dependencyName}`
    );
    const data = await response.json();
    return Object.keys(data.versions);
  };

  // 创建一个映射来存储scriptSrc和linkHref
  const srcMap = new Map<
    string,
    {
      scriptSrc?: (dep: DependencyDetail) => string;
      linkHref?: (dep: DependencyDetail) => string;
    }
  >();

  const fillSrcMap = (node: DependencyTreeNode) => {
    const key = `${node.name}@${node.version}`;
    srcMap.set(key, {
      scriptSrc: node.scriptSrc,
      linkHref: node.linkHref,
    });
    if (node.depends) {
      node.depends.forEach(fillSrcMap);
    }
  };

  // 递归填充映射
  dependencies.forEach(fillSrcMap);

  // 实例化HTMLDependencyManager
  const manager = new HTMLDependencyManager({
    fetchVersionList,
    document,
    scriptSrcBuilder: (dep: DependencyDetail) => {
      const key = `${dep.name}@${dep.versionRange}`;
      return srcMap.get(key)?.scriptSrc?.(dep) || "";
    },
    linkHrefBuilder: (dep: DependencyDetail) => {
      const key = `${dep.name}@${dep.versionRange}`;
      return srcMap.get(key)?.linkHref?.(dep) || "";
    },
  });

  // 递归函数用于处理依赖树
  const processDependency = async (node: DependencyTreeNode) => {
    let subDependencies: { [key: string]: string } = {};
    if (node.depends) {
      for (const sub of node.depends) {
        subDependencies[sub.name] = sub.version;
        await processDependency(sub); // 递归处理子依赖
      }
    }
    // 添加依赖到管理器
    await manager.addDependency(node.name, node.version, subDependencies);
  };

  // 处理每一个根依赖节点
  for (const rootDependency of dependencies) {
    await processDependency(rootDependency);
  }
}
