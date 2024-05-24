import { ModuleEntryPathData, PackageConfig } from "@/types";
import path from "path";
import { logger } from "./logger";

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

  let moduleStyleEntryPath;
  if (typeof packageConfig.style === "string") {
    moduleStyleEntryPath = path.join(modulePath, packageConfig.style);
  }

  let moduleBrowserEntryRelPath, moduleBrowserEntryAbsPath;
  logger.log(`packageConfig.browser`, packageConfig.browser);

  if (typeof packageConfig.browser === "object") {
    /**
     * 我们假设如果为对象形式，
     * "browser": {
     *   ".": "./dist/your-library.umd.browser.js"
     * },
     * "." 才是 umd 入口文件
     */
    if (packageConfig.browser["."]) {
      moduleBrowserEntryRelPath = packageConfig.browser["."];
      moduleBrowserEntryAbsPath = path.join(
        modulePath,
        moduleBrowserEntryRelPath
      );
    }
  } else if (typeof packageConfig.browser === "string") {
    moduleBrowserEntryRelPath = packageConfig.browser;
    moduleBrowserEntryAbsPath = path.join(
      modulePath,
      moduleBrowserEntryRelPath
    );
  }

  return {
    moduleEntryAbsPath: moduleEntryPath,
    moduleEntryRelPath: mainFile,
    modulePath,
    moduleStyleEntryAbsPath: moduleStyleEntryPath,
    moduleStyleEntryRelPath: packageConfig.style,
    moduleBrowserEntryAbsPath,
    moduleBrowserEntryRelPath,
  };
};
