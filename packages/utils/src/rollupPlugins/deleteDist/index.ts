import { Plugin } from "rollup";
import fs from "fs";
import path from "path";

interface DeleteDistOptions {
  dist: string | string[]; // 指定需要删除的目录或文件，支持数组
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

      const distPaths =
        typeof options.dist === "string" ? [options.dist] : options.dist;

      distPaths.forEach((distPath) => {
        const fullPath = path.resolve(process.cwd(), distPath); // 获取绝对路径
        try {
          if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
              fs.rmSync(fullPath, { recursive: true, force: true }); // 删除目录及其内容
              console.log(
                `Directory ${fullPath} has been successfully deleted.`
              );
            } else if (stats.isFile()) {
              fs.unlinkSync(fullPath); // 删除单个文件
              console.log(`File ${fullPath} has been successfully deleted.`);
            }
          }
        } catch (error) {
          console.error(`Error deleting ${fullPath}: ${error}`);
          throw error;
        }
      });

      isDeleted = true;
    },
  };
}

export default deleteDist;
