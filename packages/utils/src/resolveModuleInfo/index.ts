import path from "path";
import fs from "fs";
import { PackageConfig, ResolvedModuleInfo } from "@/types";
import { normalizePath } from "../normalizePath";

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
    throw new Error(
      `Module '${name}' not found in any 'node_modules' directory from current path. cwd: ${cwd}`
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

  // 确定模块的入口文件路径
  const mainFile = packageJSON.main || "index.js"; // 如果package.json中没有指定main，则默认为index.js
  const moduleEntryPath = path.join(modulePath, mainFile);

  const moduleStyleEntryPath =
    packageJSON.style && path.join(modulePath, packageJSON.style);

  return {
    moduleEntryAbsPath: normalizePath(moduleEntryPath),
    moduleEntryRelPath: mainFile,
    modulePath: normalizePath(modulePath),
    moduleStyleEntryAbsPath: moduleStyleEntryPath,
    packageJSON: packageJSON,
  };
}

export { resolveModuleInfo };
