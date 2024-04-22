import fs from "fs";
import path from "path";
import { Plugin } from "rollup";

// 定义插件函数
function peerDependenciesAsExternal(): Plugin {
  return {
    name: "peer-dependencies-external",
    options(options) {
      const packageJsonPath = path.resolve(process.cwd(), "package.json");
      // 检查 package.json 文件是否存在
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error("package.json not found in the project root.");
      }

      // 读取 package.json 文件内容
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const peerDependencies = packageJson.peerDependencies
        ? Object.keys(packageJson.peerDependencies)
        : [];

      // 设置 external 配置
      if (options.external) {
        // 如果已经存在 external 配置，合并新的依赖
        const originalExternal = options.external;
        if (typeof originalExternal === "function") {
          // 处理外部依赖为函数的情况
          options.external = (source, importer, isResolved) =>
            originalExternal(source, importer, isResolved ?? false) ||
            peerDependencies.includes(source);
        } else {
          // 合并原有外部依赖数组和新的外部依赖集
          options.external = [
            ...new Set([
              ...(Array.isArray(originalExternal)
                ? originalExternal
                : [originalExternal]),
              ...peerDependencies,
            ]),
          ];
        }
      } else {
        // 如果不存在 external 配置，则直接设置为新的外部依赖集
        options.external = peerDependencies;
      }
    },
  };
}

export default peerDependenciesAsExternal;
