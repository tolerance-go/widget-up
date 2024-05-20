import { ConfigManager } from "@/src/managers/configManager";
import { DemosManager } from "@/src/managers/demoManager";
import { logger } from "@/src/utils/logger";
import { InputPluginOption, Plugin } from "rollup";
import { getDemoInputList } from "./getDemoInputList";
import { getDemoRuntimePlgs } from "./getDemoRuntimePlgs";
import { PathManager } from "@/src/managers/pathManager";

export const genDemoLibs = ({
  pathManager,
  demosManager,
  configManager,
  devBuildPlugins,
}: {
  pathManager: PathManager;
  demosManager: DemosManager;
  configManager: ConfigManager;
  devBuildPlugins: InputPluginOption[];
}): Plugin => {
  return {
    name: "gen-demo-libs",
    options(options) {
      const demoDatas = demosManager.getDemoDatas();
      const demoInputList = getDemoInputList(demoDatas ?? []);
      logger.info("demoInputList: ", demoInputList);

      const runtimeRollupPlgs = getDemoRuntimePlgs({
        pathManager,
        configManager,
        demoInputList,
        devBuildPlugins,
      });

      if (Array.isArray(options.plugins)) {
        options.plugins.push(...runtimeRollupPlgs);
      } else {
        options.plugins = [options.plugins, ...runtimeRollupPlgs];
      }
    },
  };
};
