import nodeFs from "fs";
import nodePath from "path";
import { VersionData } from "widget-up-utils";

export type PeerDependenciesNode = {
  name: string;
  version: VersionData;
  peerDependencies?: PeerDependenciesTree;
};

export interface PeerDependenciesTree {
  [packageName: string]: PeerDependenciesNode;
}

function getPeerDependTree(
  options: { cwd: string; rootPackageName?: string },
  {
    fs = nodeFs,
    path = nodePath,
  }: {
    fs?: typeof import("fs");
    path?: typeof import("path");
  } = {}
): PeerDependenciesTree {
  const { cwd, rootPackageName } = options;

  function findPeerDependencies(
    dir: string,
    parentTree: PeerDependenciesTree = {},
    isFirstLevel: boolean = true
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
      if (isFirstLevel && rootPackageName && pkg !== rootPackageName) {
        continue; // Skip if rootPackageName is specified and does not match the current package at first level
      }

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
          name: pkg,
          version: {
            exact: exactVersion,
            range: range as string,
          },
        };

        // Recurse to find nested peer dependencies without first level check
        parentTree[pkg].peerDependencies = findPeerDependencies(
          dependencyDir,
          parentTree[pkg].peerDependencies,
          false
        );
      }
    }

    return parentTree;
  }

  return findPeerDependencies(cwd);
}

export default getPeerDependTree;
