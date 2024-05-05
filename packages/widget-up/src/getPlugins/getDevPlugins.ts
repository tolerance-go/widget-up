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
import { WupFolderName } from "../constants";
import { genAssert } from "../rollup-plugins/genAssert";
import { DemoData } from "@/types/demoFileMeta";
import { getDemoInputList } from "./getDemoInputList";
import { runtimeRollup } from "../rollup-plugins";
import { logger } from "../logger";
import { RuntimeRollupOptions } from "../rollup-plugins/runtimeRollup";
import { normalizePath } from "../utils/normalizePath";
import { getEnv } from "../env";
import alias from "@rollup/plugin-alias";

export const getDevPlugins = async ({
  rootPath,
  config,
  packageConfig,
  demoDatas,
  cwdPath,
}: {
  demoDatas?: DemoData[];
  rootPath: string;
  cwdPath: string;
  config: ParseConfig;
  packageConfig: PackageJson;
}) => {
  const { BuildEnvIsDev } = getEnv();
  const devBuildPlugins = [
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

  const demoInputList = getDemoInputList(demoDatas ?? []);

  logger.info("demoInputList: ", demoInputList);

  const runtimeRollupPlgs = demoInputList.map((inputItem) => {
    const input = normalizePath(path.relative(cwdPath, inputItem.path));
    const base: RuntimeRollupOptions = {
      input,
      output: {
        file: normalizePath(
          path.join("dist/server/demos", inputItem.name, "index.js")
        ),
        format: "umd",
        name: config.umd.name,
        sourcemap: BuildEnvIsDev,
      },
    };

    logger.info("runtimeRollupPlgs base: ", base);

    return runtimeRollup(
      {
        ...base,
        plugins: [...devBuildPlugins],
        watch: {
          include: ["src/**", "demos/**"],
        },
      },
      input
    );
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
        content: JSON.stringify(demoDatas ?? [], null, 2),
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
