import { convertPathToVariableName } from "@/src/managers/getDemosManager/convertPathToVariableName";
import { PathManager } from "@/src/managers/getPathManager";
import { DemoData } from "@/types";
import path from "path";
import { NormalizedUMDConfig, PackageJson } from "widget-up-utils";

export const getGlobalNameWithDemo = (
  data: DemoData,
  umdConfig: NormalizedUMDConfig,
  demosPath: string,
): string => {
  return `${umdConfig.name}_${convertPathToVariableName(
    path.relative(demosPath, data.path)
  )}`;
};
