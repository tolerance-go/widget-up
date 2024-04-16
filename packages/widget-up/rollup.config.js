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
import { customHtmlPlugin } from "./customHtmlPlugin.js";

// 确定是否处于开发模式
const isDev = process.env.ROLLUP_WATCH;

// 读取和解析 YAML 配置文件
function getConfig() {
  const configPath = path.join(process.cwd(), "./widget-up.yml");
  const fileContents = fs.readFileSync(configPath, "utf8");
  return yaml.load(fileContents);
}

const config = getConfig();
const packageJSON = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8")
);

// 从 globals 对象的键中生成 external 数组
const external = Object.keys(config.external || {});

const globals = Object.fromEntries(
  Object.entries(config.external).map(([npmName, globalName]) => {
    return [npmName, `${globalName}${packageJSON.dependencies[npmName]}`];
  })
);

export default {
  input: isDev ? "./index.tsx" : "src/index.tsx",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "MyComponent",
    globals,
    sourcemap: isDev ? "inline" : false, // 开发模式启用源码映射
  },
  external,
  plugins: [
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({
      babelHelpers: "runtime",
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-transform-runtime"],
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
        src: "index.html",
        dest: "dist",
        dependencies: packageJSON.dependencies,
      }),
    isDev &&
      copy({
        targets: [{ src: "external", dest: "dist" }],
      }),
    !isDev && terser(), // 仅在生产模式下压缩代码
  ].filter(Boolean),
};
