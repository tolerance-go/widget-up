import { ExternalConfig, ParsedExternalConfig } from "./types.js";

// 改写的 TypeScript 函数，增加了类型注解
export function parseExternal(external: ExternalConfig): ParsedExternalConfig {
  const next: { [key: string]: any } = {};

  for (const [libName, config] of Object.entries(external)) {
    next[libName] = {};

    if (typeof config === "string") {
      // 当配置直接为字符串时，默认视为全局对象名称
      next[libName].global = config;
    } else {
      // 如果配置为对象，则检查 global 和 peerDependencies
      if (config.global) {
        next[libName].global = config.global;
      }
      if (config.peerDependencies) {
        if (typeof config.peerDependencies === "string") {
          next[libName].peerDependencies = [config.peerDependencies];
        } else {
          next[libName].peerDependencies = config.peerDependencies;
        }
      }
    }
  }

  return next as ParsedExternalConfig;
}
