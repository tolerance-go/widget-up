import fs from "fs";
import util from "util";
import path from "path";

export class Logger {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.initializeLogFile();
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
