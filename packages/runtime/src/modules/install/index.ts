import {
  HTMLDependencyListItem,
  HTMLDependency,
  HTMLDependencyManager,
} from "widget-up-utils";
import { installLogger } from "./logger";
import { globalEventBus } from "@/src/modules/events";

// 实现`install`方法
export async function install(
  dependencies: HTMLDependency[],
  document: Document
) {
  installLogger.log("开始安装依赖", dependencies);
  const fetchVersionList = async (
    dependencyName: string
  ): Promise<string[]> => {
    const baseUrl = "https://registry.npmmirror.com";
    const response = await fetch(`${baseUrl}/${dependencyName}`, {});
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return Object.keys(data.versions);
  };

  // 创建一个映射来存储scriptSrc和linkHref
  const srcMap = new Map<
    string,
    {
      scriptSrc?: (dep: HTMLDependencyListItem) => string;
      linkHref?: (dep: HTMLDependencyListItem) => string;
    }
  >();

  const fillSrcMap = (node: HTMLDependency) => {
    const key = `${node.name}@${node.version}`;
    srcMap.set(key, {
      scriptSrc: node.scriptSrc,
      linkHref: node.linkHref,
    });
    if (node.depends) {
      node.depends.forEach(fillSrcMap);
    }
  };

  installLogger.log("填充映射", dependencies);

  // 递归填充映射
  dependencies.forEach(fillSrcMap);

  installLogger.log("填充映射完成", dependencies, srcMap);

  // 实例化HTMLDependencyManager
  const manager = new HTMLDependencyManager({
    eventBus: globalEventBus,
    debug: true,
    fetchVersionList,
    document,
    scriptSrcBuilder: (dep) => {
      const key = `${dep.name}@${dep.version.exact}`;

      installLogger.log("构建scriptSrc", dep, key, srcMap.get(key));

      return srcMap.get(key)?.scriptSrc?.(dep) || "";
    },
    linkHrefBuilder: (dep) => {
      const key = `${dep.name}@${dep.version.exact}`;
      return srcMap.get(key)?.linkHref?.(dep) || "";
    },
  });

  window.__manager = manager;

  // 递归函数用于处理依赖树
  const processDependency = async (node: HTMLDependency) => {
    installLogger.log("处理依赖", node.name, node.version);
    let subDependencies: { [key: string]: string } = {};
    if (node.depends) {
      for (const sub of node.depends) {
        subDependencies[sub.name] = sub.version;
        await processDependency(sub); // 递归处理子依赖
      }
    }
    installLogger.log("添加依赖到管理器", {
      "node.name": node.name,
      "node.version": node.version,
      subDependencies: subDependencies,
    });
    // 添加依赖到管理器
    await manager.addDependency(node.name, node.version, subDependencies);
  };

  // 处理每一个根依赖节点
  for (const rootDependency of dependencies) {
    installLogger.log("处理根依赖", {
      "rootDependency.name": rootDependency.name,
      "rootDependency.version": rootDependency.version,
    });
    await processDependency(rootDependency);
  }
}
