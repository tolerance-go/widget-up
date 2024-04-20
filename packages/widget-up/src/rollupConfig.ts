import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { RollupOptions } from "rollup";

import { fileURLToPath } from "url";
import { parseConfig } from "widget-up-utils";
import { generateGlobals } from "./generateGlobals.js";
import { getPlugins } from "./getPlugins.js";
import { processEJSTemplate } from "./processEJSTemplate.js";
import { isDev } from "./env.js";
import { generateOutputs } from "./generateOutputs.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
);
const dependencies = Object.keys(packageJson.dependencies || {});
const peerDependencies = Object.keys(packageJson.peerDependencies || {});
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
const packageConfig = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
);

const devInputFile = "./.wup/index.tsx";

const paredInput = path.parse(path.posix.join("..", config.input));

if (isDev) {
  await processEJSTemplate(
    path.join(__dirname, "../tpls/index.tsx.ejs"),
    path.resolve(devInputFile),
    {
      // 去掉后缀名
      input: path.posix.join(paredInput.dir, paredInput.name),
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
