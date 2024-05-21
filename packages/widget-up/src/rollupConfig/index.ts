import { RollupOptions } from "rollup";
import {
  PathManager as CorePathManager,
  getRollupConfig,
} from "widget-up-core";
import {
  convertConnectorModuleToDependencyTreeNode,
  convertDependenciesTreeToList,
  findOnlyFrameworkModule,
  getPeerDependTree,
  resolveNpmInfo,
} from "widget-up-utils";
import { PathManager } from "../managers/pathManager";
import { convertPeerDependenciesTreeToDependencyTree } from "./convertPeerDependenciesTreeToDependencyTree";

export default async (): Promise<RollupOptions | RollupOptions[]> => {
  const pathManager = PathManager.getInstance();
  const corePathManager = CorePathManager.getInstance();

  const schemaFormModuleInfo = resolveNpmInfo({
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

  const frameworkModule = findOnlyFrameworkModule({
    cwd: pathManager.cwdPath,
  });

  const corePlgs = await getRollupConfig({
    processStartParams: (params) => {
      return {
        ...params,
        widgetUpSchemaFormDependencyTree: [
          {
            ...convertConnectorModuleToDependencyTreeNode(
              frameworkModule,
              corePathManager.serverConnectorsUrl,
              corePathManager.getServerScriptFileName(
                frameworkModule.name,
                frameworkModule.version
              )
            ),
            depends: convertPeerDependenciesTreeToDependencyTree(
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
