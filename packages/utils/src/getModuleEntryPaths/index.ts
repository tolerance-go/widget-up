import { ModuleEntryPathData, PackageConfig } from "@/types";
import path from "path";
import { logger } from "./logger";

export const getModuleEntryPaths = ({
  modulePath,
  packageConfig,
  customConfig,
}: {
  modulePath: string;
  packageConfig: PackageConfig;
  customConfig?: {
    style?: string;
    browser?: string;
  };
}): ModuleEntryPathData => {
  logger.info({
    modulePath,
    customConfig,
  });

  // 确定模块的入口文件路径
  const mainFile = packageConfig.main || "index.js"; // 如果package.json中没有指定main，则默认为index.js
  const moduleEntryPath = path.join(modulePath, mainFile);
  const style = customConfig?.style ?? packageConfig.style;
  const browser = customConfig?.browser ?? packageConfig.browser;

  let moduleStyleEntryPath;
  if (typeof style === "string") {
    moduleStyleEntryPath = path.join(modulePath, style);
  }

  let moduleBrowserEntryRelPath, moduleBrowserEntryAbsPath;

  if (typeof browser === "object") {
    /**
     * 我们假设如果为对象形式，
     * "browser": {
     *   ".": "./dist/your-library.umd.browser.js"
     * },
     * "." 才是 umd 入口文件
     */
    if (browser["."]) {
      moduleBrowserEntryRelPath = browser["."];
      moduleBrowserEntryAbsPath = path.join(
        modulePath,
        moduleBrowserEntryRelPath
      );
    }
  } else if (typeof browser === "string") {
    moduleBrowserEntryRelPath = browser;
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
    moduleStyleEntryRelPath: style,
    moduleBrowserEntryAbsPath,
    moduleBrowserEntryRelPath,
  };
};
