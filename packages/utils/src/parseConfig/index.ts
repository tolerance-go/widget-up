import {
  NormalizedConfig,
  NormalizedExternalDependency,
  NormalizedUMDConfig,
  SchemaConfig,
} from "@/types";

export function parseConfig(config: SchemaConfig): NormalizedConfig {
  // 首先处理 UMD 配置的解析，特别是 external 字段
  const normalizedUMD: NormalizedUMDConfig = {
    name: config.umd.name,
    external: config.umd.external,
    globals: config.umd.globals,
    externalDependencies: Object.fromEntries(
      Object.entries(config.umd.externalDependencies ?? {}).map(
        ([key, value]) => {
          return [
            key,
            {
              name: value.name,
              external: value.external || [],
              globals: value.globals || {},
              browser:
                typeof value.browser === "string"
                  ? {
                      development: value.browser,
                      production: value.browser,
                    }
                  : value.browser,
              style:
                typeof value.style === "string"
                  ? { development: value.style, production: value.style }
                  : value.style,
            } as NormalizedExternalDependency,
          ];
        }
      )
    ),
  };

  // 构建 ParseConfig 对象，包括处理好的 UMD 配置
  const normalizedConfig: NormalizedConfig = {
    input: config.input,
    umd: normalizedUMD,
    cjs: config.cjs || false,
    esm: config.esm || false,
    css: config.css || false,
    form: config.form || {},
  };

  return normalizedConfig;
}
