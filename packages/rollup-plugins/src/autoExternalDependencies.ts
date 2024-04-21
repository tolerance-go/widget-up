// 导入 Node.js 的文件系统和路径模块
import fs from "fs";
import path from "path";
import { Plugin } from "rollup";
import { getExternalDependencies } from "./getExternalDependencies";

// 定义插件函数
function autoExternalDependencies(): Plugin {
  return {
    name: "auto-external-dependencies",
    options(options) {
      const packageJsonPath = path.resolve(process.cwd(), "package.json");
      // 检查 package.json 文件是否存在
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error("package.json not found in the project root.");
      }

      const externalDependencies = getExternalDependencies(packageJsonPath);

      // 设置 external 配置
      if (options.external) {
        const originalExternal = options.external;
        // 处理外部依赖为函数的情况
        if (typeof originalExternal === "function") {
          options.external = (
            source: string,
            importer?: string,
            isResolved?: boolean
          ) =>
            originalExternal(source, importer, isResolved ?? false) ||
            externalDependencies.has(source);
        } else {
          // 合并原有外部依赖数组和新的外部依赖集
          options.external = [
            ...new Set([
              ...(originalExternal as string[]),
              ...externalDependencies,
            ]),
          ];
        }
      } else {
        // 如果不存在 external 配置，则直接设置为新的外部依赖集
        options.external = Array.from(externalDependencies);
      }
    },
  };
}

export default autoExternalDependencies;
