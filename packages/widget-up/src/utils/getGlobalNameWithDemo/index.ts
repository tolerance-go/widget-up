import { convertPathToVariableName } from "@/src/managers/getDemosManager/convertPathToVariableName";
import { DemoData } from "@/types";
import path from "path";
import { NormalizedUMDConfig } from "widget-up-utils";

/**
 * 获取 demo 的组件的全局变量名
 *
 * @param demoData
 * @param umdConfig
 * @param demoAbsPath
 * @returns
 */
export const getGlobalNameWithDemo = (
  demoData: DemoData,
  umdConfig: NormalizedUMDConfig,
  demoAbsPath: string
): string => {
  return `${umdConfig.name}_${convertPathToVariableName(
    path.relative(demoAbsPath, demoData.path)
  )}`;
};
