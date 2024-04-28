import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import path from "path";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import {
  PackageJson,
  ParseConfig,
  deleteDist,
  htmlRender,
  peerDependenciesAsExternal,
  serveLivereload,
} from "widget-up-utils";
import { WupFolderName } from "../constants.js";
import { genAssert } from "../rollup-plugins/genAssert/index.js";

export const getDevPlugins = async ({
  rootPath,
  config,
  packageConfig,
  globals,
}: {
  rootPath: string;
  config: ParseConfig;
  packageConfig: PackageJson;
  globals?: Record<string, string>;
}) => {
  const plugins = [
    deleteDist({
      dist: ["dist", WupFolderName],
      once: true,
    }),
    peerDependenciesAsExternal(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    resolve(),
    commonjs(),
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
        },
      },
    }),
    config.css &&
      postcss({
        extract: true, // 提取 CSS 到单独的文件
        ...(config.css === "modules"
          ? {
              modules: true,
            }
          : config.css === "autoModules"
          ? {
              autoModules: true,
            }
          : {}),
      }),
    genAssert({
      src: path.join(rootPath, "tpls/index.html.ejs"),
    }),
    genAssert({
      dest: "dist/server",
      file: {
        name: "packageConfig.json",
        content: JSON.stringify(packageConfig),
      },
    }),
    htmlRender({
      dest: "dist/server",
      src: path.join(WupFolderName, "index.html.ejs"),
      data: {
        menus: [],
      },
    }),
    serveLivereload({
      contentBase: "dist/server",
      port: 3000,
    }),
  ].filter(Boolean);

  return plugins;
};
