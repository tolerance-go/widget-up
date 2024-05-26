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
  dependenciesUMDConfig: NormalizedDependenciesUMDConfig
) => {
  ensure(
    UMD_NAME_PLACEHOLDER in dependenciesUMDConfig,
    `${UMD_NAME_PLACEHOLDER} 不存在于配置中`
  );

  return dependenciesUMDConfig[UMD_NAME_PLACEHOLDER];
};
