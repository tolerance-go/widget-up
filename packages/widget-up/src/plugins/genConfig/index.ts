import { ConfigManager } from "@/src/managers/getConfigManager";
import { DemosManager } from "@/src/managers/getDemosManager";
import { PathManager } from "@/src/managers/pathManager";
import { genAssert } from "@/src/utils/rollup-plugins/genAssert";
import { Plugin } from "rollup";
import { PackageJson } from "widget-up-utils";

export const genConfig = ({
  configManager,
  pathManager,
}: {
  configManager: ConfigManager;
  pathManager: PathManager;
}): Plugin => {
  return {
    name: "genConfig",
    options(options) {
      const plg = genAssert({
        dest: pathManager.distServerAssetsAbsPath,
        file: {
          name: "config.json",
          content: JSON.stringify(configManager.getConfig(), null, 2),
        },
      });

      if (Array.isArray(options.plugins)) {
        options.plugins.push(plg);
      } else {
        options.plugins = [options.plugins, plg];
      }
    },
  };
};
