import { WupFolderName } from "@/src/constants";
import { DemosManager } from "@/src/managers/getDemosManager";
import { PathManager } from "@/src/managers/getPathManager";
import { genAssert } from "@/src/utils/rollup-plugins/genAssert";
import path from "path";
import { Plugin } from "rollup";
import { htmlRender } from "widget-up-utils";

export const genDemoIndexHtml = ({
  pathManager,
  demosManager,
}: {
  pathManager: PathManager;
  demosManager: DemosManager;
}): Plugin => {
  return {
    name: "gen-demo-index-html",
    options(options) {
      const genIndexTplPlg = genAssert({
        src: path.join(pathManager.tplsPath, "index.html.ejs"),
        dest: WupFolderName,
      });

      const htmlPlugin = htmlRender({
        dest: "dist/server",
        src: path.join(WupFolderName, "index.html.ejs"),
        data: {
          menus: [],
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
