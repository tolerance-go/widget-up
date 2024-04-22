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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageConfig = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
) as PackageJson;
const dependencies = Object.keys(packageConfig.dependencies || {});
const peerDependencies = Object.keys(packageConfig.peerDependencies || {});
const externalDependencies = Array.from(
  new Set([...dependencies, ...peerDependencies])
);

// 读取和解析 YAML 配置文件
function getConfig() {
  const configPath = path.join(process.cwd(), "./widget-up.json");
  const fileContents = fs.readFileSync(configPath, "utf8");
  return parseConfig(JSON.parse(fileContents));
}

const config = getConfig();

const devInputFile = packageConfig.dependencies.react
  ? "./.wup/index.tsx"
  : packageConfig.dependencies.jquery
  ? "./.wup/index.ts"
  : "./.wup/index.ts";

const parsedInput = path.parse(path.posix.join("..", config.input));

function cleanVersion(versionStr) {
  return versionStr.replace(/^[^0-9]+/, "");
}

if (isDev) {
  // 无论是否有 React，始终调用 processEJSTemplate
  await processEJSTemplate(
    path.join(
      __dirname,
      `../tpls/index.tsx.${
        packageConfig.dependencies.react
          ? "react"
          : packageConfig.dependencies.jquery
          ? "jquery"
          : "default"
      }.ejs`
    ),
    path.resolve(devInputFile),
    {
      dependencies: packageConfig.dependencies,
      input: path.posix.join(parsedInput.dir, parsedInput.name), // 去掉后缀名
      major: semver.major,
      cleanVersion,
    }
  );
}

const globals = await generateGlobals(config);

const outputs = generateOutputs(config, globals);

const rollupConfig: RollupOptions[] = outputs.map((output) => ({
  input: isDev ? devInputFile : "./src/index.tsx",
  output,
  plugins: getPlugins(config, packageConfig, globals, output),
}));

export default rollupConfig;
