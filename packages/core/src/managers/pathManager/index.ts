import path from "path";
import { normalizePath, convertSemverVersionToIdentify } from "widget-up-utils";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { IdentifierManager } from "../identifierManager";
interface PathManagerOptions {
  cwdPath: string;
  modulePath: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PathManager {
  private static instance: PathManager;

  public static getInstance(): PathManager {
    if (!PathManager.instance) {
      const modulePath = path.join(__dirname, "..");
      const cwdPath = process.cwd();

      PathManager.instance = new PathManager({
        cwdPath,
        modulePath,
      });
    }
    return PathManager.instance;
  }

  private identifierManager: IdentifierManager;

  public widgetUpConfigAbsPath: string;
  public widgetUpConfigRelativePath: string;

  public cwdPath: string;
  public modulePath: string;
  public demosAbsPath: string;
  public demosRelPath: string;

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
    this.identifierManager = IdentifierManager.getInstance();

    this.cwdPath = options.cwdPath;
    this.modulePath = options.modulePath;
    this.demosAbsPath = path.join(
      this.cwdPath,
      this.identifierManager.demosFolderName
    );
    this.demosRelPath = path.join(".", this.identifierManager.demosFolderName);
    this.distAbsPath = path.join(this.cwdPath, "dist");
    this.distServerAbsPath = path.join(this.distAbsPath, "server");
    this.tplsAbsPath = path.join(this.modulePath, "tpls");
    this.distServerLibsAbsPath = path.join(this.distServerAbsPath, "libs");
    this.distServerConnectorsAbsPath = path.join(
      this.distServerAbsPath,
      this.identifierManager.connectorsFolderName
    );
    this.distServerAssetsAbsPath = path.join(this.distServerAbsPath, "assets");
    this.distServerScriptsAbsPath = path.join(
      this.distServerAbsPath,
      "scripts"
    );
    this.serverLibsUrl = "/libs";
    this.serverConnectorsUrl = `/${this.identifierManager.connectorsFolderName}`;
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
    this.widgetUpConfigRelativePath = `./${this.identifierManager.widgetUpConfigFileName}.json`;
    this.widgetUpConfigAbsPath = path.join(
      this.cwdPath,
      this.widgetUpConfigRelativePath
    );
  }

  /**
   * 获取外部依赖在服务器端的请求路径
   */
  public getDependsLibServerUrl(depName: string, version: string) {
    return `${this.serverLibsUrl}/${depName}_${convertSemverVersionToIdentify(
      version
    )}.js`;
  }

  /**
   * 获取 connector lib 的服务器请求地址
   */
  public getConnectorServerUrl(depName: string, version: string) {
    return `${
      this.serverConnectorsUrl
    }/${depName}_${convertSemverVersionToIdentify(version)}.js`;
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
  public convertDemoAbsPathToDemoLibServerRelativePath(
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

  public getServerFileBaseName(libName: string, version: string) {
    return `${libName}_${convertSemverVersionToIdentify(version)}`;
  }

  /** 拼服务器的 lib 的脚本文件名称 */
  public getServerScriptFileName(libName: string, version: string) {
    return `${this.getServerFileBaseName(libName, version)}.js`;
  }

  /** 拼服务器的 lib 的样式文件名称 */
  public getServerStyleFileName(libName: string, version: string) {
    return `${this.getServerFileBaseName(libName, version)}.css`;
  }
}
