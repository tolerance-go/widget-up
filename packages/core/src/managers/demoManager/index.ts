import { parseDirectoryStructure } from "widget-up-utils";
import { DemoFileData } from "@/types";
import { EventEmitter } from "events";
import nodeFs from "fs";
import nodePath from "path";
import { IdentifierManager } from "../identifierManager";
import { PathManager } from "../pathManager";
import { convertDirectoryToDemoData } from "./convertDirectoryToDemoData";
import { logger } from "./logger";

export class DemoManager extends EventEmitter {
  private static instance: DemoManager | null = null;
  private folderPath: string;
  private demos: DemoFileData[] = [];
  private fs: typeof nodeFs;
  private path: typeof nodePath;
  private pathManager: PathManager;
  private fsWatcher: nodeFs.FSWatcher | null = null;

  public static getInstance(): DemoManager {
    if (!DemoManager.instance) {
      DemoManager.instance = new DemoManager();
    }
    return DemoManager.instance;
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
    this.demos = [];
    this.pathManager = pathManager;

    this.loadInitialDirectoryStructure();
    this.watchFolder();
  }

  private async loadInitialDirectoryStructure(): Promise<void> {
    try {
      this.convertDatas();

      logger.log("loadInitialDirectoryStructure");
      logger.info({
        "this.demos": this.demos,
      });

      this.emit("initialized", this.demos);
    } catch (error) {
      this.emit("error", error);
    }
  }

  private watchFolder(): void {
    if (this.fs.existsSync(this.folderPath)) {
      this.fsWatcher = this.fs.watch(
        this.folderPath,
        { recursive: true },
        async (eventType, filename) => {
          if (filename) {
            // 当检测到变化时重新加载目录结构
            try {
              this.convertDatas();
              this.emit("change", this.demos);
            } catch (error) {
              this.emit("error", error);
            }
          }
        }
      );
    }
  }

  public getDemos(): DemoFileData[] {
    return this.demos;
  }

  /**
   * @returns 返回叶子节点的 demo 数据列表
   */
  public getDemoList(): DemoFileData[] {
    const leafDatas: DemoFileData[] = [];

    // 递归检查每个 DemoData，判断是否为叶子节点
    const checkLeaves = (demoData: DemoFileData) => {
      if (!demoData.children || demoData.children.length === 0) {
        // 没有子节点，是叶子节点
        leafDatas.push(demoData);
      } else {
        // 如果有子节点，递归检查子节点
        demoData.children.forEach((child) => checkLeaves(child));
      }
    };

    // 对所有存储的 DemoData 进行检查
    this.demos.forEach((demoData) => checkLeaves(demoData));

    return leafDatas;
  }

  private convertDatas() {
    if (this.fs.existsSync(this.folderPath)) {
      const directoryStructure = parseDirectoryStructure(this.folderPath);

      this.demos = convertDirectoryToDemoData(
        directoryStructure?.children ?? [],
        this.pathManager,
        this.fs,
        this.path
      );
    }
  }

  // 注册监听依赖树变化的回调函数
  public watch(callback: (data: DemoFileData[]) => void): () => void {
    this.on("change", callback);
    return () => this.removeListener("change", callback); // 返回一个取消监听的函数
  }
}
