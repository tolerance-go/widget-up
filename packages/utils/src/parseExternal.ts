import { ExternalConfig, ParsedExternalConfig } from "./types";

// 改写的 TypeScript 函数，增加了类型注解
export function parseExternal(external: ExternalConfig): ParsedExternalConfig {
  const next: { [key: string]: any } = {};

  for (const [libName, config] of Object.entries(external)) {
    next[libName] = config;

    if (config.peerDependencies) {
      if (typeof config.peerDependencies === "string") {
        next[libName].peerDependencies = [config.peerDependencies];
      } else {
        next[libName].peerDependencies = config.peerDependencies;
      }
    }
  }

  return next as ParsedExternalConfig;
}
