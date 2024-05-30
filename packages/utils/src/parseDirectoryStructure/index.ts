import nodeFs from "fs";
import nodePath from "path";

export interface DirectoryStructure {
  name: string;
  type: "file" | "directory";
  path: string;
  relPath: string;
  children?: DirectoryStructure[];
}

export function parseDirectoryStructure(
  dirPath: string,
  fs = nodeFs,
  path = nodePath
): DirectoryStructure {
  // Check if the path exists and it is a directory
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(`The path ${dirPath} is not a valid directory.`);
  }

  // Helper function to recursively parse the directory
  function parseDirectory(
    currentPath: string,
    basePath: string
  ): DirectoryStructure {
    const entryStats = fs.statSync(currentPath);
    const relativePath =
      currentPath === basePath ? "" : path.relative(basePath, currentPath);

    if (entryStats.isDirectory()) {
      const directory: DirectoryStructure = {
        name: path.basename(currentPath),
        type: "directory",
        path: currentPath,
        relPath: relativePath,
        children: [],
      };
      // Read all items in the directory
      fs.readdirSync(currentPath).forEach((entry) => {
        directory.children?.push(
          parseDirectory(path.join(currentPath, entry), basePath)
        );
      });
      return directory;
    } else {
      return {
        name: path.basename(currentPath),
        type: "file",
        path: currentPath,
        relPath: relativePath,
      };
    }
  }

  return parseDirectory(dirPath, dirPath);
}
