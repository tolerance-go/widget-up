import { PackageJson } from "widget-up-utils";

export const getDevInput = (packageConfig: PackageJson) => {
  const devInputFile = packageConfig.dependencies.react
    ? "./.wup/index.tsx"
    : packageConfig.dependencies.jquery
    ? "./.wup/index.ts"
    : "./.wup/index.ts";

  return devInputFile;
};
