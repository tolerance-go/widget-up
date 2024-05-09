import { ConfigManager } from "@/src/managers/getConfigManager";
import { DemosManager } from "@/src/managers/getDemosManager";
import { PathManager } from "@/src/managers/getPathManager";
import { genAssert } from "@/src/utils/rollup-plugins/genAssert";
import { Plugin } from "rollup";
import { convertDemoDataToMenu } from "./convertDemoDataToMenu";

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
        configManager.getConfig().umd,
        pathManager
      );

      const plg = genAssert({
        dest: pathManager.serverPath,
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
