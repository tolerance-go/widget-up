import { getConnectorModuleBaseName } from "../getConnectorModuleBaseName";
import { getMajorVersion } from "../getMajorVersion";

export const getConnectorModuleName = (
  name: string,
  version: string
): string => {
  return `${getConnectorModuleBaseName(name)}${getMajorVersion(version)}`;
};
