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
  // 使用 require.resolve 找到模块的入口文件路径
  const moduleEntryPath = require.resolve(options.name);

  // 向上查找直到找到 'node_modules' 目录
  let currentPath = path.dirname(moduleEntryPath);
  let resolvePath = currentPath; // 初始化解析路径

  // 循环直到找到包含 'node_modules' 的目录的子目录
  while (currentPath !== path.parse(currentPath).root) {
    const parentNode = path.basename(path.dirname(currentPath));
    if (parentNode === "node_modules") {
      resolvePath = currentPath;
      break;
    }
    currentPath = path.dirname(currentPath);
  }

  const modulePath = resolvePath;

  // 解析 package.json 文件的路径
  const packageJsonPath = path.join(modulePath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(
      `package.json not found in resolved directory for '${options.name}'`
    );
  }

  // 读取 package.json 文件
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  return {
    moduleEntryPath: normalizePath(moduleEntryPath),
    modulePath: normalizePath(modulePath),
    packageJson,
  };
}

export { resolvedNpm };
