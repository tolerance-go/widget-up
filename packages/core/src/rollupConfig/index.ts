import { RollupOptions } from "rollup";
import { ConfigManager } from "../managers/configManager";
import { DemoManager } from "../managers/demoManager";
import { PathManager } from "../managers/pathManager";
import { PeerDependTreeManager } from "../managers/peerDependTreeManager";
import { GenServerConnectorsOptions } from "../plugins/genServerConnectorAssets";
import { ServerLibsPluginOptions } from "../plugins/genServerLibsAssets";
import { GenStartPlgOptions } from "../plugins/genStart";
import { getEnv } from "../utils/env";
import { coreLogger } from "../utils/logger";
import { getDemoRollupOptions } from "./getDemoRollupOptions";
import { getBuildPlugins, getDevPlugins } from "./getPlugins";
import { getCoreDevBuildPlugins } from "./getPlugins/getCoreDevBuildPlugins";
import { getProdOutputs } from "./getProdOutputs";

export default async ({
  processStartParams,
  getExtraPeerDependenciesTree: extraPeerDependenciesTree,
  additionalFrameworkModules,
}: GenStartPlgOptions &
  ServerLibsPluginOptions &
  GenServerConnectorsOptions) => {
  const { BuildEnvIsDev, BuildEnv } = getEnv();

  coreLogger.log("extraPeerDependenciesTree", extraPeerDependenciesTree);

  const pathManager = PathManager.getInstance();
  const configManager = ConfigManager.getInstance();

  coreLogger.log(`${"=".repeat(10)} ${BuildEnv} ${"=".repeat(10)}`);

  const config = configManager.getConfig();
  const umdConfig = configManager.getMainModuleUMDConfig();

  let rollupConfig: RollupOptions[] | RollupOptions = [];

  if (BuildEnvIsDev) {
    const coreDevBuildPlugins = getCoreDevBuildPlugins();

    rollupConfig = [
      {
        input: config.input,
        output: {
          file: "dist/umd/index.js",
          format: "umd",
          name: umdConfig.name,
          globals: umdConfig.globals,
          // sourcemap: BuildEnvIsDev ? "inline" : false,
        },
        plugins: getDevPlugins({
          processStartParams,
          getExtraPeerDependenciesTree: extraPeerDependenciesTree,
          additionalFrameworkModules,
          coreDevBuildPlugins,
        }),
        watch: {
          include: ["src/**", "styles/**"],
        },
      },
      ...getDemoRollupOptions({
        devBuildPlugins: coreDevBuildPlugins,
      }),
    ];
  } else {
    coreLogger.log("BuildEnvIsProd is true, start to build production code");

    rollupConfig = getProdOutputs().map((output) => ({
      input: config.input,
      output,
      plugins: [
        ...getBuildPlugins({
          rootPath: pathManager.modulePath,
          config,
          output,
        }),
        {
          name: "hook-end",
          buildEnd: () => {
            console.log("buildEnd");
            ConfigManager.dispose();
            PeerDependTreeManager.dispose();
            DemoManager.dispose();
          },
        },
      ],
    }));
  }

  return rollupConfig;
};
