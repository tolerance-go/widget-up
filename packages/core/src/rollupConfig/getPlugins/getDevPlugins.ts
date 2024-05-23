import { genDemoIndexHtml } from "@/src/plugins/genDemoIndexHtml";
import { genDemoLibs } from "@/src/plugins/genDemoLibs";
import { genMenus } from "@/src/plugins/genMenus";
import { genRuntimeLib } from "@/src/plugins/genRuntimeLib";
import {
  GenServerConnectorsOptions,
  genServerConnectorAssets,
} from "@/src/plugins/genServerConnectorAssets";
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
  tsDeclarationAlias,
} from "widget-up-utils";
import { WupFolderName } from "../../constants";
import { ConfigManager } from "../../managers/configManager";
import { DemosManager } from "../../managers/demoManager";
import { PathManager } from "../../managers/pathManager";
import { PeerDependTreeManager } from "../../managers/peerDependTreeManager";
import { genServerConfigAssets } from "../../plugins/genServerConfigAssets";
import { genFormConfig } from "../../plugins/genFormConfig";
import { genPackageConfig } from "../../plugins/genPackageConfig";
import genServerLibs, {
  ServerLibsPluginOptions,
} from "../../plugins/genServerLibsAssets";
import { GenStartPlgOptions, genStart } from "../../plugins/genStart";
import wrapMainOutput from "../../plugins/wrapMainOutput";
import { getPostCSSPlg } from "./getPostCSSPlg";

export const getDevPlugins = async ({
  rootPath,
  config,
  packageConfig,
  configManager,
  peerDependTreeManager,
  demosManager,
  pathManager,
  processStartParams,
  extraPeerDependenciesTree,
  additionalFrameworkModules,
}: {
  pathManager: PathManager;
  demosManager: DemosManager;
  peerDependTreeManager: PeerDependTreeManager;
  configManager: ConfigManager;
  rootPath: string;
  config: NormalizedConfig;
  packageConfig: PackageJson;
} & GenStartPlgOptions &
  ServerLibsPluginOptions &
  GenServerConnectorsOptions): Promise<InputPluginOption[]> => {
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

  const devBuildPlugins: InputPluginOption[] = [
    ...coreDevBuildPlugins,
    tsDeclarationAlias(),
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
      devBuildPlugins: coreDevBuildPlugins,
    }),
    genServerLibs({
      extraPeerDependenciesTree,
    }),
    genRuntimeLib(),
    genServerConnectorAssets({
      additionalFrameworkModules,
    }),
    genStart({
      processStartParams,
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
    genServerConfigAssets(),
    genFormConfig(),
    serveLivereload({
      contentBase: ["dist/server", "dist/umd"],
      port: 3000,
    }),
  ];

  return plugins;
};
