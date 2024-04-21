import { Form } from "./form";

export interface ParsedExternalLibraryConfig {
  peerDependencies?: string[];
  unpkg: UnpkgConfig;
}

// 定义外部库配置中 global 和 peerDependencies 的类型
export interface ExternalLibraryConfig {
  peerDependencies?: string[] | string;
  unpkg: UnpkgConfig;
}

// 定义整个 external 部分的类型
export interface ExternalConfig {
  [libName: string]: ExternalLibraryConfig;
}

export interface ParsedExternalConfig {
  [libName: string]: ParsedExternalLibraryConfig;
}

// 定义单个库在 global 中的 unpkg 配置
export interface UnpkgConfig {
  filePath: string;
  filePathDev?: string;
}

// 定义全局库配置的类型
export interface GlobalsConfig {
  [libName: string]: string;
}

// 定义 UMD 配置的类型
export interface UMDConfig {
  name: string;
  external: ExternalConfig;
  globals: GlobalsConfig;
}

export interface ParedUMDConfig {
  name: string;
  external: ParsedExternalConfig;
  globals: GlobalsConfig;
}

// 定义最顶层的配置对象类型
export interface Config {
  input: string;
  umd?: UMDConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | "modules" | "autoModules";
  form?: Form;
}

export interface ParseConfig {
  input: string;
  umd?: ParedUMDConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | "modules" | "autoModules";
  form?: Form;
}
