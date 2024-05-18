import { RollupOptions } from "rollup";
import { getBuildPlugins, getDevPlugins } from "../getPlugins";
import { getConfigManager } from "../managers/getConfigManager";
import { getDemosManager } from "../managers/getDemosManager";
import { getPeerDependTreeManager } from "../managers/getPeerDependTreeManager";
import { pathManager } from "../managers/pathManager";
import { getEnv } from "../utils/env";
import { logger } from "../utils/logger";
import { getProdOutputs } from "./getProdOutputs";

export default async () => {
  const { BuildEnvIsDev, BuildEnv } = getEnv();

  const demosPath = pathManager.demosAbsPath;

  logger.info(`${"=".repeat(10)} ${BuildEnv} ${"=".repeat(10)}`);
  logger.info(`rootPath is ${pathManager.rootPath}`);
  logger.info(`cwdPath is ${pathManager.cwdPath}`);
  logger.info(`demosPath is ${demosPath}`);

  const configManager = getConfigManager();
  const packageConfig = configManager.getPackageConfig();
  const config = configManager.getConfig();

  let rollupConfig: RollupOptions[] | RollupOptions = [];

  if (BuildEnvIsDev) {
    const demosManager = getDemosManager({
      folderPath: "demos",
      pathManager,
    });

    const peerDependTreeManager = getPeerDependTreeManager({
      cwd: pathManager.cwdPath,
    });

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
        peerDependTreeManager,
        rootPath: pathManager.rootPath,
        config,
        packageConfig,
        configManager,
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
            configManager.clear();
          },
        },
      ],
    }));
  }

  return rollupConfig;
};
