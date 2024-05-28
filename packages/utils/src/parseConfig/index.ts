import {
  NormalizedConfig,
  NormalizedDependenciesUMDConfig,
  NormalizedUMDConfig,
  PackageConfig,
  SchemaConfig,
} from "@/types";
import { ensure } from "../ensure";
import { UMD_NAME_PLACEHOLDER } from "../datas/constants";

export function parseConfig(
  config: SchemaConfig,
  packageConfig: PackageConfig
): NormalizedConfig {
  // 首先处理 UMD 配置的解析，特别是 external 字段
  const normalizedUMD: NormalizedDependenciesUMDConfig = Object.fromEntries(
    Object.entries(config.umd ?? {}).map(([key, value]) => {
      let browser = value.browser;
      let style = value.style;

      if (key === UMD_NAME_PLACEHOLDER) {
        key = packageConfig.name;

        browser = browser || packageConfig.browser;
        style = style || packageConfig.style;
      }

      ensure(browser !== undefined, `${key} browser 没有定义`, "info:", {
        browser,
        key,
        value,
      });

      const obj: NormalizedUMDConfig = {
        name: value.name,
        external: value.external || [],
        globals: value.globals || {},
        browser:
          typeof browser === "string"
            ? {
                development: browser,
                production: browser,
              }
            : browser,
        style:
          typeof style === "string"
            ? { development: style, production: style }
            : style,
        exportScopeObjectName: value.exportScopeObjectName || "global",
        importScopeObjectName: value.importScopeObjectName || 'global',
        extraPeerDependencies: value.extraPeerDependencies,
      };
      return [key, obj];
    })
  );

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
