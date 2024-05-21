import { ConfigManager } from "@/src/managers/configManager";
import { PathManager } from "@/src/managers/pathManager";
import { getConnectorGlobalName } from "@/src/utils/getConnectorGlobalName";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import {
  findOnlyFrameworkModule,
  resolveNpmInfo,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";

interface GenServerInputsOptions {
  configManager: ConfigManager;
  pathManager: PathManager;
}

export function genServerInputs({
  configManager,
  pathManager,
}: GenServerInputsOptions): Plugin {
  let once = false;

  const build = () => {
    const outputPath = pathManager.distServerConnectorsRelativePath;
    const frameworkModule = findOnlyFrameworkModule({
      cwd: pathManager.cwdPath,
    });

    fs.ensureDirSync(outputPath);

    const connectorModuleInfo = resolveNpmInfo({
      cwd: pathManager.modulePath,
      name: frameworkModule.name,
    });

    let content = fs.readFileSync(connectorModuleInfo.moduleEntryPath, "utf-8");

    content = wrapUMDAliasCode({
      scriptContent: content,
      imports: [
        {
          globalVar: "RuntimeComponent",
          scopeVar: "RuntimeComponent",
        },
      ],
      exports: [
        {
          globalVar: getConnectorGlobalName(
            frameworkModule.name,
            frameworkModule.version
          ),
          scopeVar: getConnectorGlobalName(
            frameworkModule.name,
            frameworkModule.version
          ),
        },
      ],
    });

    content = wrapUMDAsyncEventCode({
      eventId: pathManager.getInputLibUrl(
        connectorModuleInfo.packageJson.name,
        connectorModuleInfo.packageJson.version
      ),
      scriptContent: content,
      eventBusPath: "WidgetUpRuntime.globalEventBus",
    });

    fs.writeFileSync(
      path.join(
        outputPath,
        pathManager.getServerScriptFileName(
          connectorModuleInfo.packageJson.name,
          connectorModuleInfo.packageJson.version
        )
      ),
      content,
      "utf-8"
    );
  };

  configManager.watch(() => {
    build();
  });

  return {
    name: "genServerConnectors",
    buildStart() {
      if (once) return;

      once = true;
      build();
    },
  };
}
