import { PathManager } from "@/src/managers/PathManager";
import { ConfigManager } from "@/src/managers/getConfigManager";
import { InputNpmManager } from "@/src/managers/getInputNpmManager";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { getInputByFrameStack } from "@/src/utils/getInputByFrameStack";
import { getInputGlobalName } from "@/src/utils/getInputGlobalName";
import { resolveNpmInfo } from "@/src/utils/resolveNpmInfo";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import {
  semverToIdentifier,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";

interface GenServerInputsOptions {
  inputNpmManager: InputNpmManager;
  configManager: ConfigManager;
  pathManager: PathManager;
}

export function genServerInputs({
  inputNpmManager,
  configManager,
  pathManager,
}: GenServerInputsOptions): Plugin {
  let once = false;

  const build = () => {
    const outputPath = pathManager.distServerConnectorsRelativePath;
    const techStack = detectTechStack();
    const input = getInputByFrameStack(techStack, inputNpmManager);
    fs.ensureDirSync(outputPath);

    const inputNpmInfo = resolveNpmInfo({
      cwd: pathManager.rootPath,
      name: input.name,
    });

    let content = fs.readFileSync(inputNpmInfo.moduleEntryPath, "utf-8");

    const frameInfo = detectTechStack();

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
          globalVar: getInputGlobalName(frameInfo),
          scopeVar: getInputGlobalName(frameInfo),
        },
      ],
    });

    content = wrapUMDAsyncEventCode({
      eventId: pathManager.getInputLibUrl(
        inputNpmInfo.packageJson.name,
        inputNpmInfo.packageJson.version
      ),
      scriptContent: content,
      eventBusPath: "WidgetUpRuntime.globalEventBus",
    });

    fs.writeFileSync(
      path.join(
        outputPath,
        `${inputNpmInfo.packageJson.name}_${semverToIdentifier(
          inputNpmInfo.packageJson.version
        )}.js`
      ),
      content,
      "utf-8"
    );
  };

  configManager.watch(() => {
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
