import {
  getRollupConfig,
  PathManager as CorePathManager,
} from "widget-up-core";
import {
  convertDependenciesTreeToList,
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

  const corePlgs = await getRollupConfig({
    processStartParams: (params) => {
      return {
        ...params,
        widgetUpSchemaFormDependencyTree: [
          {
            name: "widget-up-connector-jquery3",
            version: "0.0.0",
            scriptSrc: `() => "/libs/input.jquery3.alias-wrap.async-wrap.js"`,
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
