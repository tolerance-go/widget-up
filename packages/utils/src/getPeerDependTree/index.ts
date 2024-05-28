import nodeFs from "fs";
import nodePath from "path";
import {
  PackageConfig,
  PeerDependenciesNode,
  PeerDependenciesTree,
} from "@/types";
import { getModuleEntryPaths } from "../getModuleEntryPaths";

export function getPeerDependTree(
  options: { cwd: string; includeRootPackage?: boolean },
  {
    fs = nodeFs,
    path = nodePath,
  }: {
    fs?: typeof import("fs");
    path?: typeof import("path");
  } = {}
): PeerDependenciesTree {
  const { cwd, includeRootPackage = false } = options;

  function findPeerDependencies(
    dir: string,
    parentTree: PeerDependenciesTree = {},
    rootDir: string
  ): PeerDependenciesTree {
    const packageJsonPath = path.join(dir, "package.json");
    let packageJson: PackageConfig;
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
        let dependencyDir = path.join(dir, "node_modules", pkg);
        let depPackageJsonPath = path.join(dependencyDir, "package.json");

        if (!fs.existsSync(depPackageJsonPath)) {
          // Try to find in root node_modules if not found in child package node_modules
          dependencyDir = path.join(rootDir, "node_modules", pkg);
          depPackageJsonPath = path.join(dependencyDir, "package.json");
        }

        let depPackageJson: PackageConfig;
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
          packageConfig: depPackageJson,
          hostModulePath: dependencyDir,
          moduleEntries: getModuleEntryPaths({
            modulePath: dependencyDir,
            packageConfig: depPackageJson,
          }),
        };

        // Recurse to find nested peer dependencies without first level check
        parentTree[pkg].peerDependencies = findPeerDependencies(
          dependencyDir,
          parentTree[pkg].peerDependencies,
          rootDir
        );
      }
    }

    return parentTree;
  }

  const tree = findPeerDependencies(cwd, {}, cwd);

  if (includeRootPackage) {
    const rootPackageJsonPath = path.join(cwd, "package.json");
    let rootPackageJson: PackageConfig;
    try {
      rootPackageJson = JSON.parse(
        fs.readFileSync(rootPackageJsonPath, "utf8")
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error reading root package.json in ${cwd}: ${error.message}`
        );
      } else {
        console.error(`An unexpected error occurred: ${error}`);
      }
      return tree;
    }

    const rootPackageName = rootPackageJson.name;
    const rootPackageVersion = rootPackageJson.version;

    if (rootPackageName && rootPackageVersion) {
      const rootPackageNode: PeerDependenciesNode = {
        name: rootPackageName,
        version: {
          exact: rootPackageVersion,
          range: rootPackageVersion,
        },
        peerDependencies: tree,
        packageConfig: rootPackageJson,
        hostModulePath: cwd,
        moduleEntries: getModuleEntryPaths({
          modulePath: cwd,
          packageConfig: rootPackageJson,
        }),
      };
      return { [rootPackageName]: rootPackageNode };
    }
  }

  return tree;
}
