import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { InputPluginOption, OutputOptions } from "rollup";
import del from "rollup-plugin-delete";
import terser from "@rollup/plugin-terser";
import { NormalizedConfig, tsDeclarationAlias } from "widget-up-utils";
import { getExternalPlugin } from "./getExternalPlugin.js";
import { getPostCSSPlg } from "./getPostCSSPlg.js";

export const getBuildPlugins = ({
  config,
  output,
}: {
  rootPath: string;
  config: NormalizedConfig;
  output: OutputOptions;
}): InputPluginOption[] => {
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
      tsconfig: process.env.TSCONFIG_PATH,
    }),
    getPostCSSPlg({ config }),
    tsDeclarationAlias(),
    terser(), // 仅在生产模式下压缩代码
  ];

  return plugins;
};
