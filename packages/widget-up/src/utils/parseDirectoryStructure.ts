import fs from "fs";
import path from "path";

export interface DirectoryStructure {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: DirectoryStructure[];
}

export function parseDirectoryStructure(dirPath: string): DirectoryStructure {
  // Check if the path exists and it is a directory
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(`The path ${dirPath} is not a valid directory.`);
  }

  // Helper function to recursively parse the directory
  function parseDirectory(currentPath: string): DirectoryStructure {
    const entryStats = fs.statSync(currentPath);

    if (entryStats.isDirectory()) {
      const directory: DirectoryStructure = {
        name: path.basename(currentPath),
        type: "directory",
        children: [],
        path: currentPath,
      };
      // Read all items in the directory
      fs.readdirSync(currentPath).forEach((entry) => {
        directory.children?.push(parseDirectory(path.join(currentPath, entry)));
      });
      return directory;
    } else {
      return {
        name: path.basename(currentPath),
        type: "file",
        path: currentPath,
      };
    }
  }

  return parseDirectory(dirPath);
}
