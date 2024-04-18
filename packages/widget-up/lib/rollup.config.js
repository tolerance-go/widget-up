import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import copy from "rollup-plugin-copy";
import yaml from "js-yaml";
import path from "path";
import fs from "fs";
import postcss from "rollup-plugin-postcss";

import { customHtmlPlugin } from "./customHtmlPlugin.js";

import { processEJSTemplate } from "./processEJSTemplate.js";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 确定是否处于开发模式
const isDev = process.env.ROLLUP_WATCH;

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

const globals = Object.fromEntries(
  Object.entries(config.umd.external).map(([npmName, globalName]) => {
    return [npmName, `${globalName}${packageConfig.dependencies[npmName]}`];
  })
);

// 构建输出数组
function generateOutputs() {
  const outputs = [];

  // UMD 格式始终包含
  outputs.push({
    file: "dist/umd/index.js",
    format: "umd",
    name: config.umd.name,
    globals,
    sourcemap: isDev ? "inline" : false,
  });

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

export default {
  input: isDev ? devInputFile : "./src/index.tsx",
  output: generateOutputs(),
  external,
  plugins: [
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
    isDev &&
      serve({
        open: true, // 自动打开浏览器
        contentBase: ["dist"], // 服务器根目录，'.': 配置文件同级
        historyApiFallback: true, // SPA页面可使用
        host: "localhost",
        port: 3000,
      }),
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
    !isDev && terser(), // 仅在生产模式下压缩代码
  ].filter(Boolean),
};
