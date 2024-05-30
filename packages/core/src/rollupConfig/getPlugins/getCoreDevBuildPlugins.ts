import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { InputPluginOption } from "rollup";
import { peerDependenciesAsExternal } from "widget-up-utils";
import { getPostCSSPlg } from "./getPostCSSPlg";
import { ConfigManager } from "@/src/managers/configManager";

export const getCoreDevBuildPlugins = () => {
  const configManager = ConfigManager.getInstance();
  const config = configManager.getConfig();

  const coreDevBuildPlugins: InputPluginOption[] = [
    peerDependenciesAsExternal(),
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
    typescript(),
    getPostCSSPlg({ config }),
  ];

  return coreDevBuildPlugins;
};
