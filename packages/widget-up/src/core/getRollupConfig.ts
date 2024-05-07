import fs from "fs";
import path from "path";
import { RollupOptions } from "rollup";
import { fileURLToPath } from "url";
import { PackageJson } from "widget-up-utils";
import { getEnv } from "../utils/env";
import { getConfigManager } from "../getConfigManager";
import { getDemosFolderManager } from "../getDemosFolderManager";
import { getUMDGlobals } from "./getGlobals";
import { getProdOutputs } from "./getOutputs";
import { getPeerDependTreeManager } from "../getPeerDependTreeManager";
import { getInputFile } from "./getProdInput";
import { logger } from "../utils/logger";
import { getDevPlugins, getBuildPlugins } from "../getPlugins";

const getRollupConfig = async () => {
  const { BuildEnvIsDev, BuildEnv } = getEnv();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootPath = path.join(__dirname, "..");
  const cwdPath = process.cwd();
  const demosPath = path.join(cwdPath, "demos");

  logger.info(`${"=".repeat(10)} ${BuildEnv} ${"=".repeat(10)}`);
  logger.info(`rootPath is ${rootPath}`);
  logger.info(`cwdPath is ${cwdPath}`);
  logger.info(`demosPath is ${demosPath}`);

  const demosFolderManager = getDemosFolderManager({
    folderPath: "demos",
  });

  const demoDatas = demosFolderManager.getDemoDatas();

  const packageConfig = JSON.parse(
    fs.readFileSync(path.resolve("package.json"), "utf8")
  ) as PackageJson;
  const configManager = getConfigManager();
  const config = configManager.get();

  const umdGlobals = getUMDGlobals(config);

  let rollupConfig: RollupOptions[] | RollupOptions = [];

  if (BuildEnvIsDev) {
    const peerDependTreeManager = getPeerDependTreeManager({
      cwd: cwdPath,
    });

    rollupConfig = {
      input: getInputFile(packageConfig),
      output: {
        file: "dist/umd/index.js",
        format: "umd",
        name: config.umd.name,
        globals: umdGlobals,
        sourcemap: BuildEnvIsDev ? "inline" : false,
      },
      plugins: getDevPlugins({
        peerDependTreeManager,
        rootPath,
        config,
        packageConfig,
        demoDatas,
        cwdPath,
        configManager,
      }),
      watch: {
        include: ["src/**"],
      },
    };
  } else {
    rollupConfig = getProdOutputs(config, umdGlobals).map((output) => ({
      input: getInputFile(packageConfig),
      output,
      plugins: getBuildPlugins({
        rootPath,
        config,
        packageConfig,
        globals: umdGlobals,
        output,
        demoDatas,
      }),
    }));
  }

  return rollupConfig;
};

export default getRollupConfig;
