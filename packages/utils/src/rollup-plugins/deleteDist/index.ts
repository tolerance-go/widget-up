import { Plugin } from "rollup";
import fs from "fs";
import path from "path";

interface DeleteDistOptions {
  dist: string | string[]; // 指定需要删除的目录，支持数组
  once?: boolean;
}

function deleteDist(options: DeleteDistOptions): Plugin {
  let isDeleted = false; // 标记是否已删除，确保删除操作只执行一次

  return {
    name: "deleteDist",
    buildStart() {
      if (options.once && isDeleted) {
        return;
      }

      // 确保 dist 总是一个数组
      const distPaths =
        typeof options.dist === "string" ? [options.dist] : options.dist;

      distPaths.forEach((distPath) => {
        const fullPath = path.resolve(process.cwd(), distPath); // 获取绝对路径
        try {
          if (fs.existsSync(fullPath)) {
            // 检查目录是否存在
            fs.rmSync(fullPath, { recursive: true, force: true }); // 同步删除目录及其内容
            console.log(`Directory ${fullPath} has been successfully deleted.`);
          }
        } catch (error) {
          console.error(`Error deleting directory ${fullPath}: ${error}`);
          throw error; // 在发生错误时抛出异常
        }
      });

      isDeleted = true;
    },
  };
}

export default deleteDist;
