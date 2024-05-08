import { DirectoryStructure } from "@/src/utils/parseDirectoryStructure";
import { DemoFileConfig, DemoFileNormalizedConfig } from "@/types";
import { convertPathToVariableName } from "../convertPathToVariableName";

export const normalizeDemoFileConfig = (
  config: DemoFileConfig,
  item: DirectoryStructure
): DemoFileNormalizedConfig => {
  return {
    name: config.name || convertPathToVariableName(item.path),
    globals: {
      component: config.globals?.component || "Component",
      register: config.globals?.register || "register",
    },
  };
};
