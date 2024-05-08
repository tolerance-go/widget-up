import { DemoData } from "@/types/demoFileMeta";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import path from "path";
import { InputPluginOption } from "rollup";
import postcss from "rollup-plugin-postcss";
import {
  PackageJson,
  ParseConfig,
  deleteDist,
  htmlRender,
  peerDependenciesAsExternal,
  serveLivereload,
} from "widget-up-utils";
import { WupFolderName } from "../../constants";
import { ConfigManager } from "../../getConfigManager";
import { DemosManager } from "../../getDemosManager";
import { InputNpmManager } from "../../getInputNpmManager";
import { PathManager } from "../../getPathManager";
import { PeerDependTreeManager } from "../../getPeerDependTreeManager";
import genServerLibs from "../../plugins/genServerLibs";
import { genStart } from "../../plugins/genStart";
import { getEnv } from "../../utils/env";
import { logger } from "../../utils/logger";
import { genAssert } from "../../utils/rollup-plugins/genAssert";
import { getDemoInputList } from "../getDemoInputList";
import { getDemoRuntimePlgs } from "./getDemoRuntimePlgs";
import { genServerInputs } from "@/src/plugins/genServerInputs";
import typescript from "@rollup/plugin-typescript";

export const getDevPlugins = async ({
  rootPath,
  config,
  packageConfig,
  demoDatas,
  cwdPath,
  configManager,
  peerDependTreeManager,
  demosManager,
  pathManager,
}: {
  pathManager: PathManager;
  demosManager: DemosManager;
  peerDependTreeManager: PeerDependTreeManager;
  configManager: ConfigManager;
  demoDatas?: DemoData[];
  rootPath: string;
  cwdPath: string;
  config: ParseConfig;
  packageConfig: PackageJson;
}) => {
  const inputNpmManager = new InputNpmManager({
    cwd: rootPath,
  });

  const { BuildEnvIsDev } = getEnv();
  const devBuildPlugins: InputPluginOption[] = [
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
      compilerOptions: {
        declaration: false,
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

  const runtimeRollupPlgs = getDemoRuntimePlgs({
    config,
    packageConfig,
    cwdPath,
    demoInputList,
    devBuildPlugins,
  });

  const plugins = [
    deleteDist({
      dist: ["dist", WupFolderName],
      once: true,
    }),
    ...runtimeRollupPlgs,
    ...devBuildPlugins,
    genServerLibs({
      peerDependTreeManager,
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
    genServerInputs({
      outputPath: "dist/server/inputs",
      inputNpmManager,
      configManager,
    }),
    genStart({
      pathManager,
      outputPath: "./dist/server/start.js",
      demosManager,
      packageConfig,
      peerDependTreeManager,
      inputNpmManager,
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
