// 定义外部库配置中 global 和 peerDependencies 的类型
export interface ExternalLibraryConfig {
  global?: string;
  peerDependencies?: string[] | string;
}

// 定义整个 external 部分的类型
export interface ExternalConfig {
  [libName: string]: string | ExternalLibraryConfig;
}

export interface ParsedExternalConfig {
  [libName: string]: ExternalLibraryConfig;
}

// 定义单个库在 global 中的 unpkg 配置
export interface UnpkgConfig {
  filePath: string;
}

// 定义全局库配置的类型
export interface GlobalConfig {
  [libName: string]: {
    unpkg: UnpkgConfig;
  };
}

// 定义 UMD 配置的类型
export interface UMDConfig {
  name: string;
  external: ExternalConfig;
  global: GlobalConfig;
}

export interface ParedUMDConfig {
  name: string;
  external: ParsedExternalConfig;
  global: GlobalConfig;
}

// 定义最顶层的配置对象类型
export interface Config {
  input: string;
  umd?: UMDConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | string;
}

export interface ParseConfig {
  input: string;
  umd?: ParedUMDConfig;
  cjs?: boolean;
  esm?: boolean;
  css?: boolean | string;
}
