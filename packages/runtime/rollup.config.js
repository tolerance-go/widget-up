import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import {
  autoExternalDependencies,
  peerDependenciesAsExternal,
  tsDeclarationAlias,
  deleteDist,
} from "widget-up-utils";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import alias from "@rollup/plugin-alias";

const buildEnvIsProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "WidgetUpRuntime",
  },
  plugins: [
    deleteDist({ dist: "dist" }),
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
    }), // TypeScript 支持
    postcss({
      extensions: [".less"],
      extract: true,
      minimize: buildEnvIsProduction,
      sourceMap: true,
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
  ].filter(Boolean), // 使用 .filter(Boolean) 去除数组中的 falsy 值，如 undefined 或 false
  watch: {
    include: ["src/**", "types/**"],
  },
};
