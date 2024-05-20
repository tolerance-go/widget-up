/**
 * 替换文件路径的后缀名，兼容 Windows 和 UNIX/Linux 路径
 * @param path 原始文件路径
 * @param newExtension 新的文件后缀名，包括点号，例如 '.jpg'
 * @returns 返回新的文件路径
 */
export function replaceFileExtension(
  path: string,
  newExtension: string
): string {
  // 使用正则表达式匹配文件后缀，考虑到 Windows 和 UNIX/Linux 的路径分隔符
  return path.replace(/(\.[^\/\\]+)$/, newExtension);
}
