import { ConfigManager } from "@/src/managers/configManager";
import { DemosManager } from "@/src/managers/demoManager";
import { genAssert } from "@/src/utils/rollupPlugins/genAssert";
import { Plugin } from "rollup";
import { convertDemoDataToMenu } from "./convertDemoDataToMenu";
import { PathManager } from "@/src/managers/pathManager";

export const genMenus = ({
  pathManager,
  demosManager,
  configManager,
}: {
  pathManager: PathManager;
  demosManager: DemosManager;
  configManager: ConfigManager;
}): Plugin => {
  return {
    name: "gen-menus",
    options(options) {
      const menus = convertDemoDataToMenu(
        demosManager.getDemoDatas(),
        configManager.getModuleUMDConfig(),
        configManager.getPackageConfig(),
        pathManager
      );

      const plg = genAssert({
        dest: pathManager.distServerAssetsAbsPath,
        file: {
          name: "menus.json",
          content: JSON.stringify(menus, null, 2),
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
