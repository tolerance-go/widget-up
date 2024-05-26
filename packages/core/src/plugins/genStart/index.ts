import { ConfigManager } from "@/src/managers/configManager";
import { DemosManager } from "@/src/managers/demoManager";
import { PathManager } from "@/src/managers/pathManager";
import { PeerDependTreeManager } from "@/src/managers/peerDependTreeManager";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import {
  HTMLDependencyJSON,
  StartParamsJSON,
  convertConnectorModuleToDependencyTreeNodeJSON,
  convertFrameworkModuleNameToConnectorModuleName,
  convertPeerDependenciesTreeToHTMLDependencyJSONs,
  findOnlyFrameworkModuleConfig,
  resolveModuleInfo,
} from "widget-up-utils";
import { convertPeerDependenciesToDependencyTree } from "./convertPeerDependenciesToDependencyTree";

export type GenStartPlgOptions = {
  processStartParams?: (params: StartParamsJSON) => StartParamsJSON;
};

export function genStart({ processStartParams }: GenStartPlgOptions): Plugin {
  let once = false;

  const peerDependTreeManager = PeerDependTreeManager.getInstance();
  const demosManager = DemosManager.getInstance();

  const build = () => {
    const pathManager = PathManager.getInstance();
    const configManager = ConfigManager.getInstance();

    const packageConfig = configManager.getPackageConfig();

    const outputPath = path.join(
      pathManager.distServerScriptsRelativePath,
      "start.js"
    );

    const demoDatas = demosManager.getDemoDataList();
    const frameworkModule = findOnlyFrameworkModuleConfig({
      cwd: pathManager.cwdPath,
    });

    const connectorModuleName = convertFrameworkModuleNameToConnectorModuleName(
      frameworkModule.name,
      frameworkModule.version
    );

    const connectorModuleConfig = resolveModuleInfo({
      cwd: pathManager.modulePath,
      name: connectorModuleName,
    });

    const connectorDepNode = convertConnectorModuleToDependencyTreeNodeJSON(
      frameworkModule,
      pathManager.serverConnectorsUrl,
      pathManager.getServerScriptFileName(
        connectorModuleName,
        connectorModuleConfig.packageJSON.version
      )
    );
    const config = configManager.getConfig();

    const deps = [connectorDepNode].map((input) => {
      return {
        ...input,
        depends: demoDatas.map((demo) => ({
          name: demo.config.menuTitle,
          version: packageConfig.version,
          scriptSrc: `() => '${pathManager.getDemoLibServerUrl(demo.path)}'`,
          linkHref: `() => ''`,
          depends: [
            {
              name: packageConfig.name,
              version: packageConfig.version,
              scriptSrc: `() => '/index.js'`,
              linkHref: `() => ${config.css ? "/index.css" : ""}`,
              depends: convertPeerDependenciesToDependencyTree(
                peerDependTreeManager.getDependenciesTree(),
                config.umd.allExternalDependencies
              ),
              asdf: convertPeerDependenciesTreeToHTMLDependencyJSONs({
                peerDependenciesTree:
                  peerDependTreeManager.getDependenciesTree(),
                serverLibsUrl: pathManager.serverLibsUrl,
                getServerScriptFileName: pathManager.getServerScriptFileName,
                getServerStyleFileName: pathManager.getServerStyleFileName,
                externalDependencies: config.umd.allExternalDependencies,
              }),
            },
          ],
        })) as HTMLDependencyJSON[],
      };
    });

    let params: StartParamsJSON = {
      dependencies: deps,
    };

    params = processStartParams?.(params) ?? params;

    let content = `WidgetUpRuntime.start(${JSON.stringify(params, null, 2)});`;

    content = content
      // 把字符串转为函数代码
      .replace(/"(scriptSrc|linkHref)": "(.*)"/g, '"$1": $2')
      // 去除内部的转义 \"
      .replace(/\\"/g, '"');

    fs.ensureDirSync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, content, "utf-8");
    console.log(`Generated start.js at ${outputPath}`);
  };

  demosManager.watch(() => {
    build();
  });

  peerDependTreeManager.watch(() => {
    build();
  });

  return {
    name: "gen-start",
    buildStart() {
      if (once) return;

      once = true;
      build();
    },
  };
}
