import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";
import { deleteDist } from "widget-up-utils";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    deleteDist({ dist: "dist" }),
    json(),
    alias({
      entries: [{ find: "@", replacement: process.cwd() }],
    }),
    resolve({
      preferBuiltins: true,
    }), // 解析 node_modules 中的模块
    commonjs({}),
    postcss({
      extract: true, // 提取 CSS 到单独文件
      plugins: [
        tailwindcss({
          content: ["./src/**/*.{html,ts}"],
          theme: {
            extend: {},
          },
          plugins: [],
        }),
        autoprefixer(),
      ],
      extensions: [".css", ".less", ".sass", ".styl"],
      use: {
        less: { javascriptEnabled: true },
        sass: { indentedSyntax: true },
        stylus: {},
      },
    }),
    typescript({}), // TypeScript 支持
  ],
  watch: {
    include: ["src/**", "styles/**"],
  },
};
