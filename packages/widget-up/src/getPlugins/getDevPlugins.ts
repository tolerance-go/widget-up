import { DemoData } from "@/types/demoFileMeta";
import alias from "@rollup/plugin-alias";
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
  semverToIdentifier,
  serveLivereload,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";
import { WupFolderName } from "../constants";
import { getEnv } from "../utils/env";
import { ConfigManager } from "../getConfigManager";
import { PeerDependTreeManager } from "../getPeerDependTreeManager";
import { logger } from "../utils/logger";
import { genAssert } from "../utils/rollup-plugins/genAssert";
import genServerLibs from "../plugins/genServerLibs";
import runtimeRollup, {
  RuntimeRollupOptions,
} from "../utils/rollup-plugins/runtimeRollup";
import { convertConfigUmdToAliasImports } from "../utils/convertConfigUmdToAliasImports";
import { normalizePath } from "../utils/normalizePath";
import { getDemoInputList } from "./getDemoInputList";
import { genStart } from "../plugins/genStart";
import { DemosManager } from "../getDemosManager";

export const getDevPlugins = async ({
  rootPath,
  config,
  packageConfig,
  demoDatas,
  cwdPath,
  configManager,
  peerDependTreeManager,
  demosManager,
}: {
  demosManager: DemosManager;
  peerDependTreeManager: PeerDependTreeManager;
  configManager: ConfigManager;
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

    const inputData = path.parse(input);

    const base: RuntimeRollupOptions = {
      input,
      output: {
        file: normalizePath(
          path.join("dist/server", inputData.dir, inputData.name, "index.js")
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
        overwriteChunkCode(code, chunk, options) {
          logger.info(
            "overwriteChunkCode chunk: ",
            JSON.stringify(chunk, null, 2)
          );

          if (!chunk.facadeModuleId) {
            throw new Error("chunk.facadeModuleId is required");
          }

          // 用服务器中的资源路径做为事件 ID
          const eventId = normalizePath(
            path.join("/", path.relative(cwdPath, chunk.facadeModuleId))
          );

          logger.info("eventId: ", eventId);

          return wrapUMDAsyncEventCode({
            eventId,
            eventBusPath: "WidgetUpRuntime.globalEventBus",
            scriptContent: wrapUMDAliasCode({
              scriptContent: code,
              imports: convertConfigUmdToAliasImports({
                umdConfig: config.umd,
              }),
              exports: [
                {
                  globalVar: `${config.umd.name}_${semverToIdentifier(
                    packageConfig.version
                  )}`,
                  scopeVar: config.umd.name,
                },
              ],
            }),
          });
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
    genServerLibs({
      umdConfig: config.umd,
      configManager,
      // modifyCode: (code, lib) => {
      //   return wrapUMDAsyncEventCode({
      //     eventId,
      //     eventBusPath: "WidgetUpRuntime.globalEventBus",
      //     scriptContent: wrapUMDAliasCode({
      //       scriptContent: code,
      //       imports: [

      //       ],
      //       exports: [
      //         {
      //           globalVar: `${config.umd.name}_${semverToIdentifier(
      //             packageConfig.version
      //           )}`,
      //           scopeVar: config.umd.name,
      //         },
      //       ],
      //     }),
      //   });
      // },
    }),
    genStart({
      outputPath: "./dist/start.js",
      demosManager,
      packageConfig,
      peerDependTreeManager,
    }),
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
