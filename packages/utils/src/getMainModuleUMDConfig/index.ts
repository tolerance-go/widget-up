import { NormalizedDependenciesUMDConfig } from "@/types";
import { UMD_NAME_PLACEHOLDER } from "../datas/constants";
import { ensure } from "../ensure";

/**
 * 获取主模块的 umd 配置
 *
 * @param dependenciesUMDConfig
 * @returns
 */
export const getMainModuleUMDConfig = (
  dependenciesUMDConfig: NormalizedDependenciesUMDConfig,
  modeName: string
) => {
  ensure(
    modeName in dependenciesUMDConfig,
    `${modeName} 不存在于配置中`,
    "info:",
    {
      modeName,
      dependenciesUMDConfig,
    }
  );

  return dependenciesUMDConfig[UMD_NAME_PLACEHOLDER];
};
