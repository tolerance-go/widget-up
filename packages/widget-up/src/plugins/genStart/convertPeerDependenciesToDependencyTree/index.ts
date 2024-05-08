import { PeerDependenciesTree } from "@/src/utils/getPeerDependTree";
import { DependencyTreeNode } from "widget-up-runtime";
import { DependencyListItem, semverToIdentifier } from "widget-up-utils";

export function convertPeerDependenciesToDependencyTree(
  peers: PeerDependenciesTree,
  parentNode?: DependencyTreeNode
): DependencyTreeNode[] {
  let result: DependencyTreeNode[] = [];

  Object.keys(peers).forEach((packageName) => {
    const { version, peerDependencies } = peers[packageName];
    const node: DependencyTreeNode = {
      name: packageName,
      version: version.exact,
      scriptSrc: (dep: DependencyListItem) =>
        `/libs/${dep.name}_${semverToIdentifier(dep.version.exact)}/index.js`,
      linkHref: (dep: DependencyListItem) =>
        `/libs/${dep.name}_${semverToIdentifier(dep.version.exact)}/index.css`,
      depends: peerDependencies
        ? convertPeerDependenciesToDependencyTree(peerDependencies)
        : undefined,
    };
    result.push(node);
  });

  return result;
}
