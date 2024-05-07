import { EventEmitter } from "events";
import { watch } from "fs";
import { resolve } from "path";
import {
  DirectoryStructure,
  parseDirectoryStructure,
} from "../utils/parseDirectoryStructure";

class DemosFolderManager extends EventEmitter {
  private folderPath: string;
  private directoryStructure: DirectoryStructure | null = null;

  constructor(folderPath: string = "./demos") {
    super();
    this.folderPath = resolve(folderPath);
    this.loadInitialDirectoryStructure();
    this.watchFolder();
  }

  private async loadInitialDirectoryStructure(): Promise<void> {
    try {
      this.directoryStructure = parseDirectoryStructure(this.folderPath);
      this.emit("initialized", this.directoryStructure);
    } catch (error) {
      this.emit("error", error);
    }
  }

  private watchFolder(): void {
    watch(this.folderPath, { recursive: true }, async (eventType, filename) => {
      if (filename) {
        // 当检测到变化时重新加载目录结构
        try {
          this.directoryStructure = parseDirectoryStructure(this.folderPath);
          this.emit("change", this.directoryStructure);
        } catch (error) {
          this.emit("error", error);
        }
      }
    });
  }

  public getDirectoryStructure(): DirectoryStructure | null {
    return this.directoryStructure;
  }
}

export const getDemosFolderManager = ({
  folderPath,
}: {
  folderPath: string;
}) => {
  return new DemosFolderManager(folderPath);
};
