import { VALID_FRAMEWORK_PACKAGES } from "../datas/constants";
import { getMajorVersion } from "../getMajorVersion";

export const convertFrameworkModuleNameToConnectorModuleName = (
  name: string,
  version: string
) => {
  if (VALID_FRAMEWORK_PACKAGES.includes(name) === false) {
    throw new Error("非法框架名称");
  }

  return `widget-up-connector-${name}${getMajorVersion(version)}`;
};
