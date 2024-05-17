// 使用 Node.js 的 fs, path, crypto, 和 child_process 模块
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { debounce } from "lodash-es";

// 解析当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();

// 读取和解析 tsconfig.json
const tsconfigPath = path.join(cwd, "tsconfig.json");
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
const outDir = path.join(cwd, tsconfig.compilerOptions.outDir);

// 是否正在执行脚本
let isExecuting = false;

// 执行命令的函数
function executeCommand() {
  console.log(`Executing script due to changes...`);
  isExecuting = true; // 开始执行，暂停监听

  exec(
    "node dist/rollupPlugins/tsDeclarationAlias/exec.js",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);

      isExecuting = false; // 脚本执行完成，恢复监听
    }
  );
}

// 使用防抖函数优化重复执行
const debouncedExecuteCommand = debounce(executeCommand, 300);

// 设置监听器
const watcher = fs.watch(outDir, { recursive: true }, (eventType, filename) => {
  if (isExecuting) {
    return;
  }
  if (filename.endsWith(".d.ts")) {
    debouncedExecuteCommand();
  }
});

console.log(`Watching for changes in ${outDir}`);
