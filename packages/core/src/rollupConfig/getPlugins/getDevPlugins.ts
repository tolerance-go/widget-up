import { genDemoIndexHtml } from "@/src/plugins/genDemoIndexHtml";
import { genMenus } from "@/src/plugins/genMenus";
import { genRuntimeLib } from "@/src/plugins/genRuntimeLib";
import {
  GenServerConnectorsOptions,
  genServerConnectorAssets,
} from "@/src/plugins/genServerConnectorAssets";
import { InputPluginOption } from "rollup";
import {
  deleteDist,
  serveLivereload,
  tsDeclarationAlias,
} from "widget-up-utils";
import { WupFolderName } from "../../constants";
import { ConfigManager } from "../../managers/configManager";
import { DemoManager } from "../../managers/demoManager";
import { PathManager } from "../../managers/pathManager";
import { genFormConfig } from "../../plugins/genFormConfig";
import { genPackageConfig } from "../../plugins/genPackageConfig";
import { genServerConfigAssets } from "../../plugins/genServerConfigAssets";
import genServerLibs, {
  ServerLibsPluginOptions,
} from "../../plugins/genServerLibsAssets";
import { GenStartPlgOptions, genStart } from "../../plugins/genStart";
import wrapMainOutput from "../../plugins/wrapMainOutput";

export const getDevPlugins = async ({
  processStartParams,
  getExtraPeerDependenciesTree: extraPeerDependenciesTree,
  additionalFrameworkModules,
  coreDevBuildPlugins,
}: {
  coreDevBuildPlugins: InputPluginOption[];
} & GenStartPlgOptions &
  ServerLibsPluginOptions &
  GenServerConnectorsOptions): Promise<InputPluginOption[]> => {
  const pathManager = PathManager.getInstance();
  const demoManager = DemoManager.getInstance();
  const configManager = ConfigManager.getInstance();
  const packageConfig = configManager.getPackageConfig();

  const devBuildPlugins: InputPluginOption[] = [
    ...coreDevBuildPlugins,
    tsDeclarationAlias(),
  ];

  const plugins: InputPluginOption[] = [
    deleteDist({
      dist: ["dist", WupFolderName],
      once: true,
    }),
    ...devBuildPlugins,
    wrapMainOutput({
      pathManager,
      configManager,
    }),
    genServerLibs({
      getExtraPeerDependenciesTree: extraPeerDependenciesTree,
    }),
    genRuntimeLib(),
    genServerConnectorAssets({
      additionalFrameworkModules,
    }),
    genStart({
      processStartParams,
    }),
    genDemoIndexHtml({
      pathManager,
      demosManager: demoManager,
      configManager,
    }),
    genMenus({
      pathManager,
      demosManager: demoManager,
      configManager,
    }),
    genPackageConfig({
      packageConfig,
      pathManager,
    }),
    genServerConfigAssets(),
    genFormConfig(),
    serveLivereload({
      contentBase: ["dist/server", "dist/umd"],
      port: 3000,
    }),
  ];

  return plugins;
};
