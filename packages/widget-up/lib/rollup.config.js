import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import copy from "rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import serve from "rollup-plugin-serve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import { getLatestPackageVersion, semverToIdentifier } from "@widget-up/utils";

import { customHtmlPlugin } from "./customHtmlPlugin.js";

import { fileURLToPath } from "url";
import { findAvailablePort } from "./findAvailablePort.js";
import { processEJSTemplate } from "./processEJSTemplate.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 确定是否处于开发模式
const isDev = process.env.ROLLUP_WATCH;

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
  return yaml.load(fileContents);
}

const config = getConfig();
const packageConfig = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
);

const devInputFile = "./.wup/index.tsx";

const paredInput = path.parse(path.posix.join("..", config.input));

if (isDev) {
  await processEJSTemplate(
    path.join(__dirname, "./index.tsx.ejs"),
    path.resolve(devInputFile),
    {
      // 去掉后缀名
      input: path.posix.join(paredInput.dir, paredInput.name),
    }
  );
}

// 从 globals 对象的键中生成 external 数组
const external = Object.keys(config.umd.external || {});

async function generateGlobals() {
  const entries = Object.entries(config.umd.external);
  const globals = {};

  for (const [npmName, globalName] of entries) {
    const version = await getLatestPackageVersion(
      npmName,
      packageConfig.dependencies[npmName]
    );
    globals[npmName] = `${globalName}${semverToIdentifier(version)}`;
  }

  return globals;
}

const globals = await generateGlobals();

// 构建输出数组
function generateOutputs() {
  const outputs = [];

  if (config.umd ?? true) {
    // UMD 格式始终包含
    outputs.push({
      file: "dist/umd/index.js",
      format: "umd",
      name: config.umd.name,
      globals,
      sourcemap: isDev ? "inline" : false,
    });
  }

  if (isDev) return outputs;

  if (config.esm ?? true) {
    outputs.push({
      file: "dist/esm/index.js",
      format: "esm",
      sourcemap: isDev ? "inline" : false,
    });
  }

  // 根据配置动态添加 CJS 和 ESM 格式
  if (config.cjs) {
    outputs.push({
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: isDev ? "inline" : false,
    });
  }

  return outputs;
}

// Usage in Rollup config
const PORT = 3000;

const getServerConfig = async () => {
  if (!isDev) return undefined;
  const availablePort = await findAvailablePort(PORT);
  return serve({
    open: true, // 自动打开浏览器
    contentBase: ["dist"], // 服务器根目录，'.': 配置文件同级
    historyApiFallback: true, // SPA页面可使用
    host: "localhost",
    port: availablePort,
  });
};

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: isDev
        ? {
            declaration: false,
          }
        : {
            declarationDir: "dist/types",
          },
    },
  }),
  babel({
    babelHelpers: "runtime",
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: ["@babel/plugin-transform-runtime"],
  }),
  config.css &&
    postcss({
      extract: true, // 提取 CSS 到单独的文件
      ...(config.css === "modules"
        ? {
            modules: true,
          }
        : config.css === "autoModules"
        ? {
            autoModules: true,
          }
        : {}),
    }),
  getServerConfig(),
  isDev &&
    livereload({
      watch: "dist", // 监听文件夹
    }),
  isDev &&
    customHtmlPlugin({
      globals,
      src: "index.html.ejs",
      dest: "dist",
      packageConfig,
      config,
    }),
  isDev &&
    copy({
      targets: [{ src: "external", dest: "dist" }],
    }),
  copy({
    targets: [{ src: "widget-up.yml", dest: "dist" }],
  }),
  !isDev && terser(), // 仅在生产模式下压缩代码
].filter(Boolean);

export default generateOutputs().map((output) => ({
  input: isDev ? devInputFile : "./src/index.tsx",
  output,
  plugins,
  external: output.format === "umd" ? external : externalDependencies,
}));
