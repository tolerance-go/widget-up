import { ConfigManager } from "@/src/managers/configManager";
import { IdentifierManager } from "@/src/managers/identifierManager";
import { PathManager } from "@/src/managers/pathManager";
import { getConnectorGlobalName } from "@/src/utils/getConnectorGlobalName";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import {
  PackageConfig,
  convertFrameworkModuleNameToConnectorModuleName,
  findOnlyFrameworkModuleConfig,
  getMainModuleUMDConfig,
  getModuleAliasImports,
  getPeerDependTree,
  resolveModuleInfo,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";
import { logger } from "./logger";

export interface GenServerConnectorsOptions {
  additionalFrameworkModules?: () => PackageConfig[];
}

export function genServerConnectorAssets({
  additionalFrameworkModules = () => [],
}: GenServerConnectorsOptions): Plugin {
  const configManager = ConfigManager.getInstance();
  const pathManager = PathManager.getInstance();
  const identifierManager = IdentifierManager.getInstance();

  let once = false;

  const build = () => {
    const frameworkModules = [
      findOnlyFrameworkModuleConfig({
        cwd: pathManager.cwdPath,
      }),
      ...additionalFrameworkModules(),
    ];

    logger.info({ frameworkModules });

    // Filter out duplicate framework modules
    const uniqueModules = new Map<string, PackageConfig>();
    frameworkModules.forEach((module) => {
      const key = `${module.name}@${module.version}`;
      if (!uniqueModules.has(key)) {
        uniqueModules.set(key, module);
      }
    });

    const outputPath = pathManager.distServerConnectorsRelativePath;

    fs.ensureDirSync(outputPath);

    uniqueModules.forEach((frameworkModule) => {
      const connectorModuleInfo = resolveModuleInfo({
        cwd: pathManager.modulePath,
        name: convertFrameworkModuleNameToConnectorModuleName(
          frameworkModule.name,
          frameworkModule.version
        ),
      });

      logger.log("prepare getWidgetUpConfig", {
        connectorModuleInfo,
      });

      const wupConfig = ConfigManager.getWidgetUpConfig({
        cwd: connectorModuleInfo.moduleEntries.modulePath,
      });

      logger.log("getWidgetUpConfig", {
        wupConfig,
      });

      const mainUMDConfig = getMainModuleUMDConfig(
        wupConfig.umd,
        connectorModuleInfo.packageJSON.name
      );

      logger.log("getMainModuleUMDConfig", {
        mainUMDConfig,
      });

      const peerDependenciesTree = getPeerDependTree({
        cwd: connectorModuleInfo.moduleEntries.modulePath,
        getExtraPeerDependencies(name) {
          const config = configManager.getConfig();
          return config.umd[name]?.extraPeerDependencies ?? {};
        },
      });

      logger.log("getPeerDependTree", {
        peerDependenciesTree,
      });

      const imports = getModuleAliasImports({
        external: mainUMDConfig.external,
        globals: mainUMDConfig.globals,
        peerDependenciesTree,
        ignorePeerDependencyCheck: ["runtime-component"],
        importScopeObjectName: mainUMDConfig.importScopeObjectName,
      });

      let content = fs.readFileSync(
        connectorModuleInfo.moduleEntries.moduleEntryAbsPath,
        "utf-8"
      );

      content = wrapUMDAliasCode({
        scriptContent: content,
        imports,
        exports: [
          {
            globalVar: getConnectorGlobalName(
              frameworkModule.name,
              frameworkModule.version
            ),
            scopeVar: getConnectorGlobalName(
              frameworkModule.name,
              frameworkModule.version
            ),
          },
        ],
      });

      content = wrapUMDAsyncEventCode({
        eventId: pathManager.getConnectorServerUrl(
          connectorModuleInfo.packageJSON.name,
          connectorModuleInfo.packageJSON.version
        ),
        scriptContent: content,
        eventBusPath: "WidgetUpRuntime.globalEventBus",
      });

      fs.writeFileSync(
        path.join(
          outputPath,
          pathManager.getServerScriptFileName(
            connectorModuleInfo.packageJSON.name,
            connectorModuleInfo.packageJSON.version
          )
        ),
        content,
        "utf-8"
      );
    });
  };

  configManager.watch(() => {
    build();
  });

  return {
    name: identifierManager.genServerConnectorAssetsPlgName,
    buildStart() {
      if (once) return;

      once = true;
      build();
    },
  };
}
