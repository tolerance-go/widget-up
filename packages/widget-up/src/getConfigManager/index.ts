import fs from "fs";
import path from "path";
import { EventEmitter } from "events";

// 假设 parseConfig 可以从 "widget-up-utils" 正确导入
import { ParseConfig, parseConfig } from "widget-up-utils";

export class ConfigManager extends EventEmitter {
  private configPath: string;
  private config: any;

  constructor() {
    super();
    this.configPath = path.join(process.cwd(), "./widget-up.json");
    this.loadConfig(); // 初始加载配置

    // 监听文件变化
    fs.watch(this.configPath, (eventType, filename) => {
      if (eventType === "change") {
        this.loadConfig();
      }
    });
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
  public watch(callback: (config: ParseConfig) => void) {
    this.on("change", callback);
    return () => this.removeListener("change", callback); // 返回一个取消监听的函数
  }
}

export function getConfigManager() {
  return new ConfigManager();
}
