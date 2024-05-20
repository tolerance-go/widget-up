import { parseDirectoryStructure } from "widget-up-utils";
import { DemoData } from "@/types";
import { EventEmitter } from "events";
import nodeFs from "fs";
import nodePath from "path";
import { IdentifierManager } from "../identifierManager";
import { PathManager } from "../pathManager";
import { convertDirectoryToDemoData } from "./convertDirectoryToDemoData";

export class DemosManager extends EventEmitter {
  private static instance: DemosManager | null = null;
  private folderPath: string;
  private demoDatas: DemoData[] = [];
  private fs: typeof nodeFs;
  private path: typeof nodePath;
  private pathManager: PathManager;
  private fsWatcher: nodeFs.FSWatcher | null = null;

  public static getInstance(): DemosManager {
    if (!DemosManager.instance) {
      DemosManager.instance = new DemosManager();
    }
    return DemosManager.instance;
  }

  // 解除所有监听配置变化的回调函数
  static dispose() {
    if (this.instance?.fsWatcher) {
      this.instance.fsWatcher.close();
      this.instance.fsWatcher = null;
    }
  }

  constructor(options?: { fs?: typeof nodeFs; path?: typeof nodePath }) {
    const { fs = nodeFs, path = nodePath } = options ?? {};

    super();

    const identifierManager = IdentifierManager.getInstance();
    const pathManager = PathManager.getInstance();

    this.fs = fs;
    this.path = path;
    this.folderPath = this.path.resolve(identifierManager.demosFolderName);
    this.demoDatas = [];
    this.pathManager = pathManager;

    this.loadInitialDirectoryStructure();
    this.watchFolder();
  }

  private async loadInitialDirectoryStructure(): Promise<void> {
    try {
      this.convertDatas();
      this.emit("initialized", this.demoDatas);
    } catch (error) {
      this.emit("error", error);
    }
  }

  private watchFolder(): void {
    this.fsWatcher = this.fs.watch(
      this.folderPath,
      { recursive: true },
      async (eventType, filename) => {
        if (filename) {
          // 当检测到变化时重新加载目录结构
          try {
            this.convertDatas();
            this.emit("change", this.demoDatas);
          } catch (error) {
            this.emit("error", error);
          }
        }
      }
    );
  }

  public getDemoDatas(): DemoData[] {
    return this.demoDatas;
  }

  /**
   * @returns 返回叶子节点的 demo 数据列表
   */
  public getDemoDataList(): DemoData[] {
    const leafDatas: DemoData[] = [];

    // 递归检查每个 DemoData，判断是否为叶子节点
    const checkLeaves = (demoData: DemoData) => {
      if (!demoData.children || demoData.children.length === 0) {
        // 没有子节点，是叶子节点
        leafDatas.push(demoData);
      } else {
        // 如果有子节点，递归检查子节点
        demoData.children.forEach((child) => checkLeaves(child));
      }
    };

    // 对所有存储的 DemoData 进行检查
    this.demoDatas.forEach((demoData) => checkLeaves(demoData));

    return leafDatas;
  }

  private convertDatas() {
    if (this.fs.existsSync(this.folderPath)) {
      const directoryStructure = parseDirectoryStructure(this.folderPath);

      this.demoDatas = convertDirectoryToDemoData(
        directoryStructure?.children ?? [],
        this.pathManager,
        this.fs,
        this.path
      );
    }
  }

  // 注册监听依赖树变化的回调函数
  public watch(callback: (data: DemoData[]) => void): () => void {
    this.on("change", callback);
    return () => this.removeListener("change", callback); // 返回一个取消监听的函数
  }
}
