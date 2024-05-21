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

export default async () => {
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
            depends: [
              {
                name: "widget-up-schema-form",
                version: "0.0.0",
                scriptSrc: `() => "/libs/widget-up-schema-form.alias-wrap.async-wrap.js"`,
                linkHref: `() => "/libs/widget-up-schema-form.css"`,
                depends: [
                  {
                    name: "jquery",
                    version: "3.7.1",
                    scriptSrc: `(dep) => \`${corePathManager.getServerScriptLibFileName(
                      "jquery",
                      "3.7.1"
                    )}\``,
                    linkHref: `() => ''`,
                  },
                ],
              },
            ],
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
