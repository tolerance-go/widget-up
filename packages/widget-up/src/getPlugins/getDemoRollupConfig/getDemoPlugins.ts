/**
 * # 是什么
 *
 * - 获取 demo 文件做入口的 rollup 的插件
 *
 * # 怎么用
 *
 * ```ts
 * import { getDemoPlugins } from "widget-up";
 *
 * const demoPlugins = await getDemoPlugins({
 * ...
 * });
 */

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { Plugin } from "rollup";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import {
    DemoMenuItem,
    PackageJson,
    ParseConfig,
    deleteDist,
    peerDependenciesAsExternal
} from "widget-up-utils";

/**
 * 获取所有demo文件并将它们作为入口点的插件
 */
export function getDemoPlugins({
  rootPath,
  config,
  packageConfig,
  menus,
}: {
  menus?: DemoMenuItem[];
  rootPath: string;
  config: ParseConfig;
  packageConfig: PackageJson;
}): Plugin[] {
  const plugins = [
    deleteDist({
      dist: "dist/server/libs",
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
  ].filter(Boolean) as Plugin[];

  return plugins;
}
