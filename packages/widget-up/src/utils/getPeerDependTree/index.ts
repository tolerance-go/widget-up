import nodeFs from "fs";
import nodePath from "path";

interface PeerDependenciesTree {
  [packageName: string]: {
    version: string;
    peerDependencies?: PeerDependenciesTree;
  };
}

function getPeerDependTree(
  options: { cwd: string },
  {
    fs = nodeFs,
    path = nodePath,
  }: {
    fs: typeof import("fs");
    path: typeof import("path");
  }
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
    }

    const peerDependencies = packageJson?.peerDependencies || {};
    for (const [pkg, version] of Object.entries(peerDependencies)) {
      if (!parentTree[pkg]) {
        parentTree[pkg] = { version: version as string };
        const dependencyDir = path.join(dir, "node_modules", pkg);
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
