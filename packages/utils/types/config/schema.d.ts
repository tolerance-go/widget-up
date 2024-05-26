import { FormSchemaConfig } from "../form";
import { ScopeObjectName } from "../wrapUMDAliasCode";
import { BrowserEntry, CSSModuleType, StyleEntry } from "./base";

// 定义全局库配置的类型
export interface GlobalsSchemaConfig {
  [libName: string]: string;
}

export type ExternalConfig = string[];

export type UMDSchemaConfig = {
  name: string;
  external?: ExternalConfig;
  globals?: GlobalsSchemaConfig;
  browser?: BrowserEntry | string;
  style?: StyleEntry | string;
  exportScopeObjectName?: ScopeObjectName;
};

export type DependenciesUMDSchemaConfig = Record<string, UMDSchemaConfig>;

// 定义最顶层的配置对象类型
export interface SchemaConfig {
  input: string;
  umd: DependenciesUMDSchemaConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | CSSModuleType;
  form?: FormSchemaConfig;
}
