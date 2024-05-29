import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import {
  deleteDist,
  peerDependenciesAsExternal,
  tsDeclarationAlias,
} from "widget-up-utils";

const buildEnvIsProduction = process.env.NODE_ENV === "production";
const buildEnvIsDevelopment = process.env.NODE_ENV === "development";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "WidgetUpLib",
  },
  plugins: [
    deleteDist({ dist: "dist", once: buildEnvIsDevelopment }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.RUNTIME_ENV": JSON.stringify(process.env.RUNTIME_ENV),
    }),
    peerDependenciesAsExternal(),
    alias({
      entries: [{ find: "@", replacement: process.cwd() }],
    }),
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
    buildEnvIsProduction && terser(), // 生产环境下压缩代码
    tsDeclarationAlias(),
  ],
  watch: {
    include: ["src/**", "styles/**"],
  },
};
