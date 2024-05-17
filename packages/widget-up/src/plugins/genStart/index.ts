import { ConfigManager } from "@/src/managers/getConfigManager";
import { DemosManager } from "@/src/managers/getDemosManager";
import { InputNpmManager } from "@/src/managers/getInputNpmManager";
import { PeerDependTreeManager } from "@/src/managers/getPeerDependTreeManager";
import { detectTechStack } from "@/src/utils/detectTechStack";
import { DependencyTreeNodeJson } from "@/types";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import { PackageJson } from "widget-up-utils";
import { getInputByFrameStack } from "../../utils/getInputByFrameStack";
import { convertPeerDependenciesToDependencyTree } from "./convertPeerDependenciesToDependencyTree";
import { PathManager } from "@/src/managers/pathManager";

interface GenStartOptions {
  demosManager: DemosManager;
  packageConfig: PackageJson;
  peerDependTreeManager: PeerDependTreeManager;
  inputNpmManager: InputNpmManager;
  pathManager: PathManager;
  configManager: ConfigManager;
}

export function genStart({
  demosManager,
  packageConfig,
  peerDependTreeManager,
  inputNpmManager,
  pathManager,
  configManager,
}: GenStartOptions): Plugin {
  let once = false;

  const build = () => {
    const outputPath = path.join(
      pathManager.distServerScriptsRelativePath,
      "start.js"
    );

    const demoDatas = demosManager.getDemoDataList();
    const techStacks = detectTechStack();
    const input = getInputByFrameStack(techStacks, inputNpmManager);
    const config = configManager.getConfig();

    const deps = [input].map((input) => {
      return {
        ...input,
        depends: demoDatas.map((demo) => ({
          name: demo.config.menuTitle,
          version: packageConfig.version,
          scriptSrc: `() => '${pathManager.getDemoLibServerUrl(demo.path)}'`,
          linkHref: `() => ''`,
          depends: [
            {
              name: packageConfig.name,
              version: packageConfig.version,
              scriptSrc: `() => '/index.js'`,
              linkHref: `() => ''`,
              depends: convertPeerDependenciesToDependencyTree(
                peerDependTreeManager.getDependenciesTree(),
                config.umd.externalDependencies
              ),
            },
          ],
        })) as DependencyTreeNodeJson[],
      };
    });

    let content = `WidgetUpRuntime.start({dependencies: ${JSON.stringify(
      deps,
      null,
      2
    )}});`;

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
