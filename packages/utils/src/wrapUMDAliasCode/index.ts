// 写入文件的 UMDAliasOptions，是UMDAliasOptions 的 required 模式
export type UMDAliasJSONOptions = Required<UMDAliasOptions>;

/**
 * 作用域对象的名称
 */
export type ScopeObjectName = "window" | "global";

export type UMDAliasOptions = {
  imports?: {
    globalVar: string;
    scopeVar: string;
  }[];
  exports?: {
    globalVar: string;
    scopeVar: string;
    scopeName?: ScopeObjectName;
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
      ({ globalVar, scopeVar, scopeName = "global" }) =>
        `global['${globalVar}'] = ${
          scopeName === "global"
            ? "customGlobal"
            : scopeName === "window"
            ? "customWindow"
            : "customGlobal"
        }['${scopeVar}'];`
    )
    .join("\n");

  // 修改后的 UMD 脚本内容
  const modifiedScriptContent = `
  (function(global) {
    var customGlobal = Object.create(null);
    var globalThis = customGlobal;
    var self = customGlobal;
    var customWindow = WidgetUpRuntime.createWindow(window);
  
    ${importsCode}
  
    (function() {
      var window = customWindow;
      ${originalScriptContent}
    }).call(customGlobal);
    
    ${exportsCode}
  })(this);
  `;

  return modifiedScriptContent;
}
