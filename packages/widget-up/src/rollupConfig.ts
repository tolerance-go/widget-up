import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { RollupOptions } from "rollup";

import { fileURLToPath } from "url";
import { PackageJson, parseConfig } from "widget-up-utils";
import { generateGlobals } from "./generateGlobals";
import { getPlugins } from "./getPlugins";
import { processEJSTemplate } from "./processEJSTemplate";
import { isDev } from "./env";
import { generateOutputs } from "./generateOutputs";
import semver from "semver";

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
  const configPath = path.join(process.cwd(), "./widget-up.yml");
  const fileContents = fs.readFileSync(configPath, "utf8");
  return parseConfig(yaml.load(fileContents));
}

const config = getConfig();

const devInputFile = "./.wup/index.tsx";

const parsedInput = path.parse(path.posix.join("..", config.input));

function cleanVersion(versionStr) {
  return versionStr.replace(/^[^0-9]+/, "");
}

if (isDev) {
  // 获取 React 的版本字符串并解析主版本号
  const reactVersionStr = packageConfig.dependencies.react;
  const cleanedVersionStr = cleanVersion(reactVersionStr);  // 清理版本字符串
  const reactMajorVersion = semver.major(cleanedVersionStr);  // 解析主版本号
  
  await processEJSTemplate(
    path.join(__dirname, "../tpls/index.tsx.ejs"),
    path.resolve(devInputFile),
    {
      reactVersion: reactMajorVersion,
      // 去掉后缀名
      input: path.posix.join(parsedInput.dir, parsedInput.name),
    }
  );
}

// 从 globals 对象的键中生成 external 数组
const externalKeys = Object.keys(config.umd.external || {});

const globals = await generateGlobals(config);

const plugins = getPlugins(config, packageConfig, globals);

const outputs = generateOutputs(config, globals);

const rollupConfig: RollupOptions[] = outputs.map((output) => ({
  input: isDev ? devInputFile : "./src/index.tsx",
  output,
  plugins,
  external: output.format === "umd" ? externalKeys : externalDependencies,
}));

export default rollupConfig;
