import {
  NormalizedUMDConfig,
  UMDAliasOptions,
  semverToIdentifier,
} from "widget-up-utils";
import { resolveNpmInfo } from "../resolveNpmInfo";

export const convertConfigUmdToAliasImports = ({
  external,
  globals,
}: {
  external: NormalizedUMDConfig["external"];
  globals: NormalizedUMDConfig["globals"];
}) => {
  const imports: UMDAliasOptions["imports"] = [];

  // 处理每个外部库配置
  external.forEach((libName) => {
    const globalVar = globals[libName]; // 获取全局变量名称
    if (!globalVar) {
      throw new Error(`Global variable not found for ${libName}`);
    }

    const libData = resolveNpmInfo({ name: libName });

    imports.push({
      globalVar: `${globalVar}_${semverToIdentifier(
        libData.packageJson.version
      )}`,
      scopeVar: globalVar,
    });
  });

  return imports;
};
