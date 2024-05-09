import { ConfigManager } from "@/src/managers/getConfigManager";
import { InputNpmManager } from "@/src/managers/getInputNpmManager";
import { PathManager } from "@/src/managers/getPathManager";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { getInputByFrameStack } from "@/src/utils/getInputByFrameStack";
import { resolveNpmInfo } from "@/src/utils/resolveNpmInfo";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";

interface GenServerInputsOptions {
  outputPath: string;
  inputNpmManager: InputNpmManager;
  configManager: ConfigManager;
  pathManager: PathManager;
}

export function genServerInputs({
  outputPath,
  inputNpmManager,
  configManager,
  pathManager,
}: GenServerInputsOptions): Plugin {
  let once = false;

  const build = () => {
    const techStack = detectTechStack();
    const input = getInputByFrameStack(techStack, inputNpmManager);
    fs.ensureDirSync(outputPath);

    const inputNpmInfo = resolveNpmInfo({
      cwd: pathManager.rootPath,
      name: input.name,
    });

    const content = fs.readFileSync(inputNpmInfo.moduleEntryPath, "utf-8");

    fs.writeFileSync(
      path.join(outputPath, `${input.name}.js`),
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
