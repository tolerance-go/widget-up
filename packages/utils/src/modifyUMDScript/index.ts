export type ModifyUMDOptions = {
  originalScriptContent: string;
  imports?: {
    globalVar: string;
    scopeVar: string;
  }[];
  exports: {
    globalVar: string;
    scopeVar: string;
  };
};

export function modifyUMDScript(options: ModifyUMDOptions): string {
  const { originalScriptContent, imports = [], exports } = options;

  // 生成导入变量的代码
  const importsCode = imports
    .map(
      ({ globalVar, scopeVar }) =>
        `customGlobal['${scopeVar}'] = global['${globalVar}'];`
    )
    .join("\n");

  // 修改后的 UMD 脚本内容
  const modifiedScriptContent = `
  (function(global) {
    var customGlobal = Object.create(null);
    var globalThis = customGlobal;
  
    ${importsCode}
  
    (function() {
      ${originalScriptContent}
    }).call(customGlobal);
    
    global['${exports.globalVar}'] = customGlobal['${exports.scopeVar}'];
  })(this);
  `;

  return modifiedScriptContent;
}
