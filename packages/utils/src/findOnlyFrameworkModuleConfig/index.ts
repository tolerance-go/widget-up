import { PackageConfig } from "@/types";
import { findFrameworkModuleConfigs } from "../findFrameworkModuleConfigs";

export function findOnlyFrameworkModuleConfig({
  cwd,
}: {
  cwd: string;
}): PackageConfig {
  const frameworkModules = findFrameworkModuleConfigs({
    cwd,
  });

  if (frameworkModules.length > 1) {
    throw new Error("框架重复出现");
  }

  const frameworkModule = frameworkModules[0];

  if (!frameworkModule) {
    throw new Error("框架未检测到");
  }

  return frameworkModule;
}
