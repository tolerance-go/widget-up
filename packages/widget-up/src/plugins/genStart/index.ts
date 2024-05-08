import { Plugin } from "rollup";
import fs from "fs-extra";
import path from "path";
import { DependencyTreeNode } from "widget-up-runtime";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { getInputByFrame } from "./getInputByFrame";
import { DemosFolderManager } from "@/src/getDemosFolderManager";
import { PackageJson } from "widget-up-utils";
import { PeerDependTreeManager } from "@/src/getPeerDependTreeManager";
import { convertPeerDependenciesToDependencyTree } from "./convertPeerDependenciesToDependencyTree";

interface GenStartOptions {
  outputPath?: string;
  dependencies: DependencyTreeNode[];
  demosFolderManager: DemosFolderManager;
  packageConfig: PackageJson;
  peerDependTreeManager: PeerDependTreeManager;
}

export function genStart(options: GenStartOptions): Plugin {
  const {
    outputPath = "./dist/start.js",
    dependencies,
    demosFolderManager,
    packageConfig,
    peerDependTreeManager,
  } = options;

  let once = false;

  const build = () => {
    const demoDatas = demosFolderManager.getDemoDatas();
    const techStacks = detectTechStack();
    const inputs = getInputByFrame(techStacks);

    const deps = inputs.map((input) => {
      return {
        ...input,
        depends: demoDatas.map((demo) => ({
          name: demo.config.name,
          version: packageConfig.version,
          scriptSrc: () => `/demos/${demo.path}/index.js`,
          depends: convertPeerDependenciesToDependencyTree(
            peerDependTreeManager.getDependenciesTree()
          ),
        })),
      };
    });
    const content = `WidgetUpRuntime.start({dependencies: [${deps}]});`;
    fs.ensureDirSync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, content, "utf-8");
    console.log(`Generated start.js at ${outputPath}`);
  };

  demosFolderManager.watch(() => {
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
