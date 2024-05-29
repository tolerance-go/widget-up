import fs from "fs";
import util from "util";
import path from "path";

export class FileLogger {
  private baseFilePath: string;
  private namespaces: string[] = [];

  constructor(...namespaces: string[]) {
    this.namespaces = namespaces;

    this.baseFilePath = path.join(
      process.cwd(),
      ".logs",
      ...this.namespaces,
      new Date().toISOString().substring(0, 10)
    );
  }

  public extendNamespace(additionalNamespace: string): FileLogger {
    return new FileLogger(...this.namespaces, additionalNamespace);
  }

  private ensureDirectoryExists(filePath: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private write(message: string, level: string): void {
    const filePath = path.join(this.baseFilePath, level);
    this.ensureDirectoryExists(filePath);
    fs.appendFileSync(filePath, message + "\n", "utf-8");
  }

  private formatArgs(args: any[]): string {
    return args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
      )
      .join(" ");
  }

  public log(...args: any[]): void {
    const formattedMessage = util.format(
      "[LOG] [%s] - %s",
      new Date().toISOString(),
      this.formatArgs(args)
    );
    this.write(formattedMessage, "log");
  }

  public info(...args: any[]): void {
    const formattedMessage = util.format(
      "[INFO] [%s] - %s",
      new Date().toISOString(),
      this.formatArgs(args)
    );
    this.write(formattedMessage, "info");
  }

  public error(...args: any[]): void {
    const formattedMessage = util.format(
      "[ERROR] [%s] - %s",
      new Date().toISOString(),
      this.formatArgs(args)
    );
    this.write(formattedMessage, "error");
  }

  public warn(...args: any[]): void {
    const formattedMessage = util.format(
      "[WARN] [%s] - %s",
      new Date().toISOString(),
      this.formatArgs(args)
    );
    this.write(formattedMessage, "warn");
  }
}
