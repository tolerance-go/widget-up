import { DemoData } from "@/types";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { OutputOptions } from "rollup";
import del from "rollup-plugin-delete";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import { PackageJson, ParseConfig } from "widget-up-utils";
import { getEnv } from "../utils/env.js";
import { getExternalPlugin } from "./getExternalPlugin.js";

export const getBuildPlugins = async ({
  config,
  output,
}: {
  rootPath: string;
  config: ParseConfig;
  output: OutputOptions;
}) => {
  const { BuildEnvIsDev } = getEnv();

  const plugins = [
    del({ targets: ["dist", output.format, "*"].filter(Boolean).join("/") }),
    getExternalPlugin(output.format),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    alias({
      entries: [{ find: "@", replacement: process.cwd() }],
    }),
    resolve(),
    commonjs(),
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
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
    terser(), // 仅在生产模式下压缩代码
  ].filter(Boolean);

  return plugins;
};
