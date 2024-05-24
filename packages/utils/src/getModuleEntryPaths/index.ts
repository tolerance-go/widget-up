import path from "path";
import { ModuleEntryPathData, PackageConfig } from "@/types";

export const getModuleEntryPaths = ({
  modulePath,
  packageConfig,
}: {
  modulePath: string;
  packageConfig: PackageConfig;
}): ModuleEntryPathData => {
  // 确定模块的入口文件路径
  const mainFile = packageConfig.main || "index.js"; // 如果package.json中没有指定main，则默认为index.js
  const moduleEntryPath = path.join(modulePath, mainFile);

  const moduleStyleEntryPath =
    packageConfig.style && path.join(modulePath, packageConfig.style);

  const moduleBrowserEntryPath =
    packageConfig.browser && path.join(modulePath, packageConfig.browser);

  return {
    moduleEntryPath,
    modulePath,
    moduleStyleEntryPath,
    moduleBrowserEntryPath,
  };
};
