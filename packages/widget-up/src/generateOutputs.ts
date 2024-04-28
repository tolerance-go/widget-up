import { ParseConfig, GlobalsSchemaConfig } from "widget-up-utils";
import { BuildEnvIsDev } from "./env";
import { RollupOptions } from "rollup";

// 构建输出数组
export function generateOutputs(
  config: ParseConfig,
  globals?: GlobalsSchemaConfig,
) {
  const outputs: RollupOptions["output"] = [];

  if (config.umd ?? true) {
    // UMD 格式始终包含
    outputs.push({
      file: "dist/umd/index.js",
      format: "umd",
      name: config.umd?.name,
      globals,
      sourcemap: BuildEnvIsDev ? "inline" : false,
    });
  }

  if (BuildEnvIsDev) return outputs;

  if (config.esm ?? true) {
    outputs.push({
      file: "dist/esm/index.js",
      format: "esm",
      sourcemap: BuildEnvIsDev ? "inline" : false,
    });
  }

  // 根据配置动态添加 CJS 和 ESM 格式
  if (config.cjs) {
    outputs.push({
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: BuildEnvIsDev ? "inline" : false,
    });
  }

  return outputs;
}
