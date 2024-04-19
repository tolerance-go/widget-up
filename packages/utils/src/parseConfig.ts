import { parseExternal } from "./parseExternal";
import { Config, ParseConfig, ParedUMDConfig } from "./types";

export function parseConfig(config: Config): ParseConfig {
  // 首先处理 UMD 配置的解析，特别是 external 字段
  const parsedUMD: ParedUMDConfig | undefined = config.umd
    ? {
        name: config.umd.name,
        external: parseExternal(config.umd.external),
        global: config.umd.global,
      }
    : undefined;

  // 构建 ParseConfig 对象，包括处理好的 UMD 配置
  const parsedConfig: ParseConfig = {
    input: config.input,
    umd: parsedUMD,
    cjs: config.cjs,
    esm: config.esm,
    css: config.css,
  };

  return parsedConfig;
}
