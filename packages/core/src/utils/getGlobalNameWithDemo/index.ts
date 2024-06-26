import { convertPathToVariableName } from "@/src/utils/convertPathToVariableName";
import { DemoFileData } from "@/types";
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
  demoData: DemoFileData,
  umdConfig: NormalizedUMDConfig,
  demoAbsPath: string
): string => {
  return `${umdConfig.name}_${convertPathToVariableName(
    path.relative(demoAbsPath, demoData.path)
  )}`;
};
