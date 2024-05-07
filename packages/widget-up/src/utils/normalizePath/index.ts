/**
 * 将路径中的所有分隔符转换为统一的分隔符。
 * @param path - 需要转换分隔符的路径字符串。
 * @returns 返回转换后的路径字符串。
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}
