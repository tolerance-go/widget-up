import { FormSchemaConfig } from "../form";
import { CSSModuleType, StyleEntry } from "./base";

// 定义单个库在 global 中的 unpkg 配置

// 定义全局库配置的类型
export interface GlobalsSchemaConfig {
  [libName: string]: string;
}

export type ExternalConfig = string[];

// 定义 UMD 配置的类型
export interface UMDSchemaConfig {
  name: string;
  external: string[];
  globals: GlobalsSchemaConfig;
  externalDependencies?: ExternalDependencies;
}

export type BrowserEntry = {
  development: string;
  production: string;
};

export type ExternalDependency = {
  name: string;
  external?: ExternalConfig;
  globals?: GlobalsSchemaConfig;
  browser?: BrowserEntry | string;
  style?: StyleEntry | string;
};

export type ExternalDependencies = Record<string, ExternalDependency>;

// 定义最顶层的配置对象类型
export interface SchemaConfig {
  input: string;
  umd: UMDSchemaConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | CSSModuleType;
  form?: FormSchemaConfig;
}
