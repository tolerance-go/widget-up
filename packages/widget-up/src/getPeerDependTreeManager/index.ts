import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import getPeerDependTree, {
  PeerDependenciesTree,
} from "../utils/getPeerDependTree";

export class PeerDependTreeManager extends EventEmitter {
  private dependenciesTree: PeerDependenciesTree = {};
  private cwd: string;
  private fsWatcher: fs.FSWatcher | null = null;

  constructor(cwd: string) {
    super();
    this.cwd = cwd;
    this.updateDependenciesTree();
    this.watchPackageJson();
  }

  private updateDependenciesTree(): void {
    this.dependenciesTree = getPeerDependTree({ cwd: this.cwd });
    this.emit("dependenciesUpdated", this.dependenciesTree);
  }

  private watchPackageJson() {
    const packageJsonPath = path.join(this.cwd, "package.json");
    this.fsWatcher = fs.watch(packageJsonPath, (eventType) => {
      if (eventType === "change") {
        this.updateDependenciesTree();
      }
    });
  }

  public getDependenciesTree(): PeerDependenciesTree {
    return this.dependenciesTree;
  }

  public stopWatching() {
    if (this.fsWatcher) {
      this.fsWatcher.close();
    }
  }

  // 注册监听依赖树变化的回调函数
  public watch(
    callback: (dependenciesTree: PeerDependenciesTree) => void
  ): () => void {
    this.on("dependenciesUpdated", callback);
    return () => this.removeListener("dependenciesUpdated", callback); // 返回一个取消监听的函数
  }
}

export function getPeerDependTreeManager({
  cwd,
}: {
  cwd: string;
}): PeerDependTreeManager {
  return new PeerDependTreeManager(cwd);
}
