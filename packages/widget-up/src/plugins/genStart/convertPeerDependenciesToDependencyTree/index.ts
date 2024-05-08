import { PeerDependenciesTree } from "@/src/utils/getPeerDependTree";
import { DependencyTreeNodeJson } from "@/types";

export function convertPeerDependenciesToDependencyTree(
  peers: PeerDependenciesTree,
  parentNode?: DependencyTreeNodeJson
): DependencyTreeNodeJson[] {
  let result: DependencyTreeNodeJson[] = [];

  Object.keys(peers).forEach((packageName) => {
    const { version, peerDependencies } = peers[packageName];
    const node: DependencyTreeNodeJson = {
      name: packageName,
      version: version.exact,
      scriptSrc: `dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}/index.js\``,
      linkHref: `dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}/index.css\``,
      depends: peerDependencies
        ? convertPeerDependenciesToDependencyTree(peerDependencies)
        : undefined,
    };
    result.push(node);
  });

  return result;
}
