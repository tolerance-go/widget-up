import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { autoExternalDependencies } from "widget-up-utils";
import del from "rollup-plugin-delete";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    del({ targets: "dist/*" }),
    autoExternalDependencies(),
    resolve(), // 解析 node_modules 中的模块
    commonjs(), // 转换 CJS -> ESM, 主要是一些 npm 包仍然是 CJS
    typescript({
      tsconfig: "tsconfig.build.json",
    }), // TypeScript 支持
    // css({ output: "bundle.css" }), // CSS 支持，将导入的 CSS 文件捆绑到单独的文件
    isProduction && terser(), // 生产环境下压缩代码
  ].filter(Boolean), // 使用 .filter(Boolean) 去除数组中的 falsy 值，如 undefined 或 false
  // 告诉 Rollup 'jquery' 是外部依赖，不要打包进来
  watch: {
    include: "src/**", // 监视 src 目录下的所有文件
  },
};
