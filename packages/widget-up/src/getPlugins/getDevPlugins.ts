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
import { DemoMenuMeta } from "@/types/demoFileMeta.js";
import { getDemoInputList } from "./getDemoInputList.js";
import { runtimeRollup } from "../rollup-plugins/index.js";
import { BuildEnvIsDev } from "../env.js";
import { logger } from "../logger.js";

export const getDevPlugins = async ({
  rootPath,
  config,
  packageConfig,
  menus,
}: {
  menus?: DemoMenuMeta[];
  rootPath: string;
  config: ParseConfig;
  packageConfig: PackageJson;
}) => {
  const devBuildPlugins = [
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
  ];

  const demoInputList = getDemoInputList(menus ?? []);

  logger.info("demoInputList: ", demoInputList);

  const runtimeRollupPlgs = demoInputList.map((inputItem) => {
    return runtimeRollup({
      input: inputItem.path,
      output: {
        file: path.join("dist/server/demos", inputItem.name, "index.js"),
        format: "umd",
        sourcemap: BuildEnvIsDev,
      },
      plugins: [...devBuildPlugins],
    });
  });

  const plugins = [
    deleteDist({
      dist: ["dist", WupFolderName],
      once: true,
    }),
    ...runtimeRollupPlgs,
    ...devBuildPlugins,
    genAssert({
      src: path.join(rootPath, "tpls/index.html.ejs"),
      dest: WupFolderName,
    }),
    genAssert({
      dest: "dist/server",
      file: {
        name: "packageConfig.json",
        content: JSON.stringify(packageConfig, null, 2),
      },
    }),
    genAssert({
      dest: "dist/server",
      file: {
        name: "config.json",
        content: JSON.stringify(config, null, 2),
      },
    }),
    genAssert({
      dest: "dist/server",
      file: {
        name: "menus.json",
        content: JSON.stringify(menus ?? [], null, 2),
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
