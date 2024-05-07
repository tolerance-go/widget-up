// genStart.ts
import { Plugin } from "rollup";
import fs from "fs-extra";
import path from "path";
import { DependencyTreeNode } from "widget-up-runtime";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { getInputByFrame } from "./getInputByFrame";
import { DemosFolderManager } from "@/src/getDemosFolderManager";
import { PackageJson } from "widget-up-utils";
import { PeerDependTreeManager } from "@/src/getPeerDependTreeManager";

interface GenStartOptions {
  outputPath?: string;
  dependencies: DependencyTreeNode[];
  demosFolderManager: DemosFolderManager;
  packageConfig: PackageJson;
  peerDependTreeManager: PeerDependTreeManager;
}

function resolveDependencies(dependencies: DependencyTreeNode[]): string {
  return dependencies
    .map((dep) => {
      const nestedDeps = dep.depends ? resolveDependencies(dep.depends) : "";
      return `
      {
        name: "${dep.name}",
        version: "${dep.version}",
        scriptSrc: ${dep.scriptSrc.toString()},
        depends: [${nestedDeps}]
      },
    `;
    })
    .join("");
}

export function genStart(options: GenStartOptions): Plugin {
  const {
    outputPath = "./dist/start.js",
    dependencies,
    demosFolderManager,
    packageConfig,
    peerDependTreeManager
  } = options;

  const demoDatas = demosFolderManager.getDemoDatas();
  const techStacks = detectTechStack();
  const inputs = getInputByFrame(techStacks);

  inputs.map((input) => {
    return {
      ...input,
      depends: demoDatas.map((demo) => ({
        name: demo.config.name,
        version: packageConfig.version,
        scriptSrc: () => `/demos/${demo.path}/index.js`,
        depends: peerDependTreeManager.getDependenciesTree(),
      })),
    };
  });

  return {
    name: "gen-start",
    buildStart() {
      const depsString = resolveDependencies(dependencies);
      const content = `WidgetUpRuntime.start({dependencies: [${depsString}]});`;
      fs.ensureDirSync(path.dirname(outputPath));
      fs.writeFileSync(outputPath, content, "utf-8");
      console.log(`Generated start.js at ${outputPath}`);
    },
  };
}
