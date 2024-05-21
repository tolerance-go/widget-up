import { ConfigManager } from "@/src/managers/configManager";
import { PathManager } from "@/src/managers/pathManager";
import { getConnectorGlobalName } from "@/src/utils/getConnectorGlobalName";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import {
  findOnlyFrameworkModule,
  resolveModuleInfo,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";

interface GenServerInputsOptions {}

export function genServerInputs({}: GenServerInputsOptions): Plugin {
  const configManager = ConfigManager.getInstance();
  const pathManager = PathManager.getInstance();

  let once = false;

  const build = () => {
    const frameworkModule = findOnlyFrameworkModule({
      cwd: pathManager.cwdPath,
    });

    const outputPath = pathManager.distServerConnectorsRelativePath;

    fs.ensureDirSync(outputPath);

    const connectorModuleInfo = resolveModuleInfo({
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
