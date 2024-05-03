export function stripUMDWrapper({
  scriptContent,
  functionName = "wrap",
}: {
  scriptContent: string;
  functionName?: string;
}): string {
  // 正则表达式匹配函数声明及其全部内容
  const regex = /(\s*function)(\s*)(\([^)]*\)\s*)({[^{}]*(?:{[^{}]*}[^{}]*)*})/;

  const match = regex.exec(scriptContent);
  if (match) {
    // 添加函数名
    return `${match[1]}${match[2] || ' '}${functionName}${match[3]}${match[4]}`;
  } else {
    return "";
  }
}
