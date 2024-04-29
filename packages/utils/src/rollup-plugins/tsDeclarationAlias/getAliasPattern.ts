export const getAliasPattern = (npmNameRegStr: string) => {
  const importOrExport = "(import|export)\\s*"; // 修改后跟可选空格
  const optionalType = "(type\\s*)?"; // 类型声明后也跟可选空格

  const importAll = "\\*\\s+as\\s+\\w+"; // 匹配 'import * as name'
  const importDefaultAndNamed = "\\w+\\s*,\\s*\\{[^}]*\\}"; // 匹配 'import defaultExport, { namedExport }'
  const importDefault = "\\w+"; // 匹配单个默认导出或导入
  const importNamed = "\\{[^}]*\\}"; // 匹配 '{ namedExport }'
  const importEverything = "\\*"; // 匹配 '*' (全部导入)
  const noImport = "\\s*"; // 匹配 '*' (全部导入)

  const importsExports = `(${importAll}|${importDefaultAndNamed}|${importDefault}|${importNamed}|${importEverything}|${noImport})`;

  const from = "(\\s*from\\s*)?"; // 'from' 前后也允许没有空格
  const moduleName = `['"](${npmNameRegStr})['"]\\s*;?`; // 模块名后的引号和可选分号后也允许空格

  // 组合正则表达式字符串
  const pattern = [
    importOrExport,
    optionalType,
    importsExports,
    from,
    moduleName,
  ].join("");

  return new RegExp(pattern, "g");
};
