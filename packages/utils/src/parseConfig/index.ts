import { SchemaConfig, NormalizedUMDConfig, NormalizedConfig } from "@/types";

export function parseConfig(config: SchemaConfig): NormalizedConfig {
  // 首先处理 UMD 配置的解析，特别是 external 字段
  const normalizedUMD: NormalizedUMDConfig = {
    name: config.umd.name,
    external: config.umd.external,
    globals: config.umd.globals,
    dependenciesEntries: Object.fromEntries(
      Object.entries(config.umd.dependenciesEntries ?? {}).map(
        ([key, value]) => {
          return [
            key,
            typeof value === "string"
              ? {
                  development: value,
                  production: value,
                }
              : {
                  development: value.development,
                  production: value.production,
                },
          ];
        }
      )
    ),
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
