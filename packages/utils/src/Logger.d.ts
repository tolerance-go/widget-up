export declare class Logger {
    private filePath;
    private initialized;
    constructor(filePath: string);
    private ensureInitialized;
    private initializeLogFile;
    private write;
    log(...args: any[]): void;
    info(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
}
