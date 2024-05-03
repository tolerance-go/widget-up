export type ModifyUMDOptions = {
  scriptContent: string;
  imports?: {
    globalVar: string;
    scopeVar: string;
  }[];
  exports?: {
    globalVar: string;
    scopeVar: string;
  };
};

export function modifyUMDScript(options: ModifyUMDOptions): string {
  const {
    scriptContent: originalScriptContent,
    imports = [],
    exports,
  } = options;

  // 生成导入变量的代码
  const importsCode = imports
    .map(
      ({ globalVar, scopeVar }) =>
        `customGlobal['${scopeVar}'] = global['${globalVar}'];`
    )
    .join("\n");

  const exportsCode = exports
    ? `global['${exports.globalVar}'] = customGlobal['${exports.scopeVar}'];`
    : "";

  // 修改后的 UMD 脚本内容
  const modifiedScriptContent = `
  (function(global) {
    var customGlobal = Object.create(null);
    var globalThis = customGlobal;
  
    ${importsCode}
  
    (function() {
      ${originalScriptContent}
    }).call(customGlobal);
    
    ${exportsCode}
  })(this);
  `;

  return modifiedScriptContent;
}
