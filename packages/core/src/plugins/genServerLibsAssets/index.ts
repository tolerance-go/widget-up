import { ConfigManager } from "@/src/managers/configManager";
import { EnvManager } from "@/src/managers/envManager";
import { PathManager } from "@/src/managers/pathManager";
import { PeerDependTreeManager } from "@/src/managers/peerDependTreeManager";
import { convertUmdConfigToAliasImports } from "@/src/utils/convertUmdConfigToAliasImports";
import fs from "fs";
import path from "path";
import { Plugin } from "rollup";
import {
  PeerDependenciesNode,
  ResolvedModuleInfo,
  resolveModuleInfo,
  semverToIdentifier,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";
import { filterDuplicateKeys } from "./filterDuplicateKeys";
import { plgLogger } from "./logger";
import { IdentifierManager } from "@/src/managers/identifierManager";

// 插件接收的参数类型定义
export interface ServerLibsPluginOptions {
  processPeerDependenciesList?: (
    list: PeerDependenciesNode[]
  ) => PeerDependenciesNode[];
}

// 主插件函数
function genServerLibs({
  processPeerDependenciesList,
}: ServerLibsPluginOptions): Plugin {
  const envManager = EnvManager.getInstance();
  const configManager = ConfigManager.getInstance();
  const peerDependTreeManager = PeerDependTreeManager.getInstance();
  const pathManager = PathManager.getInstance();
  const identifierManager = IdentifierManager.getInstance();

  let once = false;

  const modifyCode = (
    code: string,
    {
      libNpmInfo,
    }: {
      libNpmInfo: ResolvedModuleInfo;
    }
  ) => {
    const config = configManager.getConfig();
    const externalDependencyConfig =
      config.umd.externalDependencies[libNpmInfo.packageJson.name];
    const aliasCode = wrapUMDAliasCode({
      scriptContent: code,
      imports: convertUmdConfigToAliasImports({
        external: externalDependencyConfig.external,
        globals: externalDependencyConfig.globals,
      }),
      exports: [
        {
          globalVar: `${externalDependencyConfig.name}_${semverToIdentifier(
            libNpmInfo.packageJson.version
          )}`,
          scopeVar: externalDependencyConfig.name,
          scopeName: externalDependencyConfig.exportScopeObjectName,
        },
      ],
    });

    const asyncEventCode = wrapUMDAsyncEventCode({
      eventId: pathManager.getDependsLibServerUrl(
        libNpmInfo.packageJson.name,
        libNpmInfo.packageJson.version
      ),
      eventBusPath: "WidgetUpRuntime.globalEventBus",
      scriptContent: aliasCode,
    });

    return asyncEventCode;
  };

  const write = () => {
    let peerDependenciesList = peerDependTreeManager.getDependenciesList();

    peerDependenciesList =
      processPeerDependenciesList?.(peerDependenciesList) ??
      peerDependenciesList;

    peerDependenciesList = filterDuplicateKeys(peerDependenciesList);

    const { umd: umdConfig } = configManager.getConfig();

    const { BuildEnv } = envManager;

    // 确保输出目录存在
    if (!fs.existsSync(pathManager.distServerLibsAbsPath)) {
      fs.mkdirSync(pathManager.distServerLibsAbsPath, { recursive: true });
    }

    plgLogger.log("umdConfig", umdConfig);

    // 复制每个需要的库
    peerDependenciesList.forEach((lib) => {
      const libName = lib.name;
      plgLogger.log("libName", libName);
      const umdFilePath =
        umdConfig.externalDependencies[libName].browser[BuildEnv];
      const destPath = path.join(
        pathManager.distServerLibsAbsPath,
        pathManager.getServerScriptFileName(libName, lib.version.exact)
      );
      const libNpmInfo = resolveModuleInfo({ name: libName });
      const sourcePath = path.join(libNpmInfo.modulePath, umdFilePath);

      try {
        let code = fs.readFileSync(sourcePath, "utf8");

        code = modifyCode(code, {
          libNpmInfo,
        });

        fs.writeFileSync(destPath, code, "utf8");
      } catch (error) {
        console.error(`Error copying file for ${libName}: ${error}`);
      }
    });
  };

  configManager.watch(() => {
    write();
  });

  peerDependTreeManager.watch(() => {
    write();
  });

  return {
    name: identifierManager.serverLibsPlgName,
    buildStart() {
      // 只执行一次
      if (!once) {
        once = true;
        write();
      }
    },
  };
}

export default genServerLibs;
