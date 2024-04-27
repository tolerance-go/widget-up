import fs from "fs";
import util from "util";
import path from "path";

export class Logger {
  private filePath: string;
  private initialized: boolean = false; // 添加标志来跟踪日志文件是否已初始化

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      this.initializeLogFile();
      this.initialized = true; // 标记为已初始化
    }
  }

  private initializeLogFile(): void {
    // 确保文件所在目录存在
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 检查文件是否存在，不存在则创建
    if (!fs.existsSync(this.filePath)) {
      fs.closeSync(fs.openSync(this.filePath, "w"));
    }
  }

  private write(message: string): void {
    this.ensureInitialized(); // 确保日志文件在写入前已初始化
    fs.appendFileSync(this.filePath, message + "\n", "utf-8");
  }

  public log(...args: any[]): void {
    const formattedMessage = util.format(
      "[LOG] [%s] -",
      new Date().toISOString(),
      ...args
    );
    this.write(formattedMessage);
  }

  public info(...args: any[]): void {
    const formattedMessage = util.format(
      "[INFO] [%s] -",
      new Date().toISOString(),
      ...args
    );
    this.write(formattedMessage);
  }

  public error(...args: any[]): void {
    const formattedMessage = util.format(
      "[ERROR] [%s] -",
      new Date().toISOString(),
      ...args
    );
    this.write(formattedMessage);
  }

  public warn(...args: any[]): void {
    const formattedMessage = util.format(
      "[WARN] [%s] -",
      new Date().toISOString(),
      ...args
    );
    this.write(formattedMessage);
  }
}
