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
import { PathManager } from "../managers/pathManager";
import { PeerDependTreeManager } from "../managers/getPeerDependTreeManager";
import genServerLibs from "../plugins/genServerLibs";
import { genStart } from "../plugins/genStart";
import { genAssert } from "../utils/rollup-plugins/genAssert";
import { getPostCSSPlg } from "./getPostCSSPlg";
import wrapMainOutput from "../plugins/wrapMainOutput";
import { genPackageConfig } from "../plugins/genPackageConfig";
import { genConfig } from "../plugins/genConfig";

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
    genRuntimeLib(),
    genServerInputs({
      inputNpmManager,
      configManager,
      pathManager,
    }),
    genStart({
      pathManager,
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
    genPackageConfig({
      packageConfig,
      pathManager,
    }),
    genConfig({
      configManager,
      pathManager,
    }),
    serveLivereload({
      contentBase: ["dist/server", "dist/umd"],
      port: 3000,
    }),
  ];

  return plugins;
};
