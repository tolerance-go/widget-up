import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import tailwindcss from "tailwindcss";
import path from "path";
import fs from "fs";
import {
  deleteDist,
  htmlRender,
  peerDependenciesAsExternal,
  serveLivereload,
  tsDeclarationAlias,
} from "widget-up-utils";

const buildEnvIsProduction = process.env.NODE_ENV === "production";
const buildEnvIsDevelopment = process.env.NODE_ENV === "development";

// Function to get all .ts files from the demos folder
function getDemosEntries(dir) {
  const entries = {};
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && file.endsWith(".ts")) {
      const name = path.basename(file, ".ts");
      entries[name] = fullPath;
    }
  });
  return entries;
}

const demosDir = path.join(process.cwd(), "demos");
const inputEntries = getDemosEntries(demosDir);

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "SchemaForm",
  },
  plugins: [
    deleteDist({ dist: "dist", once: buildEnvIsDevelopment }),
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
    }),
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
  ],
  watch: {
    include: ["src/**", "styles/**", "demos/**", /widget-up\/packages\/utils/],
  },
};
