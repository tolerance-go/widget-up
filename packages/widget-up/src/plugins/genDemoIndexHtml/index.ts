import { WupFolderName } from "@/src/constants";
import { DemosManager } from "@/src/managers/getDemosManager";
import { PathManager } from "@/src/managers/getPathManager";
import { genAssert } from "@/src/utils/rollup-plugins/genAssert";
import path from "path";
import { Plugin } from "rollup";
import { htmlRender } from "widget-up-utils";
import { convertDemoDataToMenu } from "./convertDemoDataToMenu";
import { ConfigManager } from "@/src/managers/getConfigManager";

export const genDemoIndexHtml = ({
  pathManager,
  demosManager,
  configManager,
}: {
  pathManager: PathManager;
  demosManager: DemosManager;
  configManager: ConfigManager;
}): Plugin => {
  return {
    name: "gen-demo-index-html",
    options(options) {
      const genIndexTplPlg = genAssert({
        src: path.join(pathManager.tplsPath, "index.html.ejs"),
        dest: WupFolderName,
      });

      const menus = convertDemoDataToMenu(
        demosManager.getDemoDatas(),
        configManager.getPackageConfig()
      );

      const htmlPlugin = htmlRender({
        dest: "dist/server",
        src: path.join(WupFolderName, "index.html.ejs"),
        data: {
          menus,
        },
      });

      if (Array.isArray(options.plugins)) {
        options.plugins.push(genIndexTplPlg, htmlPlugin);
      } else {
        options.plugins = [options.plugins, genIndexTplPlg, htmlPlugin];
      }
    },
  };
};
