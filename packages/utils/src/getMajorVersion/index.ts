export function getMajorVersion(version: string): number {
  // 使用正则表达式来匹配主版本号
  const regex = /^(\d+)\./;
  const match = version.match(regex);

  // 如果匹配成功，则返回转换为数字的主版本号
  if (match) {
    return parseInt(match[1], 10);
  } else {
    // 如果输入不符合预期的版本号格式，抛出错误
    throw new Error("Invalid version format");
  }
}
