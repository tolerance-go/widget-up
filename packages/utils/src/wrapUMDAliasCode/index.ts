// 写入文件的 UMDAliasOptions，是UMDAliasOptions 的 required 模式
export type UMDAliasJSONOptions = Required<UMDAliasOptions>;

export type UMDAliasOptions = {
  imports?: {
    globalVar: string;
    scopeVar: string;
  }[];
  exports?: {
    globalVar: string;
    scopeVar: string;
  }[];
};

export type ModifyUMDOptions = {
  scriptContent: string;
} & UMDAliasOptions;

export function wrapUMDAliasCode(options: ModifyUMDOptions): string {
  const {
    scriptContent: originalScriptContent,
    imports = [],
    exports = [],
  } = options;

  // 生成导入变量的代码
  const importsCode = imports
    .map(
      ({ globalVar, scopeVar }) =>
        `customGlobal['${scopeVar}'] = global['${globalVar}'];`
    )
    .join("\n");

  const exportsCode = exports
    .map(
      ({ globalVar, scopeVar }) =>
        `global['${globalVar}'] = customGlobal['${scopeVar}'];`
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
    
    ${exportsCode}
  })(this);
  `;

  return modifiedScriptContent;
}
