import { RollupOptions } from "rollup";
import {
  PathManager as CorePathManager,
  getRollupConfig,
} from "widget-up-core";
import {
  convertDependenciesTreeToList,
  findOnlyFrameworkModuleConfig,
  getConnectorModuleName,
  getPeerDependTree,
  resolveModuleInfo,
} from "widget-up-utils";
import { PathManager } from "../managers/pathManager";
import { convertPeerDependenciesTreeToDependencyTreeNodes } from "./convertPeerDependenciesTreeToDependencyTreeNodes";

export default async (): Promise<RollupOptions | RollupOptions[]> => {
  const pathManager = PathManager.getInstance();
  const corePathManager = CorePathManager.getInstance();

  const schemaFormModuleInfo = resolveModuleInfo({
    name: "widget-up-schema-form",
    cwd: pathManager.modulePath,
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
