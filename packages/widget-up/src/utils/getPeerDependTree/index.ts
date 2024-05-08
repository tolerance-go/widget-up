import nodeFs from "fs";
import nodePath from "path";
import { VersionData } from "widget-up-utils";

export interface PeerDependenciesTree {
  [packageName: string]: {
    version: VersionData;
    peerDependencies?: PeerDependenciesTree;
  };
}

function getPeerDependTree(
  options: { cwd: string },
  {
    fs = nodeFs,
    path = nodePath,
  }: {
    fs?: typeof import("fs");
    path?: typeof import("path");
  } = {}
): PeerDependenciesTree {
  const { cwd } = options;

  function findPeerDependencies(
    dir: string,
    parentTree: PeerDependenciesTree = {}
  ): PeerDependenciesTree {
    const packageJsonPath = path.join(dir, "package.json");
    let packageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error reading package.json in ${dir}: ${error.message}`);
      } else {
        console.error(`An unexpected error occurred: ${error}`);
      }
      return parentTree;
    }

    const peerDependencies = packageJson?.peerDependencies || {};
    for (const [pkg, range] of Object.entries(peerDependencies)) {
      if (!parentTree[pkg]) {
        const dependencyDir = path.join(dir, "node_modules", pkg);
        const depPackageJsonPath = path.join(dependencyDir, "package.json");
        let depPackageJson;
        try {
          depPackageJson = JSON.parse(
            fs.readFileSync(depPackageJsonPath, "utf8")
          );
        } catch (error) {
          console.error(
            `Error reading package.json for dependency ${pkg} in ${dependencyDir}: ${error}`
          );
          continue;
        }

        const exactVersion = depPackageJson?.version || "unknown";
        parentTree[pkg] = {
          version: {
            exact: exactVersion,
            range: range as string,
          },
        };

        // Recurse to find nested peer dependencies
        parentTree[pkg].peerDependencies = findPeerDependencies(
          dependencyDir,
          parentTree[pkg].peerDependencies
        );
      }
    }

    return parentTree;
  }

  return findPeerDependencies(cwd);
}

export default getPeerDependTree;
