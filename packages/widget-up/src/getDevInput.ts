import { PackageJson } from "widget-up-utils";

export const getDevInput = (packageConfig: PackageJson) => {
  if (packageConfig.peerDependencies?.react) {
    return "./.wup/index.tsx";
  }

  if (packageConfig.peerDependencies?.jquery) {
    return "./.wup/index.ts";
  }

  return "./.wup/index.ts";
};
