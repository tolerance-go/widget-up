import path from "path";

/**
 * 替换文件内容中的别名路径为相对路径。
 *
 * @param {string} fileContent - 文件的原始内容。
 * @param {{ [key: string]: string[] }} paths - 包含别名到路径的映射。
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
  Object.keys(paths).forEach((alias) => {
    const targets = paths[alias]; // 获取当前别名对应的目标路径数组

    console.log("alias", alias);

    targets.forEach((target) => {
      // 构建正则表达式，用于匹配形如 'alias/' 的导入或导出路径
      const aliasPattern = new RegExp(
        `(import|export)(\\s+type)?\\s+([^\\s'"]+)\\s+from\\s+(['"])${alias.replace(
          /\*$/,
          ""
        )}`,
        "g"
      );

      // 检查并替换匹配的别名路径
      fileContent = fileContent.replace(
        aliasPattern,
        (match, p1, p2, p3, p4) => {
          const cleanTarget = target.replace(/\*$/, "");
          const targetPath = resolvePath(cleanTarget);
          let relativePath = path
            .relative(fileDir, targetPath)
            .replace(/\\/g, "/");

          // 构建新的导入或导出字符串
          return `${p1}${p2 || ""} ${p3} from ${p4}${relativePath}/`;
        }
      );
    });
  });

  return fileContent; // 返回更新后的文件内容
};
