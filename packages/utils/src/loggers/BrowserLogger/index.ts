export class BrowserLogger {
  private namespaces: string[];

  constructor(...namespaces: string[]) {
    this.namespaces = namespaces;
  }

  log(...args: any[]): void {
    console.log(
      `[${this.namespaces.join(":")}] [LOG]`,
      new Date().toISOString(),
      ...args
    );
  }

  info(...args: any[]): void {
    console.info(
      `[${this.namespaces.join(":")}] [INFO]`,
      new Date().toISOString(),
      ...args
    );
  }

  warn(...args: any[]): void {
    console.warn(
      `[${this.namespaces.join(":")}] [WARN]`,
      new Date().toISOString(),
      ...args
    );
  }

  error(...args: any[]): void {
    console.error(
      `[${this.namespaces.join(":")}] [ERROR]`,
      new Date().toISOString(),
      ...args
    );
  }

  extendNamespace(additionalNamespace: string): BrowserLogger {
    return new BrowserLogger(...this.namespaces, additionalNamespace);
  }
}
