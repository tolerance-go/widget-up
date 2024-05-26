import { RollupOptions } from "rollup";
import {
  ConfigManager,
  PathManager as CorePathManager,
  getRollupConfig,
} from "widget-up-core";
import {
  NormalizedConfig,
  convertFrameworkModuleNameToConnectorModuleName,
  findOnlyFrameworkModuleConfig,
  getPeerDependTree,
  resolveModuleInfo,
} from "widget-up-utils";
import { PathManager } from "../managers/pathManager";
import { topLogger } from "../utils/logger";
import { convertPeerDependenciesTreeToDependencyTreeNodes } from "./convertPeerDependenciesTreeToDependencyTreeNodes";

export default async (): Promise<RollupOptions | RollupOptions[]> => {
  const pathManager = PathManager.getInstance();
  const corePathManager = CorePathManager.getInstance();
  const configManager = ConfigManager.getInstance();

  topLogger.log("pathManager.modulePath", pathManager.modulePath);

  const schemaFormModuleInfo = resolveModuleInfo({
    name: "widget-up-schema-form",
    cwd: pathManager.modulePath,
  });

  const schemaFormModuleWidgetUpConfig = ConfigManager.getWidgetUpConfig({
    cwd: schemaFormModuleInfo.modulePath,
  });

  configManager.processConfig((config) => {
    if (!config) return config;

    if (!schemaFormModuleInfo.packageJson.browser) {
      throw new Error("schemaFormModuleInfo.packageJson.browser not defined");
    }

    const nextConfig: NormalizedConfig = {
      ...config,
      umd: {
        ...config.umd,
        externalDependencies: {
          ...config.umd.externalDependencies,
          [schemaFormModuleInfo.packageJson.name]: {
            name: schemaFormModuleWidgetUpConfig.umd.name,
            external: schemaFormModuleWidgetUpConfig.umd.external,
            globals: schemaFormModuleWidgetUpConfig.umd.globals,
            browser: {
              development: schemaFormModuleInfo.packageJson.browser,
              production: schemaFormModuleInfo.packageJson.browser,
            },
            exportScopeObjectName: "global",
          },
          ...schemaFormModuleWidgetUpConfig.umd.externalDependencies,
        },
      },
    };

    topLogger.log("nextConfig", nextConfig);

    return nextConfig;
  });

  const schemaFormModulePeerDependTree = getPeerDependTree({
    cwd: schemaFormModuleInfo.modulePath,
    includeRootPackage: true,
  });

  topLogger.log(
    "schemaFormModulePeerDependTree",
    schemaFormModulePeerDependTree
  );

  const frameworkModuleConfigOfSchemaForm = findOnlyFrameworkModuleConfig({
    cwd: schemaFormModuleInfo.modulePath,
  });

  const corePlgs = await getRollupConfig({
    processStartParams: (params) => {
      return {
        ...params,
        dependencies: [
          ...params.dependencies,
          {
            name: convertFrameworkModuleNameToConnectorModuleName(
              frameworkModuleConfigOfSchemaForm.name,
              frameworkModuleConfigOfSchemaForm.version
            ),
            version: frameworkModuleConfigOfSchemaForm.version,
            scriptSrc: `() => "${
              corePathManager.serverConnectorsUrl
            }/${corePathManager.getServerScriptFileName(
              convertFrameworkModuleNameToConnectorModuleName(
                frameworkModuleConfigOfSchemaForm.name,
                frameworkModuleConfigOfSchemaForm.version
              ),
              frameworkModuleConfigOfSchemaForm.version
            )}"`,
            linkHref: `() => ''`,
            depends: convertPeerDependenciesTreeToDependencyTreeNodes(
              schemaFormModulePeerDependTree
            ),
          },
        ],
      };
    },
    extraPeerDependenciesTree: schemaFormModulePeerDependTree,
    additionalFrameworkModules: () => {
      return [frameworkModuleConfigOfSchemaForm];
    },
  });

  return corePlgs;
};
