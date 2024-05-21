import { PathManager as CorePathManager } from "widget-up-core";
import {
  DependencyTreeNodeJSON,
  PeerDependenciesNode,
  PeerDependenciesTree,
} from "widget-up-utils";

function convertNode(node: PeerDependenciesNode): DependencyTreeNodeJSON {
  const { name, version, peerDependencies, packageConfig } = node;
  const corePathManager = CorePathManager.getInstance();

  return {
    name,
    version: version.exact,
    scriptSrc: `(dep) => \`${
      corePathManager.serverLibsUrl
    }/${corePathManager.getServerScriptFileName(name, version.exact)}\``, // 根据需求填充此字段
    linkHref: "() => ''", // 根据需求填充此字段
    depends: peerDependencies
      ? convertPeerDependenciesTreeToTagTree(peerDependencies)
      : [],
  };
}

// 定义转换函数
export function convertPeerDependenciesTreeToTagTree(
  peerDependenciesTree: PeerDependenciesTree
): DependencyTreeNodeJSON[] {
  return Object.values(peerDependenciesTree).map(convertNode);
}
