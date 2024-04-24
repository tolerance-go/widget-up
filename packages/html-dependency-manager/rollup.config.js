import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
// import alias from '@rollup/plugin-alias';
import {
  peerDependenciesAsExternal,
  autoExternalDependencies,
  tsDeclarationAlias,
} from "widget-up-rollup-plugins";
// import path from 'path';
// import fs from 'fs';
// import stripJsonComments from 'strip-json-comments';

const isProduction = process.env.NODE_ENV === "production";

// 读取 tsconfig 并创建 aliases
// function createAliases() {
//   const tsconfigPath = path.resolve(process.cwd(), "tsconfig.json");
//   const tsconfigJson = fs.readFileSync(tsconfigPath, 'utf-8');
//   const tsconfig = JSON.parse(stripJsonComments(tsconfigJson));  // 使用 stripJsonComments 处理注释
//   const paths = tsconfig.compilerOptions.paths || {};
//   const aliases = Object.keys(paths).reduce((acc, key) => {
//     const value = paths[key][0];
//     const aliasKey = key.replace(/\/\*$/, "");
//     const aliasValue = path.resolve(process.cwd(), value.replace(/\/\*$/, ""));
//     acc.push({ find: aliasKey, replacement: aliasValue });
//     return acc;
//   }, []);

//   return aliases;
// }

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/esm/index.js",
      format: "esm",
    },
    {
      file: "dist/cjs/index.js",
      format: "cjs",
    },
  ],
  plugins: [
    del({ targets: "dist/{esm,cjs}/*" }),
    autoExternalDependencies(),
    // alias({ entries: createAliases() }), // 使用 alias 插件处理路径别名
    resolve(), // 解析 node_modules 中的模块
    commonjs(), // 转换 CJS -> ESM, 主要是一些 npm 包仍然是 CJS
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: "tsconfig.build.json",
    }), // TypeScript 支持
    isProduction && terser(), // 生产环境下压缩代码
    tsDeclarationAlias(),
  ].filter(Boolean), // 使用 .filter(Boolean) 去除数组中的 falsy 值，如 undefined 或 false
  watch: {
    include: ["src/**", "types/**"],
  },
};
