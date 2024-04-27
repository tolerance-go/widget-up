import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import {
  peerDependenciesAsExternal,
  tsDeclarationAlias,
} from "widget-up-utils";

const isProduction = process.env.NODE_ENV === "production";

export default ["jquery", "react"].map((item) => {
  return {
    input: `src/index.${item}.ts`,
    output: {
      file: `dist/${item}/index.js`,
      format: "iife",
    },
    plugins: [
      del({ targets: `dist/${item}/*` }),
      peerDependenciesAsExternal(),
      // alias({ entries: createAliases() }), // 使用 alias 插件处理路径别名
      resolve(), // 解析 node_modules 中的模块
      commonjs(), // 转换 CJS -> ESM, 主要是一些 npm 包仍然是 CJS
      typescript({
        tsconfig: "tsconfig.build.json",
      }), // TypeScript 支持
      isProduction && terser(), // 生产环境下压缩代码
      tsDeclarationAlias(),
    ].filter(Boolean), // 使用 .filter(Boolean) 去除数组中的 falsy 值，如 undefined 或 false
    watch: {
      include: ["src/**", "types/**"],
    },
  };
});
