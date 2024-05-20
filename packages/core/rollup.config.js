import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import {
  autoExternalDependencies,
  deleteDist,
  tsDeclarationAlias,
} from "widget-up-utils";
import alias from "@rollup/plugin-alias";

const isProduction = process.env.NODE_ENV === "production";

export default [
  {
    input: "src/bin/index.ts",
    output: {
      file: "dist/bin.js",
      format: "esm",
    },
    plugins: [
      deleteDist({ dist: "dist/bin.js" }),
      autoExternalDependencies(),
      json(),
      alias({
        entries: [{ find: "@", replacement: process.cwd() }],
      }),
      resolve({
        preferBuiltins: true,
      }), // 解析 node_modules 中的模块
      commonjs({}),
      typescript({
        tsconfig: "tsconfig.build.json",
      }), // TypeScript 支持
      // css({ output: "bundle.css" }), // CSS 支持，将导入的 CSS 文件捆绑到单独的文件
      isProduction && terser(), // 生产环境下压缩代码
      tsDeclarationAlias(),
    ],
    watch: {
      include: "src/**",
    },
  },
  {
    input: "src/rollupConfig/index.ts",
    output: {
      file: "dist/rollup.config.js",
      format: "esm",
    },
    plugins: [
      deleteDist({ dist: "dist/rollup.config.js" }),
      autoExternalDependencies(),
      json(),
      alias({
        entries: [{ find: "@", replacement: process.cwd() }],
      }),
      resolve({
        preferBuiltins: true,
      }), // 解析 node_modules 中的模块
      commonjs({}),
      typescript({
        tsconfig: "tsconfig.build.json",
      }), // TypeScript 支持
      // css({ output: "bundle.css" }), // CSS 支持，将导入的 CSS 文件捆绑到单独的文件
      isProduction && terser(), // 生产环境下压缩代码
      tsDeclarationAlias(),
    ],
    watch: {
      include: "src/**",
    },
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "esm",
    },
    plugins: [
      deleteDist({ dist: "dist/index.js" }),
      autoExternalDependencies(),
      json(),
      alias({
        entries: [{ find: "@", replacement: process.cwd() }],
      }),
      resolve({
        preferBuiltins: true,
      }), // 解析 node_modules 中的模块
      commonjs({}),
      typescript({
        tsconfig: "tsconfig.build.json",
      }), // TypeScript 支持
      // css({ output: "bundle.css" }), // CSS 支持，将导入的 CSS 文件捆绑到单独的文件
      isProduction && terser(), // 生产环境下压缩代码
      tsDeclarationAlias(),
    ],
    watch: {
      include: "src/**",
    },
  },
];
