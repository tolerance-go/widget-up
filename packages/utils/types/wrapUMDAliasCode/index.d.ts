/**
 * 作用域对象的名称
 */
export type ScopeObjectName = "window" | "global";

// 写入文件的 UMDAliasOptions，是UMDAliasOptions 的 required 模式
export type UMDAliasJSONOptions = Required<UMDAliasOptions>;

export type UMDAliasOptions = {
  imports?: {
    globalVar: string;
    scopeVar: string;
    scopeName?: ScopeObjectName;
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
