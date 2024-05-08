import { DemoData, DemoFileConfig, DemoMenuItem } from "@/types";
import { EventEmitter } from "events";
import {
  DirectoryStructure,
  parseDirectoryStructure,
} from "../utils/parseDirectoryStructure";
import realFs from "fs";
import realPath from "path";
import { convertDirectoryToDemo } from "./convertDirectoryToDemo";

export class DemosManager extends EventEmitter {
  private folderPath: string;
  private demoDatas: DemoData[] = [];
  private fs: typeof realFs;
  private path: typeof realPath;

  constructor(folderPath = "./demos", fs = realFs, path = realPath) {
    super();
    this.fs = fs;
    this.path = path;
    this.folderPath = this.path.resolve(folderPath);
    this.demoDatas = [];

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
    this.fs.watch(
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

      this.demoDatas = convertDirectoryToDemo(
        directoryStructure?.children ?? [],
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

export const getDemosManager = ({ folderPath }: { folderPath: string }) => {
  return new DemosManager(folderPath);
};
