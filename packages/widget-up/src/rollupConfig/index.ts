import { RollupOptions } from "rollup";
import {
  ConfigManager,
  PathManager as CorePathManager,
  getRollupConfig,
} from "widget-up-core";
import {
  NormalizedConfig,
  convertDependenciesTreeToList,
  findOnlyFrameworkModuleConfig,
  getConnectorModuleName,
  getPeerDependTree,
  resolveModuleInfo,
} from "widget-up-utils";
import { PathManager } from "../managers/pathManager";
import { convertPeerDependenciesTreeToDependencyTreeNodes } from "./convertPeerDependenciesTreeToDependencyTreeNodes";
import { topLogger } from "../utils/logger";

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

  const schemaFormModulePeerDependList = convertDependenciesTreeToList(
    schemaFormModulePeerDependTree
  );

  const frameworkModuleConfigOfSchemaForm = findOnlyFrameworkModuleConfig({
    cwd: schemaFormModuleInfo.modulePath,
  });

  const corePlgs = await getRollupConfig({
    processStartParams: (params) => {
      return {
        ...params,
        widgetUpSchemaFormDependencyTree: [
          {
            name: getConnectorModuleName(
              frameworkModuleConfigOfSchemaForm.name,
              frameworkModuleConfigOfSchemaForm.version
            ),
            version: frameworkModuleConfigOfSchemaForm.version,
            scriptSrc: `() => "${
              corePathManager.serverConnectorsUrl
            }/${corePathManager.getServerScriptFileName(
              frameworkModuleConfigOfSchemaForm.name,
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
    processPeerDependenciesList: (list) => {
      return [...list, ...schemaFormModulePeerDependList];
    },
    additionalFrameworkModules: () => {
      return [frameworkModuleConfigOfSchemaForm];
    },
  });

  return corePlgs;
};
