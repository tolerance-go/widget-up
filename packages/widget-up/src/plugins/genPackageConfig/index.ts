import { PathManager } from "@/src/managers/pathManager";
import { genAssert } from "@/src/utils/rollup-plugins/genAssert";
import { Plugin } from "rollup";
import { PackageJson } from "widget-up-utils";

export const genPackageConfig = ({
  packageConfig,
  pathManager,
}: {
  packageConfig: PackageJson;
  pathManager: PathManager;
}): Plugin => {
  return {
    name: "gen-package-config",
    options(options) {
      const plg = genAssert({
        dest: pathManager.distServerAssetsAbsPath,
        file: {
          name: "package.json",
          content: JSON.stringify(packageConfig, null, 2),
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
