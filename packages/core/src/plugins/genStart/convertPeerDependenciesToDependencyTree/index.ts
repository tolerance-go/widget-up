import { PeerDependenciesTree } from "@/src/utils/getPeerDependTree";
import { DependencyTreeNodeJSON } from "@/types";
import { NormalizedExternalDependencies } from "widget-up-utils";

export function convertPeerDependenciesToDependencyTree(
  peers: PeerDependenciesTree,
  externalDependencies: NormalizedExternalDependencies,
  parentNode?: DependencyTreeNodeJSON
): DependencyTreeNodeJSON[] {
  let result: DependencyTreeNodeJSON[] = [];

  Object.keys(peers).forEach((packageName) => {
    const { version, peerDependencies } = peers[packageName];

    /** 是否存在样式入口 */
    const styleEntry = externalDependencies[packageName]?.style;
    const hasStyle = styleEntry !== undefined;

    const node: DependencyTreeNodeJSON = {
      name: packageName,
      version: version.exact,
      scriptSrc: `dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}.js\``,
      linkHref: hasStyle
        ? `dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.semverToIdentifier(dep.version.exact)}/index.css\``
        : `() => ''`,
      depends: peerDependencies
        ? convertPeerDependenciesToDependencyTree(
            peerDependencies,
            externalDependencies
          )
        : undefined,
    };
    result.push(node);
  });

  return result;
}
