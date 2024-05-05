import fs from "fs";
import path from "path";
import { RollupOptions } from "rollup";

import { fileURLToPath } from "url";
import { PackageJson } from "widget-up-utils";
import { BuildEnvIsDev } from "./env";
import { generateGlobals } from "./generateGlobals";
import { generateOutputs } from "./generateOutputs";
import { getConfig } from "./getConfig";
import { getPlugins } from "./getPlugins";
import { getDevPlugins } from "./getPlugins/getDevPlugins";
import { getProdInput } from "./getProdInput";
import { logger } from "./logger";
import { parseDirectoryStructure } from "./parseDirectoryStructure";
import { convertDirectoryToMenu } from "./utils/convertDirectoryToMenuMeta";
import { DemoMenuItem } from "@/types";

const NODE_ENV = process.env.NODE_ENV;

logger.info(`${"=".repeat(10)} ${NODE_ENV} ${"=".repeat(10)}`);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootPath = path.join(__dirname, "..");

const cwdPath = process.cwd();

logger.info(`rootPath is ${rootPath}`);
logger.info(`cwdPath is ${cwdPath}`);

const demosPath = path.join(cwdPath, "demos");
logger.info(`demosPath is ${demosPath}`);

let demoMenus: DemoMenuItem[] = [];

if (fs.existsSync(demosPath)) {
  logger.log("start demos mode");
  const demosDirFileData = parseDirectoryStructure(demosPath);
  logger.info(`demosDirFileData: ${JSON.stringify(demosDirFileData, null, 2)}`);

  demoMenus = convertDirectoryToMenu(demosDirFileData.children ?? []);
}

const packageConfig = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
) as PackageJson;

const config = getConfig();

const globals = generateGlobals(config);

const outputs = generateOutputs(config, globals);

let rollupConfig: RollupOptions[] | RollupOptions = [];

if (BuildEnvIsDev) {
  rollupConfig = {
    input: getProdInput(packageConfig),
    output: {
      file: "dist/umd/index.js",
      format: "umd",
      name: config.umd?.name,
      globals,
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
  rollupConfig = outputs.map((output) => ({
    input: getProdInput(packageConfig),
    output,
    plugins: getPlugins({
      rootPath,
      config,
      packageConfig,
      globals,
      output,
      menus: demoMenus,
    }),
  }));
}

export default rollupConfig;
