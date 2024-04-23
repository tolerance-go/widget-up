import fs from 'fs';
import less from 'less';

// 读取 LESS 文件并编译成 CSS
export const compileLessToCSS = async (
  lessFilePath: string,
): Promise<string> => {
  try {
    const lessContent = fs.readFileSync(lessFilePath, 'utf8');
    // 使用 Promise 包装 less.render 以便使用 async/await
    const output = await less.render(lessContent);
    return output.css;
  } catch (error) {
    console.error(`Error compiling LESS to CSS: ${error}`);
    return '';
  }
};
