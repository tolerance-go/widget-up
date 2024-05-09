import { PathManager } from "@/src/managers/getPathManager";
import { resolveNpmInfo } from "@/src/utils/resolveNpmInfo";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";

export function genRuntimeLib({
  pathManager,
}: {
  pathManager: PathManager;
}): Plugin {
  return {
    name: "gen-assert",
    buildStart() {
      const wupRuntimeLibNpm = resolveNpmInfo({
        name: "widget-up-runtime",
        cwd: pathManager.rootPath,
      });

      const content = fs.readFileSync(
        wupRuntimeLibNpm.moduleEntryPath,
        "utf-8"
      );

      const styleContent = wupRuntimeLibNpm.moduleStyleEntryPath
        ? fs.readFileSync(wupRuntimeLibNpm.moduleStyleEntryPath, "utf-8")
        : "";

      // 从内存写入文件
      const destJsFile = path.join(
        pathManager.serverPath,
        `${wupRuntimeLibNpm.packageJson.name}.js`
      );

      const destStyleFile = path.join(
        pathManager.serverPath,
        `${wupRuntimeLibNpm.packageJson.name}.css`
      );

      fs.ensureDirSync(pathManager.serverPath);

      fs.writeFileSync(destJsFile, content); // 写入文件内容

      if (styleContent) {
        fs.writeFileSync(destStyleFile, styleContent); // 写入文件内容
      }
    },
  };
}
