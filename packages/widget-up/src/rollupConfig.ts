import fs from "fs";
import path from "path";
import { RollupOptions } from "rollup";

import { fileURLToPath } from "url";
import { PackageJson } from "widget-up-utils";
import { Logger } from "./Logger";
import { isDev } from "./env";
import { generateDevInputFile } from "./generateDevInputFile";
import { generateGlobals } from "./generateGlobals";
import { generateOutputs } from "./generateOutputs";
import { getConfig } from "./getConfig";
import { getDevInput } from "./getDevInput";
import { getPlugins } from "./getPlugins";
import { getProdInput } from "./getProdInput";

const NODE_ENV = process.env.NODE_ENV;

const logger = new Logger(
  path.join(process.cwd(), ".logs", new Date().toISOString().substring(0, 10))
);

logger.info(`${"=".repeat(10)} ${NODE_ENV} ${"=".repeat(10)}`);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootPath = path.join(__dirname, "..");

logger.info(`rootPath is ${rootPath}`);

const packageConfig = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
) as PackageJson;

const config = getConfig();

const devInputFile = getDevInput(packageConfig);

if (isDev) {
  await generateDevInputFile({
    rootPath,
    packageConfig,
    config,
    devInputFile,
  });
}

const globals = generateGlobals(config);

const outputs = generateOutputs(config, globals);

const rollupConfig: RollupOptions[] = outputs.map((output) => ({
  input: isDev ? devInputFile : getProdInput(packageConfig),
  output,
  plugins: getPlugins({ config, packageConfig, globals, output }),
}));

export default rollupConfig;
