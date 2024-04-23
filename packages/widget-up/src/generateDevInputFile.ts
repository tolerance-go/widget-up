import path from "path";

import semver from "semver";
import { PackageJson, ParseConfig } from "widget-up-utils";
import { processEJSTemplate } from "./processEJSTemplate";

function cleanVersion(versionStr: string) {
  return versionStr.replace(/^[^0-9]+/, "");
}

function selectTemplateFile(packageConfig: PackageJson): string {
  if (packageConfig.peerDependencies?.react) {
    return "index.tsx.react.ejs";
  } else if (packageConfig.peerDependencies?.jquery) {
    return "index.tsx.jquery.ejs";
  } else {
    return "index.tsx.default.ejs";
  }
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
    path.join(rootPath, "tpls", selectTemplateFile(packageConfig)),
    path.resolve(devInputFile),
    {
      dependencies: packageConfig.dependencies,
      input: path.posix.join(parsedInput.dir, parsedInput.name), // 去掉后缀名
      major: semver.major,
      cleanVersion,
    }
  );
};
