import path from "path";
import { ModuleEntryPathData, PackageConfig } from "@/types";

export const getModuleEntryPaths = ({
  modulePath,
  packageJson,
}: {
  modulePath: string;
  packageJson: PackageConfig;
}): ModuleEntryPathData => {
  // 确定模块的入口文件路径
  const mainFile = packageJson.main || "index.js"; // 如果package.json中没有指定main，则默认为index.js
  const moduleEntryPath = path.join(modulePath, mainFile);

  const moduleStyleEntryPath =
    packageJson.style && path.join(modulePath, packageJson.style);

  const moduleBrowserEntryPath =
    packageJson.browser && path.join(modulePath, packageJson.browser);

  return {
    moduleEntryPath,
    modulePath,
    moduleStyleEntryPath,
    moduleBrowserEntryPath,
  };
};
