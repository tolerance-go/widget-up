/**
 * 将 SemVer 语义化版本号转换为合法的代码命名字符串。
 * @param version 语义化版本号，如 '1.2.3-alpha.1'
 * @returns 转换后的合法代码命名字符串，如 'v1_2_3_alpha_1'
 */
export function convertSemverVersionToIdentify(version: string): string {
  // 替换所有非字母数字字符为下划线
  return "v" + version.replace(/[^\w\d]/g, "_");
}
