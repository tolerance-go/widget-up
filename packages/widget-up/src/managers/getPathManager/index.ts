import path from "path";
import fs from "fs-extra";

interface PathManagerOptions {
  cwdPath: string;
  rootPath: string;
  buildEnv: "development" | "production";
}

export class PathManager {
  public cwdPath: string;
  public rootPath: string;
  public demosPath: string;
  public distPath: string;
  public serverPath: string;
  public tplsPath: string;

  constructor(options: PathManagerOptions) {
    this.cwdPath = options.cwdPath;
    this.rootPath = options.rootPath;
    this.demosPath = path.join(this.cwdPath, "demos");
    this.distPath = path.join(this.cwdPath, "dist");
    this.serverPath = path.join(this.distPath, "server");
    this.tplsPath = path.join(this.rootPath, "tpls");
  }
}

export default function getPathManager(
  options: PathManagerOptions
): PathManager {
  return new PathManager(options);
}
