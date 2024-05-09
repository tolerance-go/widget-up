import { convertPathToVariableName } from "@/src/managers/getDemosManager/convertPathToVariableName";
import { DemoData } from "@/types";
import { PackageJson } from "widget-up-utils";

export const getGlobalNameWithDemo = (
  data: DemoData,
  packageConfig: PackageJson
): string => {
  return `${packageConfig.name}_${convertPathToVariableName(data.path)}`;
};
