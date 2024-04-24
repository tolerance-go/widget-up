import { PackageJson, ParseConfig } from "widget-up-utils";

export const getProdInput = (packageConfig: PackageJson) => {
  if (packageConfig.peerDependencies?.react) {
    return "./src/index.tsx";
  }

  return "./src/index.ts";
};
