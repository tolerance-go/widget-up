import fs from "fs";
import path from "path";
import { RollupOptions } from "rollup";
import { fileURLToPath } from "url";
import { getConfigManager } from "../managers/getConfigManager";
import { getDemosManager } from "../managers/getDemosManager";
import { getPeerDependTreeManager } from "../managers/getPeerDependTreeManager";
import { getBuildPlugins, getDevPlugins } from "../getPlugins";
import { getEnv } from "../utils/env";
import { logger } from "../utils/logger";
import { getProdOutputs } from "./getProdOutputs";
import { PathManager } from "../managers/PathManager";

export default async () => {
  const { BuildEnvIsDev, BuildEnv } = getEnv();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootPath = path.join(__dirname, "..");
  const cwdPath = process.cwd();

  PathManager.createInstance({
    cwdPath,
    rootPath,
  });

  const pathManager = PathManager.getInstance();

  const demosPath = pathManager.demosAbsPath;

  logger.info(`${"=".repeat(10)} ${BuildEnv} ${"=".repeat(10)}`);
  logger.info(`rootPath is ${rootPath}`);
  logger.info(`cwdPath is ${cwdPath}`);
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
      cwd: cwdPath,
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
        rootPath,
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
          rootPath,
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