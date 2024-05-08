import { DemoData, DemoFileConfig, DemoMenuItem } from "@/types";
import { EventEmitter } from "events";
import {
  DirectoryStructure,
  parseDirectoryStructure,
} from "../utils/parseDirectoryStructure";
import realFs from "fs";
import realPath from "path";
import { convertDirectoryToDemo } from "./convertDirectoryToDemo";

export class DemosFolderManager extends EventEmitter {
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
  public watch(
    callback: (data: DemoData[]) => void
  ): () => void {
    this.on("change", callback);
    return () => this.removeListener("change", callback); // 返回一个取消监听的函数
  }
}

export const getDemosFolderManager = ({
  folderPath,
}: {
  folderPath: string;
}) => {
  return new DemosFolderManager(folderPath);
};
