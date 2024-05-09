import fs from "fs";
import path from "path";
import { Plugin } from "rollup";

interface GenAssertOptions {
  src?: string; // 源文件的路径，可选
  file?: {
    // 直接从内存写入的文件对象，可选
    name: string; // 要创建的文件名称
    content: string; // 文件内容
  };
  dest: string;
}

// genAssert 插件的实现
export function genAssert(options: GenAssertOptions): Plugin {
  return {
    name: "gen-assert",
    buildStart() {
      const cwd = process.cwd(); // 获取当前工作目录
      const destDir = path.join(cwd, options.dest); // 目标目录

      // 确保目标目录存在
      try {
        fs.mkdirSync(destDir, { recursive: true });
      } catch (error) {
        console.error(`Error creating directory ${destDir}: ${error}`);
        throw error;
      }

      if (options.file) {
        // 从内存写入文件
        const destFile = path.join(destDir, options.file.name);
        try {
          fs.writeFileSync(destFile, options.file.content); // 写入文件内容
          console.log(
            `File ${options.file.name} has been written to ${destFile}`
          );
        } catch (error) {
          console.error(
            `Error writing file ${options.file.name} to ${destFile}: ${error}`
          );
          throw error;
        }
      }

      if (options.src) {
        // 从文件系统复制文件
        const srcPath = path.resolve(cwd, options.src);
        const destFile = path.join(destDir, path.basename(srcPath));
        try {
          fs.copyFileSync(srcPath, destFile); // 复制文件
          console.log(`File ${options.src} has been copied to ${destFile}`);
        } catch (error) {
          console.error(
            `Error copying file from ${options.src} to ${destFile}: ${error}`
          );
          throw error;
        }
      }
    },
  };
}
