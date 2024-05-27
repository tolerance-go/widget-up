import { RollupOptions } from "rollup";
import {
  ConfigManager,
  PathManager as CorePathManager,
  getRollupConfig,
} from "widget-up-core";
import {
  NormalizedConfig,
  convertFrameworkModuleNameToConnectorModuleName,
  convertPeerDependenciesTreeToHTMLDependencyJSONs,
  findOnlyFrameworkModuleConfig,
  getPeerDependTree,
  resolveModuleInfo,
} from "widget-up-utils";
import { PathManager } from "../managers/pathManager";
import { topLogger } from "../utils/logger";

export default async (): Promise<RollupOptions | RollupOptions[]> => {
  const pathManager = PathManager.getInstance();
  const corePathManager = CorePathManager.getInstance();
  const configManager = ConfigManager.getInstance();
  const config = configManager.getConfig();

  topLogger.log("pathManager.modulePath", pathManager.modulePath);

  const schemaFormModuleInfo = resolveModuleInfo({
    name: "widget-up-schema-form",
    cwd: pathManager.modulePath,
  });

  topLogger.log("schemaFormModuleInfo", schemaFormModuleInfo);

  const schemaFormModuleWidgetUpConfig = ConfigManager.getWidgetUpConfig({
    cwd: schemaFormModuleInfo.moduleEntries.modulePath,
  });

  configManager.processConfig((config) => {
    if (!config) return config;

    if (!schemaFormModuleInfo.packageJSON.browser) {
      throw new Error("schemaFormModuleInfo.packageJson.browser not defined");
    }

    const nextConfig: NormalizedConfig = {
      ...config,
      umd: {
        ...config.umd,
        ...schemaFormModuleWidgetUpConfig.umd,
      },
    };

    topLogger.log("nextConfig", nextConfig);

    return nextConfig;
  });

  const schemaFormModulePeerDependTree = getPeerDependTree({
    cwd: schemaFormModuleInfo.moduleEntries.modulePath,
    includeRootPackage: true,
  });

  topLogger.log(
    "schemaFormModulePeerDependTree",
    schemaFormModulePeerDependTree
  );

  const frameworkModuleConfigOfSchemaForm = findOnlyFrameworkModuleConfig({
    cwd: schemaFormModuleInfo.moduleEntries.modulePath,
  });

  const connectorModuleName = convertFrameworkModuleNameToConnectorModuleName(
    frameworkModuleConfigOfSchemaForm.name,
    frameworkModuleConfigOfSchemaForm.version
  );

  const connectorModuleConfig = resolveModuleInfo({
    cwd: corePathManager.modulePath,
    name: connectorModuleName,
  });

  const corePlgs = await getRollupConfig({
    processStartParams: (params) => {
      return {
        ...params,
        dependencies: [
          ...params.dependencies,
          {
            name: connectorModuleName,
            version: frameworkModuleConfigOfSchemaForm.version,
            scriptSrc: `() => "${
              corePathManager.serverConnectorsUrl
            }/${corePathManager.getServerScriptFileName(
              convertFrameworkModuleNameToConnectorModuleName(
                frameworkModuleConfigOfSchemaForm.name,
                frameworkModuleConfigOfSchemaForm.version
              ),
              connectorModuleConfig.packageJSON.version
            )}"`,
            linkHref: `() => ""`,
            depends: convertPeerDependenciesTreeToHTMLDependencyJSONs({
              peerDependenciesTree: schemaFormModulePeerDependTree,
              serverLibsUrl: corePathManager.serverLibsUrl,
              getServerScriptFileName: corePathManager.getServerScriptFileName,
              getServerStyleFileName: corePathManager.getServerStyleFileName,
              dependenciesUMDConfig: config.umd,
            }),
          },
        ],
      };
    },
    getExtraPeerDependenciesTree: () => schemaFormModulePeerDependTree,
    additionalFrameworkModules: () => {
      return [frameworkModuleConfigOfSchemaForm];
    },
  });

  return corePlgs;
};
