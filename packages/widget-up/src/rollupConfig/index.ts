import {
  getRollupConfig,
  PathManager as CorePathManager,
} from "widget-up-core";
import {
  convertDependenciesTreeToList,
  findFrameworkModules,
  getConnectorModuleName,
  getPeerDependTree,
  resolveNpmInfo,
} from "widget-up-utils";
import { PathManager } from "../managers/pathManager";
import { RollupOptions } from "rollup";
import { convertPeerDependenciesTreeToTagTree } from "./convertPeerDependenciesTreeToTagTree";

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

  const frameworkModules = findFrameworkModules({
    cwd: pathManager.cwdPath,
  });

  if (frameworkModules.length > 1) {
    throw new Error("框架重复出现");
  }

  const frameworkModule = frameworkModules[0];

  if (!frameworkModule) {
    throw new Error("框架未检测到");
  }

  const corePlgs = await getRollupConfig({
    processStartParams: (params) => {
      return {
        ...params,
        widgetUpSchemaFormDependencyTree: [
          {
            name: getConnectorModuleName(
              frameworkModule.name,
              frameworkModule.version
            ),
            version: frameworkModule.version,
            scriptSrc: `() => "${corePathManager.getServerScriptFileName(
              frameworkModule.name,
              frameworkModule.version
            )}"`,
            linkHref: `() => ''`,
            depends: convertPeerDependenciesTreeToTagTree(
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
