import { PeerDependenciesTree, PeerDependenciesNode } from "@/types";

/**
 * 将依赖树转换为所有节点的数据列表。
 *
 * @param {PeerDependenciesTree} tree - 依赖树。
 * @returns {PeerDependenciesNode[]} - 所有节点的数据列表。
 */
export function convertDependenciesTreeToList(
  tree: PeerDependenciesTree
): PeerDependenciesNode[] {
  // 用于跟踪已收集的节点
  const collectedNodes = new Set<string>();

  // 递归函数来收集所有节点
  const collectNodes = (
    node: PeerDependenciesTree,
    list: PeerDependenciesNode[]
  ) => {
    Object.keys(node).forEach((key) => {
      const child = node[key];
      const uniqueKey = `${child.name}@${child.version.exact}`;

      if (!collectedNodes.has(uniqueKey)) {
        list.push({
          ...child,
        });
        collectedNodes.add(uniqueKey);
      }

      if (
        child.peerDependencies &&
        Object.keys(child.peerDependencies).length > 0
      ) {
        // 如果有子依赖，继续递归
        collectNodes(child.peerDependencies, list);
      }
    });
  };

  const list: PeerDependenciesNode[] = [];
  collectNodes(tree, list);
  return list;
}
