import {
  HTMLDependencyJSON,
  NormalizedDependenciesUMDConfig,
  PeerDependenciesTree,
} from "@/types";

// 定义转换函数
export function convertPeerDependenciesTreeToHTMLDependencyJSONs(options: {
  getServerScriptFileName: (name: string, version: string) => string;
  getServerStyleFileName: (name: string, version: string) => string;
  peerDependenciesTree: PeerDependenciesTree;
  serverLibsUrl: string;
  dependenciesUMDConfig: NormalizedDependenciesUMDConfig;
}): HTMLDependencyJSON[] {
  const {
    serverLibsUrl,
    peerDependenciesTree,
    getServerScriptFileName,
    getServerStyleFileName,
    dependenciesUMDConfig,
  } = options;
  return Object.values(peerDependenciesTree).map((node) => {
    const { name, version, peerDependencies, packageConfig } = node;

    const hasStyle =
      !!dependenciesUMDConfig[node.name]?.style ||
      !!node.moduleEntries.moduleStyleEntryAbsPath;

    return {
      name,
      version: version.exact,
      scriptSrc: `(dep) => \`${serverLibsUrl}/${getServerScriptFileName(
        name,
        version.exact
      )}\``, // 根据需求填充此字段
      linkHref: `() => ${
        hasStyle
          ? `${serverLibsUrl}/${getServerStyleFileName(name, version.exact)}`
          : ""
      }`, // 根据需求填充此字段
      depends: peerDependencies
        ? convertPeerDependenciesTreeToHTMLDependencyJSONs({
            ...options,
            peerDependenciesTree: peerDependencies,
          })
        : [],
    };
  });
}
