export class BrowserLogger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  log(...args: any[]): void {
    console.log(
      `[${this.namespace}] [LOG]`,
      new Date().toISOString().substring(0, 10),
      ...args
    );
  }

  info(...args: any[]): void {
    console.info(
      `[${this.namespace}] [INFO]`,
      new Date().toISOString().substring(0, 10),
      ...args
    );
  }

  warn(...args: any[]): void {
    console.warn(
      `[${this.namespace}] [WARN]`,
      new Date().toISOString().substring(0, 10),
      ...args
    );
  }

  error(...args: any[]): void {
    console.error(
      `[${this.namespace}] [ERROR]`,
      new Date().toISOString().substring(0, 10),
      ...args
    );
  }
}
