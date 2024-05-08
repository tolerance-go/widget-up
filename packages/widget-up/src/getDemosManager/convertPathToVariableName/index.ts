export function convertPathToVariableName(path: string): string {
  // 替换路径中的非法字符为下划线
  let variableName = path.replace(/[^a-zA-Z0-9]/g, "_");

  // 确保变量名不以数字开头
  if (/^[0-9]/.test(variableName)) {
    variableName = `_${variableName}`;
  }

  return variableName;
}
