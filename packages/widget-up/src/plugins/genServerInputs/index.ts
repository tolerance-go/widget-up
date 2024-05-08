import { ConfigManager } from "@/src/getConfigManager";
import { InputNpmManager } from "@/src/getInputNpmManager";
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
}

export function genServerInputs({
  outputPath,
  inputNpmManager,
  configManager,
}: GenServerInputsOptions): Plugin {
  let once = false;

  const build = () => {
    const techStacks = detectTechStack();
    const inputs = getInputByFrame(techStacks, inputNpmManager);
    fs.ensureDirSync(path.dirname(outputPath));

    inputs.forEach((input) => {
      const inputNpmInfo = resolveNpmInfo({
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
