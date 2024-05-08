import { SchemaConfig, NormalizedUMDConfig, NormalizedConfig } from "@/types";

export function parseConfig(config: SchemaConfig): NormalizedConfig {
  // 首先处理 UMD 配置的解析，特别是 external 字段
  const normalizedUMD: NormalizedUMDConfig = {
    name: config.umd.name,
    external: config.umd.external,
    globals: config.umd.globals,
    dependenciesEntries: config.umd.dependenciesEntries ?? {},
  };

  // 构建 ParseConfig 对象，包括处理好的 UMD 配置
  const normalizedConfig: NormalizedConfig = {
    input: config.input,
    umd: normalizedUMD,
    cjs: config.cjs,
    esm: config.esm,
    css: config.css,
    form: config.form,
  };

  return normalizedConfig;
}
