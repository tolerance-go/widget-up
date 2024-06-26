import {
  NormalizedUMDConfig,
  UMDAliasOptions,
  convertSemverVersionToIdentify,
  resolveModuleInfo,
} from "widget-up-utils";

export const convertUmdConfigToAliasImports = ({
  external,
  globals,
  importScopeObjectName,
}: {
  external: NormalizedUMDConfig["external"];
  globals: NormalizedUMDConfig["globals"];
  importScopeObjectName: NormalizedUMDConfig["importScopeObjectName"];
}) => {
  const imports: UMDAliasOptions["imports"] = [];

  // 处理每个外部库配置
  external.forEach((libName) => {
    const globalVar = globals[libName]; // 获取全局变量名称
    if (!globalVar) {
      throw new Error(`Global variable not found for ${libName}`);
    }

    const libData = resolveModuleInfo({ name: libName });

    imports.push({
      globalVar: `${globalVar}_${convertSemverVersionToIdentify(
        libData.packageJSON.version
      )}`,
      scopeVar: globalVar,
      scopeName: importScopeObjectName,
    });
  });

  return imports;
};
