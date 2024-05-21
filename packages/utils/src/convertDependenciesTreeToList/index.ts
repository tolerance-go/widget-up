import {
  PeerDependenciesTree,
  PeerDependenciesNode,
} from "../getPeerDependTree";

/**
 * 将依赖树转换为叶子节点的数据列表。
 *
 * @param {PeerDependenciesTree} tree - 依赖树。
 * @returns {PeerDependenciesNode[]} - 叶子节点的数据列表。
 */
export function convertDependenciesTreeToList(
  tree: PeerDependenciesTree
): PeerDependenciesNode[] {
  // 用于跟踪已收集的节点
  const collectedNodes = new Set<string>();

  // 递归函数来收集叶子节点
  const collectLeafNodes = (
    node: PeerDependenciesTree,
    list: PeerDependenciesNode[]
  ) => {
    Object.keys(node).forEach((key) => {
      const child = node[key];
      const uniqueKey = `${child.name}@${child.version.exact}`;

      if (
        child.peerDependencies &&
        Object.keys(child.peerDependencies).length > 0
      ) {
        // 如果有子依赖，继续递归
        collectLeafNodes(child.peerDependencies, list);
      } else {
        // 没有子依赖，是叶子节点，收集信息
        if (!collectedNodes.has(uniqueKey)) {
          list.push({
            version: child.version,
            name: child.name,
            package: child.package,
          });
          collectedNodes.add(uniqueKey);
        }
      }
    });
  };

  const list: PeerDependenciesNode[] = [];
  collectLeafNodes(tree, list);
  return list;
}
