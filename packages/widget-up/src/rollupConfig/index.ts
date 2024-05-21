import { RollupOptions } from "rollup";
import {
  PathManager as CorePathManager,
  getRollupConfig,
} from "widget-up-core";
import {
  convertDependenciesTreeToList,
  findOnlyFrameworkModule,
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

  const frameworkModuleOfSchemaForm = findOnlyFrameworkModule({
    cwd: schemaFormModuleInfo.modulePath,
  });

  const corePlgs = await getRollupConfig({
    processStartParams: (params) => {
      return {
        ...params,
        widgetUpSchemaFormDependencyTree: [
          {
            name: getConnectorModuleName(
              frameworkModuleOfSchemaForm.name,
              frameworkModuleOfSchemaForm.version
            ),
            version: schemaFormModulePeerDependTree.version,
            scriptSrc: `() => "${
              corePathManager.serverConnectorsUrl
            }/${corePathManager.getServerScriptFileName(
              frameworkModuleOfSchemaForm.name,
              frameworkModuleOfSchemaForm.version
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
    // @TODO 需要加上 widget-up-connector-jquery3 依赖
  });

  return corePlgs;
};
