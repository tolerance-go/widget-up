import fs from "fs";
import util from "util";
import path from "path";
export class Logger {
    filePath;
    initialized = false; // 添加标志来跟踪日志文件是否已初始化
    constructor(filePath) {
        this.filePath = filePath;
    }
    ensureInitialized() {
        if (!this.initialized) {
            this.initializeLogFile();
            this.initialized = true; // 标记为已初始化
        }
    }
    initializeLogFile() {
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
    write(message) {
        this.ensureInitialized(); // 确保日志文件在写入前已初始化
        fs.appendFileSync(this.filePath, message + "\n", "utf-8");
    }
    log(...args) {
        const formattedMessage = util.format("[LOG] [%s] -", new Date().toISOString(), ...args);
        this.write(formattedMessage);
    }
    info(...args) {
        const formattedMessage = util.format("[INFO] [%s] -", new Date().toISOString(), ...args);
        this.write(formattedMessage);
    }
    error(...args) {
        const formattedMessage = util.format("[ERROR] [%s] -", new Date().toISOString(), ...args);
        this.write(formattedMessage);
    }
    warn(...args) {
        const formattedMessage = util.format("[WARN] [%s] -", new Date().toISOString(), ...args);
        this.write(formattedMessage);
    }
}
