import path from "path";
import fs from "fs";
import { PackageJson } from "widget-up-utils";
import { normalizePath } from "../normalizePath";

export interface ResolvedNpmResult {
  modulePath: string;
  moduleEntryPath: string;
  packageJson: PackageJson;
}

function resolvedNpm(options: { name: string }): ResolvedNpmResult {
  // 从当前工作目录开始向上查找 'node_modules'
  let currentPath = process.cwd();
  let modulePath;

  while (currentPath !== path.parse(currentPath).root) {
    const nodeModulesPath = path.join(currentPath, "node_modules");
    const possibleModulePath = path.join(nodeModulesPath, options.name);

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
      `Module '${options.name}' not found in any 'node_modules' directory from current path.`
    );
  }

  // 解析 package.json 文件的路径
  const packageJsonPath = path.join(modulePath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(
      `package.json not found in resolved directory for '${options.name}'`
    );
  }

  // 读取并解析 package.json 文件
  const packageJson: PackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  );

  // 确定模块的入口文件路径
  const mainFile = packageJson.main || "index.js"; // 如果package.json中没有指定main，则默认为index.js
  const moduleEntryPath = path.join(modulePath, mainFile);

  return {
    moduleEntryPath: normalizePath(moduleEntryPath),
    modulePath: normalizePath(modulePath),
    packageJson,
  };
}

export { resolvedNpm };