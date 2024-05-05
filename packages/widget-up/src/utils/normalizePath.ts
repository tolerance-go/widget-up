/**
 * 是什么
 *
 * - 一个 ts 编写的工具方法
 * - 他把 path 中的所有分隔符都转换为代码中的分隔符，比如 windows 下的 \ 转换为 /
 */

/**
 * 将路径中的所有分隔符转换为统一的分隔符。
 * @param path - 需要转换分隔符的路径字符串。
 * @returns 返回转换后的路径字符串。
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}
