import { ConfigManager } from "@/src/getConfigManager";
import { InputNpmManager } from "@/src/getInputNpmManager";
import { PathManager } from "@/src/getPathManager";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { getInputByFrame } from "@/src/utils/getInputByFrame";
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
    const techStacks = detectTechStack();
    const inputs = getInputByFrame(techStacks, inputNpmManager);
    fs.ensureDirSync(outputPath);

    inputs.forEach((input) => {
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
    });
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
