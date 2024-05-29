import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import {
  convertDependenciesTreeToList,
  getPeerDependTree,
  PeerDependenciesNode,
  PeerDependenciesTree,
} from "widget-up-utils";
import { PathManager } from "../pathManager";
import { logger } from "./logger";
import { ConfigManager } from "../configManager";
import { EnvManager } from "../envManager";

export class PeerDependTreeManager extends EventEmitter {
  private static instance: PeerDependTreeManager | null = null;

  private peerDependenciesTree: PeerDependenciesTree = {};
  private cwd: string;
  private fsWatcher: fs.FSWatcher | null = null;
  private configManager: ConfigManager;
  private envManager: EnvManager;

  public static getInstance(): PeerDependTreeManager {
    if (!PeerDependTreeManager.instance) {
      const pathManager = PathManager.getInstance();
      PeerDependTreeManager.instance = new PeerDependTreeManager(
        pathManager.cwdPath
      );
    }
    return PeerDependTreeManager.instance;
  }

  // 解除所有监听配置变化的回调函数
  static dispose() {
    if (this.instance?.fsWatcher) {
      this.instance.fsWatcher.close();
      this.instance.fsWatcher = null;
    }
  }

  constructor(cwd: string) {
    super();
    this.cwd = cwd;
    this.configManager = ConfigManager.getInstance();
    this.envManager = EnvManager.getInstance();
    this.loadPeerDependenciesTree();
    this.watchPackageJson();
  }

  private loadPeerDependenciesTree() {
    this.updateDependenciesTree();

    logger.log("loadPeerDependenciesTree start");
    logger.info({
      "this.peerDependenciesTree": this.peerDependenciesTree,
    });
  }

  private updateDependenciesTree(): void {
    const config = this.configManager.getConfig();
    const { BuildEnv } = this.envManager;
    this.peerDependenciesTree = getPeerDependTree({
      cwd: this.cwd,
      getExtraPeerDependencies(name) {
        return config.umd[name]?.extraPeerDependencies ?? {};
      },
      getCustomEntries(name) {
        return {
          browser: config.umd[name]?.browser[BuildEnv],
          style: config.umd[name]?.style?.[BuildEnv],
        };
      },
    });
    this.emit("dependenciesUpdated", this.peerDependenciesTree);
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
    return this.peerDependenciesTree;
  }

  /**
   * @returns 返回叶子节点的数据列表
   */
  public getDependenciesList(): PeerDependenciesNode[] {
    return convertDependenciesTreeToList(this.peerDependenciesTree);
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
