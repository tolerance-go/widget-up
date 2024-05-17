import { normalizePath } from "@/src/utils/normalizePath";
import path from "path";
import { semverToIdentifier } from "widget-up-utils";

interface PathManagerOptions {
  cwdPath: string;
  rootPath: string;
}

export class PathManager {
  private static instance: PathManager;

  public static createInstance(options: PathManagerOptions) {
    if (!PathManager.instance) {
      PathManager.instance = new PathManager(options);
    }
  }

  public static getInstance(): PathManager {
    if (!PathManager.instance) {
      throw new Error("没有初始化");
    }
    return PathManager.instance;
  }

  public connectorsFolderName: string = "connectors";

  public widgetUpRuntimeName: string = "runtime";

  public cwdPath: string;
  public rootPath: string;
  public demosAbsPath: string;
  public distAbsPath: string;
  public distServerAbsPath: string;
  public tplsAbsPath: string;

  public distServerRelativePath: string;

  /** 服务端的 libs 路径 */
  public distServerLibsAbsPath: string;
  /** 服务端 libs 的请求地址 */
  public serverLibsUrl: string;

  public serverConnectorsUrl: string;

  /** 本地服务端的资源文件夹  */
  public distServerAssetsAbsPath: string;
  public distServerScriptsAbsPath: string;
  public distServerScriptsRelativePath: string;
  public distServerConnectorsAbsPath: string;
  public distServerConnectorsRelativePath: string;

  constructor(options: PathManagerOptions) {
    this.cwdPath = options.cwdPath;
    this.rootPath = options.rootPath;
    this.demosAbsPath = path.join(this.cwdPath, "demos");
    this.distAbsPath = path.join(this.cwdPath, "dist");
    this.distServerAbsPath = path.join(this.distAbsPath, "server");
    this.tplsAbsPath = path.join(this.rootPath, "tpls");
    this.distServerLibsAbsPath = path.join(this.distServerAbsPath, "libs");
    this.distServerConnectorsAbsPath = path.join(
      this.distServerAbsPath,
      this.connectorsFolderName
    );
    this.distServerAssetsAbsPath = path.join(this.distServerAbsPath, "assets");
    this.distServerScriptsAbsPath = path.join(
      this.distServerAbsPath,
      "scripts"
    );
    this.serverLibsUrl = "/libs";
    this.serverConnectorsUrl = `/${this.connectorsFolderName}`;
    this.distServerRelativePath = path.relative(
      this.cwdPath,
      this.distServerAbsPath
    );
    this.distServerScriptsRelativePath = path.relative(
      this.cwdPath,
      this.distServerScriptsAbsPath
    );
    this.distServerConnectorsRelativePath = path.relative(
      this.cwdPath,
      this.distServerConnectorsAbsPath
    );
  }

  /**
   * 获取外部依赖在服务器端的请求路径
   */
  public getDependsLibServerUrl(depName: string, version: string) {
    return `${this.serverLibsUrl}/${depName}_${semverToIdentifier(version)}.js`;
  }

  /**
   * 获取 input lib 的服务器请求地址
   */
  public getInputLibUrl(depName: string, version: string) {
    return `${this.serverConnectorsUrl}/${depName}_${semverToIdentifier(
      version
    )}.js`;
  }

  /**
   * 获取 demo lib 的服务器请求地址
   */
  public getDemoLibServerUrl(demoCaseAbsPath: string) {
    const input = path.relative(this.cwdPath, demoCaseAbsPath);
    const inputPathData = path.parse(input);

    return normalizePath(
      path.join("/", inputPathData.dir, inputPathData.name, "index.js")
    );
  }

  /**
   * 获取生成 demo lib 的服务器本地文件相对路径
   */
  public getDemoLibServerRelativePath(
    /**
     * 这个路径是本地 demos 用例下文件的路径
     *
     * eg: demos/group/demo3.ts
     */
    demoCaseAbsPath: string
  ) {
    const input = path.relative(this.cwdPath, demoCaseAbsPath);
    const inputPathData = path.parse(input);

    return path.join(
      this.distServerRelativePath,
      inputPathData.dir,
      inputPathData.name,
      "index.js"
    );
  }
}
