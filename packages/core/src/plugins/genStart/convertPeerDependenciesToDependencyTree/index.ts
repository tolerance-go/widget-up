import {
  HTMLDependencyJSON,
  NormalizedExternalDependencies,
  PeerDependenciesTree,
} from "widget-up-utils";

export function convertPeerDependenciesToDependencyTree(
  peers: PeerDependenciesTree,
  externalDependencies: NormalizedExternalDependencies,
  parentNode?: HTMLDependencyJSON
): HTMLDependencyJSON[] {
  let result: HTMLDependencyJSON[] = [];

  Object.keys(peers).forEach((packageName) => {
    const { version, peerDependencies } = peers[packageName];

    /** 是否存在样式入口 */
    const styleEntry = externalDependencies[packageName]?.style;
    const hasStyle = styleEntry !== undefined;

    const node: HTMLDependencyJSON = {
      name: packageName,
      version: version.exact,
      scriptSrc: `dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.convertSemverVersionToIdentify(dep.version.exact)}.js\``,
      linkHref: hasStyle
        ? `dep => \`/libs/\${dep.name}_\${WidgetUpRuntime.utils.convertSemverVersionToIdentify(dep.version.exact)}/index.css\``
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
