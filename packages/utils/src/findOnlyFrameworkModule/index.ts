import { PackageJson } from "@/types";
import { findFrameworkModules } from "../findFrameworkModules";

export function findOnlyFrameworkModule({ cwd }: { cwd: string }): PackageJson {
  const frameworkModules = findFrameworkModules({
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
