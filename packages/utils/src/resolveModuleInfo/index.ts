import { PackageConfig, ResolvedModuleInfo } from "@/types";
import fs from "fs";
import path from "path";
import { getModuleEntryPaths } from "../getModuleEntryPaths";

function resolveModuleInfo({
  name,
  cwd = process.cwd(),
}: {
  name: string;
  cwd?: string;
}): ResolvedModuleInfo {
  // 从当前工作目录开始向上查找 'node_modules'
  let currentPath = cwd;
  let modulePath;

  while (currentPath !== path.parse(currentPath).root) {
    const nodeModulesPath = path.join(currentPath, "node_modules");
    const possibleModulePath = path.join(nodeModulesPath, name);

    // 检查当前路径下的 'node_modules' 中是否存在指定的模块
    if (fs.existsSync(possibleModulePath)) {
      modulePath = possibleModulePath;
      break;
    }

    // 如果没有找到，继续在上一级目录中查找
    currentPath = path.dirname(currentPath);
  }

  if (!modulePath) {
    console.log(cwd);
    throw new Error(
      `Module '${name}' not found in any 'node_modules' directory from current path.`
    );
  }

  // 解析 package.json 文件的路径
  const packageJSONPath = path.join(modulePath, "package.json");

  if (!fs.existsSync(packageJSONPath)) {
    throw new Error(
      `package.json not found in resolved directory for '${name}'`
    );
  }

  // 读取并解析 package.json 文件
  const packageJSON: PackageConfig = JSON.parse(
    fs.readFileSync(packageJSONPath, "utf8")
  );

  const moduleEntries = getModuleEntryPaths({
    modulePath: cwd,
    packageConfig: packageJSON,
  });

  return {
    moduleEntries,
    packageJSON,
  };
}

export { resolveModuleInfo };
