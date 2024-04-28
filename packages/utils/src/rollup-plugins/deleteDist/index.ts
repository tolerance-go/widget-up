import { Plugin } from "rollup";
import fs from "fs";
import path from "path";

interface DeleteDistOptions {
  dist: string; // 指定需要删除的目录
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

      const distPath = path.resolve(process.cwd(), options.dist); // 获取绝对路径

      try {
        if (fs.existsSync(distPath)) {
          // 检查目录是否存在
          fs.rmSync(distPath, { recursive: true, force: true }); // 同步删除目录及其内容
          console.log(`Directory ${distPath} has been successfully deleted.`);
        }
      } catch (error) {
        console.error(`Error deleting directory ${distPath}: ${error}`);
        throw error; // 在发生错误时抛出异常
      }

      isDeleted = true;
    },
  };
}

export default deleteDist;
