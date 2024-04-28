import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { OutputOptions } from "rollup";
import del from "rollup-plugin-delete";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import {
  PackageJson,
  ParseConfig,
  htmlRender,
  peerDependenciesAsExternal,
  serveLivereload,
} from "widget-up-utils";
import { MenuItem, runtimeHtmlPlugin } from "./runtimeHtmlPlugin.js";
import { BuildEnvIsDev } from "../env.js";
import { getServerConfig } from "../getServerConfig.js";
import { getExternalPlugin } from "./getExternalPlugin.js";
import { genTempAssert } from "../rollup-plugins/genTempAssert/index.js";
import path from "path";
import { TempWupFolderName } from "../constants.js";

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
    // del({ targets: "dist/*", runOnce: true }),
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
    genTempAssert({
      src: path.join(rootPath, "tpls/index.html.ejs"),
    }),
    htmlRender({
      dest: "dist/server",
      src: path.join(TempWupFolderName, "index.html.ejs"),
      data: {
        menus: []
      }
    }),
    serveLivereload({
      contentBase: "dist/server",
      port: 3000,
    }),
  ].filter(Boolean);

  return plugins;
};
