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
  private directoryStructure: DirectoryStructure | null = null;
  private demoDatas: DemoData[] = [];
  private fs: typeof realFs;
  private path: typeof realPath;

  constructor(folderPath = "./demos", fs = realFs, path = realPath) {
    super();
    this.fs = fs;
    this.path = path;
    this.folderPath = this.path.resolve(folderPath);
    this.directoryStructure = null;
    this.demoDatas = [];

    this.loadInitialDirectoryStructure();
    this.watchFolder();
  }

  private async loadInitialDirectoryStructure(): Promise<void> {
    try {
      this.convertDatas();
      this.emit("initialized", {
        directoryStructure: this.directoryStructure,
        demoDatas: this.demoDatas,
      });
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
            this.emit("change", {
              directoryStructure: this.directoryStructure,
              demoDatas: this.demoDatas,
            });
          } catch (error) {
            this.emit("error", error);
          }
        }
      }
    );
  }

  public getDirectoryStructure(): DirectoryStructure | null {
    return this.directoryStructure;
  }

  public getDemoDatas(): DemoData[] {
    return this.demoDatas;
  }

  private convertDatas() {
    if (this.fs.existsSync(this.folderPath)) {
      this.directoryStructure = parseDirectoryStructure(this.folderPath);
    }

    this.demoDatas = convertDirectoryToDemo(
      this.directoryStructure?.children ?? [],
      this.fs,
      this.path
    );
  }
}

export const getDemosFolderManager = ({
  folderPath,
}: {
  folderPath: string;
}) => {
  return new DemosFolderManager(folderPath);
};
