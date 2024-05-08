import { PeerDependenciesTree } from "@/src/utils/getPeerDependTree";
import { DependencyTreeNode } from "widget-up-runtime";

export interface DependencyListItem {
  name: string;
  version: VersionData;
}

export function convertPeerDependenciesToDependencyTree(
  peers: PeerDependenciesTree,
  parentNode?: DependencyTreeNode
): DependencyTreeNode[] {
  let result: DependencyTreeNode[] = [];

  Object.keys(peers).forEach((packageName) => {
    const { version, peerDependencies } = peers[packageName];
    const node: DependencyTreeNode = {
      name: packageName,
      version,
      scriptSrc: (dep: DependencyListItem) =>
        `/libs/${dep.name}_${dep.version}/bundle.js`,
      linkHref: (dep: DependencyListItem) =>
        `/libs/${dep.name}_${dep.version}/styles.css`,
      depends: peerDependencies
        ? convertPeerDependenciesToDependencyTree(peerDependencies)
        : undefined,
    };
    result.push(node);
  });

  return result;
}
