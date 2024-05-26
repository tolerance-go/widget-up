import { DependencyTreeNodeJSON, PackageConfig } from "@/types";
import { convertFrameworkModuleNameToConnectorModuleName } from "../convertFrameworkModuleNameToConnectorModuleName";

export const convertConnectorModuleToDependencyTreeNodeJSON = (
  config: PackageConfig,
  serverConnectorsUrl: string,
  scriptFileName: string
): DependencyTreeNodeJSON => {
  return {
    name: convertFrameworkModuleNameToConnectorModuleName(
      config.name,
      config.version
    ),
    version: config.version,
    scriptSrc: `() => "${serverConnectorsUrl}/${scriptFileName}"`,
    linkHref: `() => ''`,
    depends: [],
  };
};
