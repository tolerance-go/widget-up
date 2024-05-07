// genStart.ts
import { Plugin } from "rollup";
import fs from "fs-extra";
import path from "path";

interface Dependency {
  name: string;
  version: string;
  scriptSrc: (dep?: any) => string;
  depends?: Dependency[];
}

interface GenStartOptions {
  outputPath?: string;
  dependencies: Dependency[];
}

function resolveDependencies(dependencies: Dependency[]): string {
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
    name: "genStart",
    buildStart() {
      const depsString = resolveDependencies(dependencies);
      const content = `WidgetUpRuntime.start({dependencies: [${depsString}]});`;
      fs.ensureDirSync(path.dirname(outputPath));
      fs.writeFileSync(outputPath, content, "utf-8");
      console.log(`Generated start.js at ${outputPath}`);
    },
  };
}
