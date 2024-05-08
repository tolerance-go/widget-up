/**
 * 是什么
 *
 * - 生产环境下，生成 Rollup 的 output 配置
 */
import { RollupOptions } from "rollup";
import { GlobalsSchemaConfig, ParseConfig } from "widget-up-utils";

export function getProdOutputs(config: ParseConfig) {
  const outputs: RollupOptions["output"] = [];

  // UMD 格式始终包含
  outputs.push({
    file: "dist/umd/index.js",
    format: "umd",
    name: config.umd.name,
    globals: config.umd.globals,
  });

  if (config.esm) {
    outputs.push({
      file: "dist/esm/index.js",
      format: "esm",
    });
  }

  // 根据配置动态添加 CJS 和 ESM 格式
  if (config.cjs) {
    outputs.push({
      file: "dist/cjs/index.js",
      format: "cjs",
    });
  }

  return outputs;
}
