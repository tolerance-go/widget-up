import { genDemoIndexHtml } from "@/src/plugins/genDemoIndexHtml";
import { genDemoLibs } from "@/src/plugins/genDemoLibs";
import { genMenus } from "@/src/plugins/genMenus";
import { genRuntimeLib } from "@/src/plugins/genRuntimeLib";
import { genServerInputs } from "@/src/plugins/genServerInputs";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { InputPluginOption } from "rollup";
import {
  NormalizedConfig,
  PackageJson,
  deleteDist,
  peerDependenciesAsExternal,
  serveLivereload,
} from "widget-up-utils";
import { WupFolderName } from "../constants";
import { ConfigManager } from "../managers/getConfigManager";
import { DemosManager } from "../managers/getDemosManager";
import { InputNpmManager } from "../managers/getInputNpmManager";
import { PathManager } from "../managers/getPathManager";
import { PeerDependTreeManager } from "../managers/getPeerDependTreeManager";
import genServerLibs from "../plugins/genServerLibs";
import { genStart } from "../plugins/genStart";
import { genAssert } from "../utils/rollup-plugins/genAssert";
import { getPostCSSPlg } from "./getPostCSSPlg";
import wrapMainOutput from "../plugins/wrapMainOutput";

export const getDevPlugins = async ({
  rootPath,
  config,
  packageConfig,
  configManager,
  peerDependTreeManager,
  demosManager,
  pathManager,
}: {
  pathManager: PathManager;
  demosManager: DemosManager;
  peerDependTreeManager: PeerDependTreeManager;
  configManager: ConfigManager;
  rootPath: string;
  config: NormalizedConfig;
  packageConfig: PackageJson;
}): Promise<InputPluginOption[]> => {
  const inputNpmManager = new InputNpmManager({
    cwd: rootPath,
  });

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
    getPostCSSPlg({ config }),
  ];

  const plugins: InputPluginOption[] = [
    deleteDist({
      dist: ["dist", WupFolderName],
      once: true,
    }),
    ...devBuildPlugins,
    wrapMainOutput({
      pathManager,
      configManager,
    }),
    genDemoLibs({
      pathManager,
      demosManager,
      configManager,
      devBuildPlugins,
    }),
    genServerLibs({
      peerDependTreeManager,
      configManager,
      pathManager,
    }),
    genRuntimeLib({
      pathManager,
    }),
    genServerInputs({
      outputPath: "dist/server/inputs",
      inputNpmManager,
      configManager,
      pathManager,
    }),
    genStart({
      pathManager,
      outputPath: "./dist/server/start.js",
      demosManager,
      packageConfig,
      peerDependTreeManager,
      inputNpmManager,
      configManager,
    }),
    genDemoIndexHtml({
      pathManager,
      demosManager,
      configManager,
    }),
    genMenus({
      pathManager,
      demosManager,
      configManager,
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
    serveLivereload({
      contentBase: "dist/server",
      port: 3000,
    }),
  ].filter(Boolean);

  return plugins;
};
