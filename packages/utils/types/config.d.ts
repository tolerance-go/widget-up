import { FormSchemaConfig } from "./form";

export type EnvPaths = {
  development: string;
  production: string;
};

export interface ExternalLibrarySchemaConfig {
  path:
    | EnvPaths
    // 用于开发环境和生产环境都是同一个文件
    | string;
}
export interface ParsedExternalLibraryConfig {
  path: EnvPaths;
}

// 定义外部库配置中 global 和 peerDependencies 的类型

// 定义整个 external 部分的类型
export interface ExternalSchemaConfig {
  [libName: string]: ExternalLibrarySchemaConfig;
}

export interface ParsedExternalConfig {
  [libName: string]: ParsedExternalLibraryConfig;
}

// 定义单个库在 global 中的 unpkg 配置

// 定义全局库配置的类型
export interface GlobalsSchemaConfig {
  [libName: string]: string;
}

// 定义 UMD 配置的类型
export interface UMDSchemaConfig {
  name: string;
  external: ExternalSchemaConfig;
  globals: GlobalsSchemaConfig;
}

export interface ParedUMDConfig {
  name: string;
  external: ParsedExternalConfig;
  globals: GlobalsSchemaConfig;
}

export type CSSModuleType = "modules" | "autoModules";

// 定义最顶层的配置对象类型
export interface SchemaConfig {
  input: string;
  umd: UMDSchemaConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | CSSModuleType;
  form?: FormSchemaConfig;
}

export interface ParseConfig {
  input: string;
  umd: ParedUMDConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | CSSModuleType;
  form?: FormSchemaConfig;
}
