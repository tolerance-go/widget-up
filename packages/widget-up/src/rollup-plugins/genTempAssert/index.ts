// 导入所需的模块
import { Plugin } from "rollup";
import fs from "fs";
import path from "path";
import { promisify } from "util";

// 将 fs 中的异步方法转换为返回 Promise 的方法

interface GenTempAssertOptions {
  src: string; // 源文件的路径
}

// genTempAssert 插件的实现
export function genTempAssert(options: GenTempAssertOptions): Plugin {
  return {
    name: "genTempAssert", // 插件名
    buildStart() {
      const cwd = process.cwd(); // 获取当前工作目录
      const destDir = path.join(cwd, ".wup"); // 目标目录
      const destFile = path.join(destDir, "index.html.ejs"); // 目标文件的完整路径

      try {
        fs.mkdirSync(destDir, { recursive: true }); // 确保目标目录存在，如果不存在则创建
        fs.copyFileSync(options.src, destFile); // 复制文件
        console.log(`File ${options.src} has been copied to ${destFile}`);
      } catch (error) {
        // 捕获并打印出可能发生的错误
        console.error(
          `Error copying file from ${options.src} to ${destFile}: ${error}`
        );
        throw error;
      }
    },
  };
}
