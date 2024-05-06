import path from "path";

interface PeerDependenciesTree {
  [packageName: string]: {
    version: string;
    dependencies?: PeerDependenciesTree;
  };
}

type Dependencies = {
  fileSystem: typeof import("fs");
  pathUtility: typeof import("path");
};

function getPeerDependTree(
  options: { cwd: string },
  deps: Dependencies
): PeerDependenciesTree {
  const { cwd } = options;
  const { fileSystem, pathUtility } = deps;

  function findPeerDependencies(
    dir: string,
    parentTree: PeerDependenciesTree = {}
  ): PeerDependenciesTree {
    const packageJsonPath = pathUtility.join(dir, "package.json");
    let packageJson;
    try {
      packageJson = JSON.parse(
        fileSystem.readFileSync(packageJsonPath, "utf8")
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error reading package.json in ${dir}: ${error.message}`);
      } else {
        console.error(`An unexpected error occurred: ${error}`);
      }
    }

    const peerDependencies = packageJson.peerDependencies || {};
    for (const [pkg, version] of Object.entries(peerDependencies)) {
      if (!parentTree[pkg]) {
        parentTree[pkg] = { version: version as string };
        const dependencyDir = pathUtility.join(dir, "node_modules", pkg);
        parentTree[pkg].dependencies = findPeerDependencies(dependencyDir);
      }
    }

    return parentTree;
  }

  return findPeerDependencies(cwd);
}

export default getPeerDependTree;
