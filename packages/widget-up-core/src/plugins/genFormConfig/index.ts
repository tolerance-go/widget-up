import { ConfigManager } from "@/src/managers/configManager";
import { IdentifierManager } from "@/src/managers/identifierManager";
import { PathManager } from "@/src/managers/pathManager";
import { genAssert } from "@/src/utils/rollupPlugins/genAssert";
import { Plugin } from "rollup";

export const genFormConfig = (): Plugin => {
  const pathManager = PathManager.getInstance();
  const identifierManager = IdentifierManager.getInstance();

  return {
    name: "genFormConfig",
    options(options) {
      const configManager = ConfigManager.getInstance();
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
