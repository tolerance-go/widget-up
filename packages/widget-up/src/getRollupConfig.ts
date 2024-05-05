import fs from "fs";
import path from "path";
import { RollupOptions } from "rollup";
import { fileURLToPath } from "url";
import { PackageJson } from "widget-up-utils";
import { BuildEnvIsDev } from "./env";
import { getUMDGlobals } from "./getGlobals";
import { getProdOutputs } from "./getOutputs";
import { getConfig } from "./getConfig";
import { getPlugins } from "./getPlugins";
import { getDevPlugins } from "./getPlugins/getDevPlugins";
import { getInputFile } from "./getProdInput";
import { logger } from "./logger";
import { parseDirectoryStructure } from "./parseDirectoryStructure";
import { convertDirectoryToMenu } from "./utils/convertDirectoryToMenuMeta";
import { DemoMenuMeta } from "@/types/demoFileMeta";

const NODE_ENV = process.env.NODE_ENV;

const getRollupConfig = async () => {
  logger.info(`${"=".repeat(10)} ${NODE_ENV} ${"=".repeat(10)}`);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const rootPath = path.join(__dirname, "..");

  const cwdPath = process.cwd();

  logger.info(`rootPath is ${rootPath}`);
  logger.info(`cwdPath is ${cwdPath}`);

  const demosPath = path.join(cwdPath, "demos");
  logger.info(`demosPath is ${demosPath}`);

  let demoMenus: DemoMenuMeta[] = [];

  if (fs.existsSync(demosPath)) {
    logger.log("start demos mode");
    const demosDirFileData = parseDirectoryStructure(demosPath);
    logger.info(
      `demosDirFileData: ${JSON.stringify(demosDirFileData, null, 2)}`
    );

    demoMenus = convertDirectoryToMenu(demosDirFileData.children ?? []);
  }

  const packageConfig = JSON.parse(
    fs.readFileSync(path.resolve("package.json"), "utf8")
  ) as PackageJson;

  const config = getConfig();

  const umdGlobals = getUMDGlobals(config);

  let rollupConfig: RollupOptions[] | RollupOptions = [];

  if (BuildEnvIsDev) {
    rollupConfig = {
      input: getInputFile(packageConfig),
      output: {
        file: "dist/umd/index.js",
        format: "umd",
        name: config.umd?.name,
        globals: umdGlobals,
        sourcemap: BuildEnvIsDev ? "inline" : false,
      },
      plugins: getDevPlugins({
        rootPath,
        config,
        packageConfig,
        menus: demoMenus,
      }),
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
        menus: demoMenus,
      }),
    }));
  }
};

export default getRollupConfig;
