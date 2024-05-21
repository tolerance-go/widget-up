export const getConnectorModuleBaseName = (name: string) => {
  // 合法的名称集合
  const validNames = new Set(["react", "jquery", "vue"]);

  if (!validNames.has(name)) {
    throw new Error(`Invalid name`);
  }

  return `widget-up-connector-${name}`;
};
