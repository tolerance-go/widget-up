import { DemosManager } from "@/src/getDemosManager";
import { InputNpmManager } from "@/src/getInputNpmManager";
import { PathManager } from "@/src/getPathManager";
import { PeerDependTreeManager } from "@/src/getPeerDependTreeManager";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { normalizePath } from "@/src/utils/normalizePath";
import { replaceFileExtension } from "@/src/utils/replaceFileExtension";
import { DependencyTreeNodeJson } from "@/types";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import { PackageJson } from "widget-up-utils";
import { convertPeerDependenciesToDependencyTree } from "./convertPeerDependenciesToDependencyTree";
import { getInputByFrame } from "../../utils/getInputByFrame";

interface GenStartOptions {
  outputPath: string;
  demosManager: DemosManager;
  packageConfig: PackageJson;
  peerDependTreeManager: PeerDependTreeManager;
  inputNpmManager: InputNpmManager;
  pathManager: PathManager;
}

export function genStart({
  outputPath,
  demosManager,
  packageConfig,
  peerDependTreeManager,
  inputNpmManager,
  pathManager,
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
          scriptSrc: `() => '${normalizePath(
            replaceFileExtension(
              path.join(
                "/demos",
                path.relative(pathManager.demosPath, demo.path)
              ),
              ".js"
            )
          )}'`,
          depends: [
            {
              name: packageConfig.name,
              version: packageConfig.version,
              scriptSrc: `() => '/index.js'`,
              linkHref: `() => ''`,
              depends: convertPeerDependenciesToDependencyTree(
                peerDependTreeManager.getDependenciesTree()
              ),
            },
          ],
        })) as DependencyTreeNodeJson[],
      };
    });

    let content = `WidgetUpRuntime.start({dependencies: [${JSON.stringify(
      deps,
      null,
      2
    )}]});`;

    content = content.replace(/"(scriptSrc|linkHref)": "(.*)"/g, "$1: $2");

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
