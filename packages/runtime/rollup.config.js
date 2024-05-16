import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import tailwindcss from "tailwindcss";
import {
  deleteDist,
  htmlRender,
  peerDependenciesAsExternal,
  serveLivereload,
  tsDeclarationAlias,
} from "widget-up-utils";

const buildEnvIsProduction = process.env.NODE_ENV === "production";
const buildEnvIsDevelopment = process.env.NODE_ENV === "development";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "WidgetUpRuntime",
  },
  plugins: [
    deleteDist({ dist: "dist", once: buildEnvIsDevelopment }),
    peerDependenciesAsExternal(),
    alias({
      entries: [{ find: "@", replacement: process.cwd() }],
    }),
    // alias({ entries: createAliases() }), // 使用 alias 插件处理路径别名
    resolve({
      preferBuiltins: true,
      mainFields: ["browser", "module", "main"],
    }), // 解析 node_modules 中的模块
    commonjs(), // 转换 CJS -> ESM, 主要是一些 npm 包仍然是 CJS
    json(),
    typescript({
      tsconfig: "tsconfig.build.json",
      compilerOptions: buildEnvIsDevelopment
        ? {
            declaration: false,
          }
        : {},
    }), // TypeScript 支持
    postcss({
      extensions: [".less"],
      extract: true,
      minimize: buildEnvIsProduction,
      sourceMap: buildEnvIsDevelopment,
      plugins: [
        tailwindcss(), // 使用 Tailwind CSS
        autoprefixer(), // 使用 Autoprefixer
      ],
      use: {
        less: {
          javascriptEnabled: true,
        },
      },
    }),
    buildEnvIsProduction && terser(), // 生产环境下压缩代码
    tsDeclarationAlias(),
    buildEnvIsDevelopment &&
      htmlRender({
        dest: "server",
        src: "index.html.ejs",
      }),
    buildEnvIsDevelopment &&
      serveLivereload({
        contentBase: ["dist", "server"],
        port: 3000,
      }),
  ].filter(Boolean), // 使用 .filter(Boolean) 去除数组中的 falsy 值，如 undefined 或 false
  watch: {
    include: ["src/**", "styles/**", /widget-up\/packages\/utils/],
  },
};
