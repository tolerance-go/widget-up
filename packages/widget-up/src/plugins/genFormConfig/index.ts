import { configManager } from "@/src/managers/getConfigManager";
import { identifierManager } from "@/src/managers/identifierManager";
import { PathManager } from "@/src/managers/pathManager";
import { genAssert } from "@/src/utils/rollupPlugins/genAssert";
import { Plugin } from "rollup";

export const genFormConfig = (): Plugin => {
  const pathManager = PathManager.getInstance();

  return {
    name: "genFormConfig",
    options(options) {
      const config = configManager.getFormConfig();
      const plg = genAssert({
        dest: pathManager.distServerAssetsAbsPath,
        file: {
          name: identifierManager.formSchemaAssetFileName,
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
