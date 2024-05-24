import { DependencyTreeNodeJSON, PackageConfig } from "@/types";
import { getConnectorModuleName } from "../getConnectorModuleName";

export const convertConnectorModuleToDependencyTreeNode = (
  config: PackageConfig,
  serverConnectorsUrl: string,
  scriptFileName: string
): DependencyTreeNodeJSON => {
  return {
    name: getConnectorModuleName(config.name, config.version),
    version: config.version,
    scriptSrc: `() => "${serverConnectorsUrl}/${scriptFileName}"`,
    linkHref: `() => ''`,
    depends: [],
  };
};
