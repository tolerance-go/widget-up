import { getAliasPattern } from "./getAliasPattern";

export const aliasReplace = (
  fileContent: string,
  dependPatternStr: string,
  replace: (dependPath: string) => string
): string => {
  const pattern = getAliasPattern(dependPatternStr);

  // 使用正则表达式匹配并替换依赖路径
  return fileContent.replace(pattern, (match) => {
    // 解析出模块名，假设它被引号包围
    const moduleMatch = match.match(/(['"])([^'"]+)(['"])/);
    if (moduleMatch && moduleMatch[1] && moduleMatch[2] && moduleMatch[3]) {
      // 应用替换函数
      return match.replace(
        `${moduleMatch[1]}${moduleMatch[2]}${moduleMatch[3]}`,
        `${moduleMatch[1]}${replace(moduleMatch[2])}${moduleMatch[3]}`
      );
    }
    return match; // 如果没有找到匹配项，返回原始匹配
  });
};
