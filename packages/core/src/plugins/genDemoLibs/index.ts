import { ConfigManager } from "@/src/managers/configManager";
import { DemoManager } from "@/src/managers/demoManager";
import { coreLogger } from "@/src/utils/logger";
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
  demosManager: DemoManager;
  configManager: ConfigManager;
  devBuildPlugins: InputPluginOption[];
}): Plugin => {
  return {
    name: "gen-demo-libs",
    options(options) {
      const demoDatas = demosManager.getDemos();
      const demoInputList = getDemoInputList(demoDatas ?? []);
      coreLogger.info("demoInputList: ", demoInputList);

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
