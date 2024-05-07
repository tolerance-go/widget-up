import fs from "fs";
import path from "path";
import { RollupOptions } from "rollup";
import { fileURLToPath } from "url";
import { PackageJson } from "widget-up-utils";
import { getUMDGlobals } from "./getGlobals";
import { getProdOutputs } from "./getOutputs";
import { getConfigManager } from "./getConfigManager";
import { getPlugins } from "./getPlugins";
import { getDevPlugins } from "./getPlugins/getDevPlugins";
import { getInputFile } from "./getProdInput";
import { logger } from "./logger";
import { parseDirectoryStructure } from "./utils/parseDirectoryStructure";
import { convertDirectoryToDemo } from "./utils/convertDirectoryToDemo";
import { DemoData } from "@/types/demoFileMeta";
import { getEnv } from "./env";
import { getPeerDependTreeManager } from "./getPeerDependTreeManager";

const getRollupConfig = async () => {
  const { BuildEnvIsDev, BuildEnv } = getEnv();
  logger.info(`${"=".repeat(10)} ${BuildEnv} ${"=".repeat(10)}`);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const rootPath = path.join(__dirname, "..");

  const cwdPath = process.cwd();

  logger.info(`rootPath is ${rootPath}`);
  logger.info(`cwdPath is ${cwdPath}`);

  const demosPath = path.join(cwdPath, "demos");
  logger.info(`demosPath is ${demosPath}`);

  let demoDatas: DemoData[] = [];

  if (fs.existsSync(demosPath)) {
    logger.log("start demos mode");
    const demosDirFileData = parseDirectoryStructure(demosPath);
    logger.info(
      `demosDirFileData: ${JSON.stringify(demosDirFileData, null, 2)}`
    );

    demoDatas = convertDirectoryToDemo(demosDirFileData.children ?? []);

    logger.info(`demoDatas: ${JSON.stringify(demoDatas, null, 2)}`);
  }

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
        configManager
      }),
      watch: {
        include: ["src/**"],
      },
    };
  } else {
    rollupConfig = getProdOutputs(config, umdGlobals).map((output) => ({
      input: getInputFile(packageConfig),
      output,
      plugins: getPlugins({
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
