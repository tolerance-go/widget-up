import { normalizePath } from "@/src/utils/normalizePath";
import { DirectoryStructure } from "@/src/utils/parseDirectoryStructure";
import { DemoFileConfig, DemoFileNormalizedConfig } from "@/types";
import path from "path";
import { PathManager } from "../../getPathManager";

export const normalizeDemoFileConfig = (
  config: DemoFileConfig,
  item: DirectoryStructure,
  pathManager: PathManager
): DemoFileNormalizedConfig => {
  return {
    menuTitle:
      config.menuTitle ||
      normalizePath(path.relative(pathManager.demosPath, item.path)),
  };
};
