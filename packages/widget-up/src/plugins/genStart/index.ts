// genStart.ts
import { Plugin } from "rollup";
import fs from "fs-extra";
import path from "path";
import { DependencyTreeNode } from "widget-up-runtime";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { getInputByFrame } from "./getInputByFrame";

interface GenStartOptions {
  outputPath?: string;
  dependencies: DependencyTreeNode[];
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
  const { outputPath = "./dist/start.js", dependencies } = options;

  return {
    name: "gen-start",
    buildStart() {
      const techStacks =  detectTechStack();
      const inputs = getInputByFrame(techStacks);
      const depsString = resolveDependencies(dependencies);
      const content = `WidgetUpRuntime.start({dependencies: [${depsString}]});`;
      fs.ensureDirSync(path.dirname(outputPath));
      fs.writeFileSync(outputPath, content, "utf-8");
      console.log(`Generated start.js at ${outputPath}`);
    },
  };
}
