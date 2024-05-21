import { VALID_FRAMEWORK_PACKAGES } from "../datas/constants";

export const getConnectorModuleBaseName = (name: string) => {
  // 合法的名称集合
  const validNames = new Set(VALID_FRAMEWORK_PACKAGES);

  if (!validNames.has(name)) {
    throw new Error(`Invalid name`);
  }

  return `widget-up-connector-${name}`;
};
