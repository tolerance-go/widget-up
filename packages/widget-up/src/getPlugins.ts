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
  autoExternalDependencies,
  peerDependenciesAsExternal,
} from "widget-up-rollup-plugins";
import { PackageJson, ParseConfig } from "widget-up-utils";
import { customHtmlPlugin } from "./customHtmlPlugin.js";
import { isDev } from "./env.js";
import { getServerConfig } from "./getServerConfig.js";

const getExternalPlugin = (format: OutputOptions["format"]) => {
  if (format === "cjs" || format === "esm") {
    return autoExternalDependencies();
  }
  if (format === "umd") {
    return peerDependenciesAsExternal();
  }
  return null;
};

export const getPlugins = (
  config: ParseConfig,
  packageConfig: PackageJson,
  globals: Record<string, string>,
  output: OutputOptions
) => {
  const plugins = [
    del({ targets: ["dist", output.format, "*"].filter(Boolean).join("/") }),
    getExternalPlugin(output.format),
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
        compilerOptions: isDev
          ? {
              declaration: false,
            }
          : {
              declarationDir: "dist/types",
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
    isDev && getServerConfig(),
    isDev &&
      livereload({
        watch: "dist", // 监听文件夹
      }),
    isDev &&
      customHtmlPlugin({
        globals,
        src: "../tpls/index.html.ejs",
        dest: "dist",
        packageConfig,
        config,
      }),
    !isDev && terser(), // 仅在生产模式下压缩代码
  ].filter(Boolean);

  return plugins;
};
