import { ConfigManager } from "@/src/managers/configManager";
import { PathManager } from "@/src/managers/pathManager";
import { genAssert } from "@/src/utils/rollupPlugins/genAssert";
import { Plugin } from "rollup";

export const genConfig = (): Plugin => {
  return {
    name: "genConfig",
    options(options) {
      const pathManager = PathManager.getInstance();
      const configManager = ConfigManager.getInstance();
      const config = configManager.getBuildConfig();
      const plg = genAssert({
        dest: pathManager.distServerAssetsAbsPath,
        file: {
          name: "config.json",
          content: JSON.stringify(config, null, 2),
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
