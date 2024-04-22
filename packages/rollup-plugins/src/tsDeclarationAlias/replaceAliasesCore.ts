import path from "path";
import { aliasReplace } from "./aliasReplace";
import { convertKeyToRegex } from "./convertKeyToRegex";

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

    targets.forEach((target) => {
      fileContent = aliasReplace(
        fileContent,
        convertKeyToRegex(alias),
        (dependPath) => {
          // @/* => @/
          const cleanAlias = alias.replace(/\*$/, "");
          const cleanTarget = target.replace(/\*$/, "");
          const targetPath = resolvePath(cleanTarget);
          let relativePath = path
            .relative(fileDir, targetPath)
            .replace(/\\/g, "/");

          return dependPath.replace(cleanAlias, `${relativePath}/`);
        }
      );
    });
  });

  return fileContent; // 返回更新后的文件内容
};
