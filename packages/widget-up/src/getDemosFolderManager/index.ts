import { DemoData, DemoFileConfig, DemoMenuItem } from "@/types";
import { EventEmitter } from "events";
import {
  DirectoryStructure,
  parseDirectoryStructure,
} from "../utils/parseDirectoryStructure";
import realFs from "fs";
import realPath from "path";

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

    this.demoDatas = this.convertDirectoryToDemo(
      this.directoryStructure?.children ?? []
    );
  }

  convertDirectoryToDemo(directory: DirectoryStructure[]): DemoData[] {
    return directory
      .map((item) => {
        // 如果是文件，直接读取文件同级的文件的 json 版本获取 meta 数据，如果不存在就报错
        if (item.type === "file") {
          const parsed = this.path.parse(item.path);

          if (parsed.ext === ".json") {
            return;
          }

          const jsonFile = this.path.join(
            parsed.dir,
            `${parsed.name}.config.json`
          );

          if (!this.fs.existsSync(jsonFile)) {
            throw new Error(`Meta data not found for file: ${jsonFile}`);
          }

          const config = JSON.parse(
            this.fs.readFileSync(jsonFile, {
              encoding: "utf-8",
            })
          ) as DemoFileConfig;

          // Create the basic menu item from the directory item
          const menuItem: DemoData = {
            config,
            path: item.path,
            type: item.type,
          };
          return menuItem;
        }

        const menuItem: DemoData = {
          children: this.convertDirectoryToDemo(item.children ?? []),
          path: item.path,
          type: item.type,
        };
        return menuItem;
      })
      .filter(Boolean) as DemoData[];
  }
}

export const getDemosFolderManager = ({
  folderPath,
}: {
  folderPath: string;
}) => {
  return new DemosFolderManager(folderPath);
};
