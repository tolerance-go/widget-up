import { ConfigManager } from "@/src/managers/configManager";
import { PathManager } from "@/src/managers/pathManager";
import { getConnectorGlobalName } from "@/src/utils/getConnectorGlobalName";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import {
  PackageJson,
  convertFrameworkModuleNameToConnectorModuleName,
  findOnlyFrameworkModuleConfig,
  resolveModuleInfo,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";
import { plgLogger } from "./logger";
import { IdentifierManager } from "@/src/managers/identifierManager";

export interface GenServerConnectorsOptions {
  additionalFrameworkModules?: () => PackageJson[];
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

    plgLogger.log("frameworkModules:", frameworkModules);

    // Filter out duplicate framework modules
    const uniqueModules = new Map<string, PackageJson>();
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

      let content = fs.readFileSync(
        connectorModuleInfo.moduleEntryPath,
        "utf-8"
      );

      content = wrapUMDAliasCode({
        scriptContent: content,
        imports: [
          {
            globalVar: "RuntimeComponent",
            scopeVar: "RuntimeComponent",
          },
        ],
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
        eventId: pathManager.getInputLibUrl(
          connectorModuleInfo.packageJson.name,
          connectorModuleInfo.packageJson.version
        ),
        scriptContent: content,
        eventBusPath: "WidgetUpRuntime.globalEventBus",
      });

      fs.writeFileSync(
        path.join(
          outputPath,
          pathManager.getServerScriptFileName(
            connectorModuleInfo.packageJson.name,
            connectorModuleInfo.packageJson.version
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
