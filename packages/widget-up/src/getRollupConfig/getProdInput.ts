/**
 * 是什么
 *
 * - 动态获取入口文件
 * - 如果 package.json 中有 react 依赖，则入口文件为 index.tsx
 */
import { PackageJson } from "widget-up-utils";

export const getInputFile = (packageConfig: PackageJson) => {
  if (packageConfig.peerDependencies?.react) {
    return "./src/index.tsx";
  }

  return "./src/index.ts";
};
