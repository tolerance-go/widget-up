import { PathManager } from "@/src/getPathManager";
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

      // 从内存写入文件
      const destFile = path.join(
        pathManager.serverPath,
        `${wupRuntimeLibNpm.packageJson.name}.js`
      );

      fs.ensureDirSync(pathManager.serverPath);
      fs.writeFileSync(destFile, content); // 写入文件内容
    },
  };
}
