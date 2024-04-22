import path from "path";

/**
 * 替换文件内容中的别名路径为相对路径。
 *
 * @param {string} fileContent - 文件的原始内容。
 * @param {{ [key: string]: string[] }} paths - 包含别名到路径的映射。
 * @param {string} baseUrl - 基础 URL，通常是项目的根目录。
 * @param {string} fileDir - 当前文件的目录路径。
 * @param {(baseUrl: string, relativePath: string) => string} resolvePath - 解析路径的函数。
 * @returns {string} - 返回替换别名后的文件内容。
 */
export const replaceAliasesCore = ({
  fileContent,
  paths,
  fileDir,
  resolvePath,
}: {
  fileContent: string;
  paths: { [key: string]: string[] };
  fileDir: string;
  resolvePath: (relativePath: string) => string;
}): string => {
  // 遍历所有的别名
  for (const alias in paths) {
    if (paths.hasOwnProperty(alias)) {
      const targets = paths[alias]; // 获取当前别名对应的目标路径数组

      // 对每个目标路径进行处理
      targets.forEach((target) => {
        // 构建正则表达式，用于匹配形如 'alias/' 的导入路径
        const aliasPattern = new RegExp(
          `import\\s+([^\\s'"]+)\\s+from\\s+(['"])${alias}/`,
          "g"
        );

        // 如果当前文件内容不包含此别名，跳过当前循环
        if (!aliasPattern.test(fileContent)) {
          return; // 使用 return 跳过当前 forEach 循环的剩余部分
        }

        // 移除目标路径中的通配符，例如 'src/components/*' 中的 '*'
        const cleanTarget = target.replace(/\*$/, "");

        // 使用 resolvePath 函数计算从基础 URL 到目标路径的绝对路径
        const targetPath = resolvePath(cleanTarget);

        // 计算从当前文件目录到目标路径的相对路径，并确保路径使用 '/' 分隔（兼容不同操作系统）
        let relativePath = path
          .relative(fileDir, targetPath)
          .replace(/\\/g, "/");

        // 如果相对路径不是以 './' 或 '../' 开头，手动添加 './'
        if (!relativePath.startsWith(".")) {
          relativePath = "./" + relativePath;
        }

        // 替换文件内容中的所有匹配的别名路径为实际的相对路径
        fileContent = fileContent.replace(aliasPattern, (match, p1, p2) => {
          return `import ${p1} from ${p2}${relativePath}/`;
        });
      });
    }
  }

  return fileContent; // 返回更新后的文件内容
};
