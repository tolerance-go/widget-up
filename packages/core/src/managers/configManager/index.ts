import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import { NormalizedConfig, PackageConfig, parseConfig } from "widget-up-utils";
import { PathManager } from "../pathManager";
import { logger } from "./logger";

export class ConfigManager extends EventEmitter {
  private static instance: ConfigManager | null = null;
  private config: NormalizedConfig | null = null;
  private packageConfig: PackageConfig | null = null;
  private fsWatcher: fs.FSWatcher | null = null;
  private pathManager: PathManager;

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  static getPackageConfig({ cwd }: { cwd: string }) {
    const packageConfig = JSON.parse(
      fs.readFileSync(path.join(cwd, "package.json"), "utf8")
    ) as PackageConfig;
    return packageConfig;
  }

  // 根据 cwd 获取 wup 解析后的配置信息
  static getWidgetUpConfig({ cwd }: { cwd: string }) {
    const pathManager = PathManager.getInstance();

    logger.log(
      "pathManager.widgetUpConfigAbsPath",
      pathManager.widgetUpConfigAbsPath
    );

    const packageConfig = ConfigManager.getPackageConfig({
      cwd,
    });

    const fileContents = fs.readFileSync(
      path.join(cwd, pathManager.widgetUpConfigRelativePath),
      "utf8"
    );

    const newConfig = parseConfig(JSON.parse(fileContents), packageConfig);

    return newConfig;
  }

  // 解除所有监听配置变化的回调函数
  static dispose() {
    if (this.instance?.fsWatcher) {
      this.instance.fsWatcher.close();
      this.instance.fsWatcher = null;
    }
  }

  constructor() {
    super();

    this.pathManager = PathManager.getInstance();
    this.loadConfig(); // 初始加载配置
    this.loadPackageConfig(); // 初始加载 package.json

    // 监听文件变化
    this.fsWatcher = fs.watch(
      this.pathManager.widgetUpConfigAbsPath,
      (eventType, filename) => {
        if (eventType === "change") {
          this.loadConfig();
        }
      }
    );
  }

  public getConfig() {
    if (!this.config) {
      throw new Error("Config not loaded yet");
    }

    return this.config;
  }

  public getBuildConfig() {
    if (!this.config) {
      throw new Error("Config not loaded yet");
    }

    const { form, ...rest } = this.config;

    return rest;
  }

  public getFormConfig() {
    if (!this.config) {
      throw new Error("Config not loaded yet");
    }

    const { form, ...rest } = this.config;

    return form;
  }

  public getPackageConfig() {
    if (!this.packageConfig) {
      throw new Error("Package config not loaded yet");
    }

    return this.packageConfig;
  }

  private loadPackageConfig() {
    this.packageConfig = ConfigManager.getPackageConfig({
      cwd: this.pathManager.cwdPath,
    });
  }

  // 加载配置文件并触发事件
  private loadConfig() {
    try {
      let newConfig = ConfigManager.getWidgetUpConfig({
        cwd: this.pathManager.cwdPath,
      });

      this.config = newConfig;

      if (JSON.stringify(this.config) !== JSON.stringify(newConfig)) {
        this.emit("change", newConfig); // 触发配置变化事件
      }
    } catch (error) {
      this.emit("error", error);
    }
  }

  public processConfig(
    handler: (config: NormalizedConfig | null) => NormalizedConfig | null
  ) {
    this.config = handler(this.config);
  }

  // 获取当前配置
  public get() {
    return this.config;
  }

  // 注册监听配置变化的回调函数
  public watch(callback: (config: NormalizedConfig) => void) {
    this.on("change", callback);
    return () => this.removeListener("change", callback); // 返回一个取消监听的函数
  }
}
