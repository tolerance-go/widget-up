import fs from "fs";
import util from "util";
import path from "path";

export class FileLogger {
  private filePath: string;
  private initialized: boolean = false;
  private namespaces: string[] = [];

  constructor(...namespaces: string[]) {
    this.namespaces = namespaces;

    this.filePath = path.join(
      process.cwd(),
      ".logs",
      ...this.namespaces,
      new Date().toISOString().substring(0, 10)
    );
  }

  public extendNamespace(additionalNamespace: string): FileLogger {
    return new FileLogger(...this.namespaces, additionalNamespace);
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      this.initializeLogFile();
      this.initialized = true;
    }
  }

  private initializeLogFile(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.closeSync(fs.openSync(this.filePath, "w"));
    }
  }

  private write(message: string): void {
    this.ensureInitialized();
    fs.appendFileSync(this.filePath, message + "\n", "utf-8");
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
    this.write(formattedMessage);
  }

  public info(...args: any[]): void {
    const formattedMessage = util.format(
      "[INFO] [%s] - %s",
      new Date().toISOString(),
      this.formatArgs(args)
    );
    this.write(formattedMessage);
  }

  public error(...args: any[]): void {
    const formattedMessage = util.format(
      "[ERROR] [%s] - %s",
      new Date().toISOString(),
      this.formatArgs(args)
    );
    this.write(formattedMessage);
  }

  public warn(...args: any[]): void {
    const formattedMessage = util.format(
      "[WARN] [%s] - %s",
      new Date().toISOString(),
      this.formatArgs(args)
    );
    this.write(formattedMessage);
  }
}
