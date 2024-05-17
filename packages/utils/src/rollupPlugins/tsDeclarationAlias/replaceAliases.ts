import path from "path";
import { replaceAliasesCore } from "./replaceAliasesCore";

export const replaceAliases = ({
  fileContent,
  paths,
  baseUrl,
  filePath,
}: {
  fileContent: string;
  paths: { [key: string]: string[] };
  baseUrl: string;
  filePath: string;
}): string => {
  // 使用外部依赖处理路径
  const fileDir = path.dirname(filePath);

  // 该函数使用 Node.js 的 path 模块来解析路径
  const resolvePathWithNodePath = (relativePath: string): string => {
    return path.resolve(baseUrl, relativePath);
  };

  return replaceAliasesCore({
    fileContent,
    paths,
    fileDir,
    resolvePath: resolvePathWithNodePath,
  });
};
