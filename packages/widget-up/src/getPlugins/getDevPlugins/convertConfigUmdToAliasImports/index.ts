import {
  ParedUMDConfig,
  UMDAliasOptions,
  semverToIdentifier,
} from "widget-up-utils";
import { resolveNpmInfo } from "../../../utils/resolveNpmInfo";

export const convertConfigUmdToAliasImports = ({
  umdConfig,
}: {
  umdConfig: ParedUMDConfig;
}) => {
  const imports: UMDAliasOptions["imports"] = [];

  // 处理每个外部库配置
  umdConfig.external.forEach((libName) => {
    const globalVar = umdConfig.globals[libName]; // 获取全局变量名称
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
