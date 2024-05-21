import { getMajorVersion } from "widget-up-utils";

export const getConnectorGlobalName = (name: string, version: string) => {
  return `Connector_${name}${getMajorVersion(version)}`;
};
