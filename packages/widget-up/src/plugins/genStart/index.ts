import { Plugin } from "rollup";
import fs from "fs-extra";
import path from "path";
import { DependencyTreeNode } from "widget-up-runtime";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { getInputByFrame } from "./getInputByFrame";
import { DemosManager } from "@/src/getDemosManager";
import { PackageJson } from "widget-up-utils";
import { PeerDependTreeManager } from "@/src/getPeerDependTreeManager";
import { convertPeerDependenciesToDependencyTree } from "./convertPeerDependenciesToDependencyTree";
import { InputNpmManager } from "@/src/getInputNpmManager";

interface GenStartOptions {
  outputPath?: string;
  demosManager: DemosManager;
  packageConfig: PackageJson;
  peerDependTreeManager: PeerDependTreeManager;
  inputNpmManager: InputNpmManager;
}

export function genStart({
  outputPath = "./dist/start.js",
  demosManager,
  packageConfig,
  peerDependTreeManager,
  inputNpmManager,
}: GenStartOptions): Plugin {
  let once = false;

  const build = () => {
    const demoDatas = demosManager.getDemoDataList();
    const techStacks = detectTechStack();
    const inputs = getInputByFrame(techStacks, inputNpmManager);

    const deps = inputs.map((input) => {
      return {
        ...input,
        depends: demoDatas.map((demo) => ({
          name: demo.config.name,
          version: packageConfig.version,
          scriptSrc: () => `/demos/${demo.path}/index.js`,
          depends: [
            {
              name: packageConfig.name,
              version: packageConfig.version,
              depends: convertPeerDependenciesToDependencyTree(
                peerDependTreeManager.getDependenciesTree()
              ),
            },
          ],
        })),
      };
    });
    const content = `WidgetUpRuntime.start({dependencies: [${JSON.stringify(
      deps,
      null,
      2
    )}]});`;
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
