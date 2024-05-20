import { RollupOptions } from "rollup";
import { getBuildPlugins, getDevPlugins } from "../getPlugins";
import { ConfigManager } from "../managers/configManager";
import { DemosManager } from "../managers/demoManager";
import { pathManager } from "../managers/pathManager";
import { PeerDependTreeManager } from "../managers/peerDependTreeManager";
import { getEnv } from "../utils/env";
import { logger } from "../utils/logger";
import { getProdOutputs } from "./getProdOutputs";
import { GenStartPlgOptions } from "../plugins/genStart";

export default async ({ processStartParams }: GenStartPlgOptions) => {
  const { BuildEnvIsDev, BuildEnv } = getEnv();

  const demosPath = pathManager.demosAbsPath;

  logger.info(`${"=".repeat(10)} ${BuildEnv} ${"=".repeat(10)}`);
  logger.info(`rootPath is ${pathManager.rootPath}`);
  logger.info(`cwdPath is ${pathManager.cwdPath}`);
  logger.info(`demosPath is ${demosPath}`);

  const configManager = ConfigManager.getInstance();
  const packageConfig = configManager.getPackageConfig();
  const config = configManager.getConfig();

  const peerDependTreeManager = PeerDependTreeManager.getInstance();

  let rollupConfig: RollupOptions[] | RollupOptions = [];

  if (BuildEnvIsDev) {
    const demosManager = DemosManager.getInstance();

    rollupConfig = {
      input: config.input,
      output: {
        file: "dist/umd/index.js",
        format: "umd",
        name: config.umd.name,
        globals: config.umd.globals,
        sourcemap: BuildEnvIsDev ? "inline" : false,
      },
      plugins: getDevPlugins({
        pathManager,
        demosManager,
        peerDependTreeManager: peerDependTreeManager,
        rootPath: pathManager.rootPath,
        config,
        packageConfig,
        configManager,
        processStartParams,
      }),
      watch: {
        include: ["src/**", "styles/**"],
      },
    };
  } else {
    logger.info("BuildEnvIsProd is true, start to build production code");
    rollupConfig = getProdOutputs(config).map((output) => ({
      input: config.input,
      output,
      plugins: [
        ...getBuildPlugins({
          rootPath: pathManager.rootPath,
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
