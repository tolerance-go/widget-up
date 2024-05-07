import fs from "fs";
import less from "less";
import path from "path";
import { logger } from "./logger";

// 读取 LESS 文件并编译成 CSS
export const compileLessToCSS = async (
  lessFilePath: string,
  rootPath: string,
): Promise<string> => {
  try {
    const lessContent = fs.readFileSync(lessFilePath, "utf8");
    // 配置 LESS 编译器以包括 node_modules 目录
    const options: Less.Options = {
      paths: [path.join(rootPath, "node_modules")], // 指定搜索路径
      filename: path.basename(lessFilePath), // 用于错误报告和 @import 解析
    };

    logger.info("less options: ", JSON.stringify(options, null, 2));
    // 使用 Promise 包装 less.render 以便使用 async/await
    const output = await less.render(lessContent, options);
    return output.css;
  } catch (error) {
    console.error(`Error compiling LESS to CSS: ${error}`);
    return "";
  }
};
