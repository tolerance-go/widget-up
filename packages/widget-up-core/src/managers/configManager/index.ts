import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import { NormalizedConfig, PackageJson, parseConfig } from "widget-up-utils";

export class ConfigManager extends EventEmitter {
  private static instance: ConfigManager | null = null;
  private configPath: string;
  private config: NormalizedConfig | null = null;
  private packageConfig: PackageJson | null = null;
  private fsWatcher: fs.FSWatcher | null = null;

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
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
    this.configPath = path.join(process.cwd(), "./widget-up.json");
    this.loadConfig(); // 初始加载配置
    this.loadPackageConfig(); // 初始加载 package.json

    // 监听文件变化
    this.fsWatcher = fs.watch(this.configPath, (eventType, filename) => {
      if (eventType === "change") {
        this.loadConfig();
      }
    });
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
    const packageConfig = JSON.parse(
      fs.readFileSync(path.resolve("package.json"), "utf8")
    ) as PackageJson;
    this.packageConfig = packageConfig;
  }

  // 加载配置文件并触发事件
  private loadConfig() {
    try {
      const fileContents = fs.readFileSync(this.configPath, "utf8");
      const newConfig = parseConfig(JSON.parse(fileContents));
      if (JSON.stringify(this.config) !== JSON.stringify(newConfig)) {
        this.config = newConfig;
        this.emit("change", this.config); // 触发配置变化事件
      }
    } catch (error) {
      this.emit("error", error);
    }
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
