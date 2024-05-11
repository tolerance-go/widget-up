import path from "path";
import { semverToIdentifier } from "widget-up-utils";

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

  /** 服务端的 libs 路径 */
  public serverLibsPath: string;
  /** 服务端 libs 的请求地址 */
  public serverLibsUrl: string;

  constructor(options: PathManagerOptions) {
    this.cwdPath = options.cwdPath;
    this.rootPath = options.rootPath;
    this.demosPath = path.join(this.cwdPath, "demos");
    this.distPath = path.join(this.cwdPath, "dist");
    this.serverPath = path.join(this.distPath, "server");
    this.tplsPath = path.join(this.rootPath, "tpls");
    this.serverLibsPath = path.join(this.serverPath, "libs");
    this.serverLibsUrl = "/libs";
  }

  /**
   * 获取外部依赖在服务器端的路径
   */
  public getServerLibUrl(depName: string, version: string) {
    return `${this.serverLibsUrl}/${depName}_${semverToIdentifier(version)}.js`;
  }
}

export default function getPathManager(
  options: PathManagerOptions
): PathManager {
  return new PathManager(options);
}
