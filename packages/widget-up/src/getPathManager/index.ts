import path from "path";

interface PathManagerOptions {
  cwdPath: string;
  rootPath: string;
}

export class PathManager {
  public cwdPath: string;
  public rootPath: string;
  public demosPath: string;

  constructor(options: PathManagerOptions) {
    this.cwdPath = options.cwdPath;
    this.rootPath = options.rootPath;

    this.demosPath = path.join(this.cwdPath, "demos");
  }
}

export default function getPathManager(
  options: PathManagerOptions
): PathManager {
  return new PathManager(options);
}
