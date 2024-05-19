import { WupFolderName } from "@/src/constants";
import { DemosManager } from "@/src/managers/demosManager";
import { PathManager } from "@/src/managers/pathManager";
import { genAssert } from "@/src/utils/rollupPlugins/genAssert";
import path from "path";
import { Plugin } from "rollup";
import { htmlRender } from "widget-up-utils";
import { ConfigManager } from "@/src/managers/configManager";

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
        src: path.join(pathManager.tplsAbsPath, "index.html.ejs"),
        dest: WupFolderName,
      });

      const config = configManager.getConfig();

      const htmlPlugin = htmlRender({
        dest: pathManager.distServerRelativePath,
        src: path.join(WupFolderName, "index.html.ejs"),
        data: {
          includeCSS: !!config.css,
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
