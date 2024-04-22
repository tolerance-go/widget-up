import fs from "fs";
import path from "path";
import { RollupOptions } from "rollup";

import semver from "semver";
import { fileURLToPath } from "url";
import { PackageJson, parseConfig } from "widget-up-utils";
import { isDev } from "./env";
import { generateGlobals } from "./generateGlobals";
import { generateOutputs } from "./generateOutputs";
import { getPlugins } from "./getPlugins";
import { processEJSTemplate } from "./processEJSTemplate";
import { getConfig } from "./getConfig";
import { getDevInput } from "./getInput";
import { generateDevInputFile } from "./generateDevInputFile";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootPath = path.join(__dirname, "..");

console.log('rootPath', rootPath)

const packageConfig = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
) as PackageJson;

const config = getConfig();

const devInputFile = getDevInput(packageConfig);

await generateDevInputFile({
  rootPath,
  packageConfig,
  config,
  devInputFile,
});

const globals = generateGlobals(config);

const outputs = generateOutputs(config, globals);

const rollupConfig: RollupOptions[] = outputs.map((output) => ({
  input: isDev ? devInputFile : "./src/index.tsx",
  output,
  plugins: getPlugins({ config, packageConfig, globals, output }),
}));

export default rollupConfig;
