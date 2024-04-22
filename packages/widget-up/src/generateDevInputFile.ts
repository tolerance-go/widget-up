import path from "path";

import semver from "semver";
import { PackageJson, ParseConfig } from "widget-up-utils";
import { processEJSTemplate } from "./processEJSTemplate";

function cleanVersion(versionStr) {
  return versionStr.replace(/^[^0-9]+/, "");
}

export const generateDevInputFile = async ({
  rootPath,
  packageConfig,
  devInputFile,
  config,
}: {
  rootPath: string;
  config: ParseConfig;
  packageConfig: PackageJson;
  devInputFile: string;
}) => {
  const parsedInput = path.parse(path.posix.join("..", config.input));
  // 无论是否有 React，始终调用 processEJSTemplate
  await processEJSTemplate(
    path.join(
      rootPath,
      "tpls",
      `index.tsx.${
        packageConfig.dependencies.react
          ? "react"
          : packageConfig.dependencies.jquery
          ? "jquery"
          : "default"
      }.ejs`
    ),
    path.resolve(devInputFile),
    {
      dependencies: packageConfig.dependencies,
      input: path.posix.join(parsedInput.dir, parsedInput.name), // 去掉后缀名
      major: semver.major,
      cleanVersion,
    }
  );
};
