import { RollupOptions } from "rollup";
import { ConfigManager } from "../managers/configManager";
import { DemosManager } from "../managers/demoManager";
import { PathManager } from "../managers/pathManager";
import { PeerDependTreeManager } from "../managers/peerDependTreeManager";
import { GenServerConnectorsOptions } from "../plugins/genServerConnectorAssets";
import { ServerLibsPluginOptions } from "../plugins/genServerLibsAssets";
import { GenStartPlgOptions } from "../plugins/genStart";
import { getEnv } from "../utils/env";
import { coreLogger } from "../utils/logger";
import { getBuildPlugins, getDevPlugins } from "./getPlugins";
import { getProdOutputs } from "./getProdOutputs";
import { UMDSchemaConfig, UMD_NAME_PLACEHOLDER, ensure } from "widget-up-utils";

export default async ({
  processStartParams,
  extraPeerDependenciesTree,
  additionalFrameworkModules,
}: GenStartPlgOptions &
  ServerLibsPluginOptions &
  GenServerConnectorsOptions) => {
  const { BuildEnvIsDev, BuildEnv } = getEnv();

  coreLogger.log("extraPeerDependenciesTree", extraPeerDependenciesTree);

  const pathManager = PathManager.getInstance();

  const demosPath = pathManager.demosAbsPath;

  coreLogger.info(`${"=".repeat(10)} ${BuildEnv} ${"=".repeat(10)}`);
  coreLogger.info(`rootPath is ${pathManager.modulePath}`);
  coreLogger.info(`cwdPath is ${pathManager.cwdPath}`);
  coreLogger.info(`demosPath is ${demosPath}`);

  const configManager = ConfigManager.getInstance();
  const packageConfig = configManager.getPackageConfig();
  const config = configManager.getConfig();
  const umdConfig = configManager.getMainModuleUMDConfig();

  let rollupConfig: RollupOptions[] | RollupOptions = [];

  if (BuildEnvIsDev) {
    const demosManager = DemosManager.getInstance();

    rollupConfig = {
      input: config.input,
      output: {
        file: "dist/umd/index.js",
        format: "umd",
        name: umdConfig.name,
        globals: umdConfig.globals,
        // sourcemap: BuildEnvIsDev ? "inline" : false,
      },
      plugins: getDevPlugins({
        pathManager,
        demosManager,
        config,
        packageConfig,
        configManager,
        processStartParams,
        extraPeerDependenciesTree,
        additionalFrameworkModules,
      }),
      watch: {
        include: ["src/**", "styles/**"],
      },
    };
  } else {
    coreLogger.info("BuildEnvIsProd is true, start to build production code");
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
            DemosManager.dispose();
          },
        },
      ],
    }));
  }

  return rollupConfig;
};
