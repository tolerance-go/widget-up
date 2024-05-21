import { PeerDependenciesNode } from "widget-up-utils";

export function filterDuplicateKeys(
  nodes: PeerDependenciesNode[]
): PeerDependenciesNode[] {
  const seen = new Set<string>();
  const result: PeerDependenciesNode[] = [];

  for (const node of nodes) {
    const uniqueKey = `${node.name}@${node.version.exact}`;
    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      result.push(node);
    }
  }

  return result;
}
