import { convertPathToVariableName } from "@/src/managers/getDemosManager/convertPathToVariableName";
import { DemoData } from "@/types";
import { NormalizedUMDConfig, PackageJson } from "widget-up-utils";

export const getGlobalNameWithDemo = (
  data: DemoData,
  umdConfig: NormalizedUMDConfig
): string => {
  return `${umdConfig.name}_${convertPathToVariableName(data.path)}`;
};
