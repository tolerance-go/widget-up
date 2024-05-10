// 导入PathManager类，用于路径管理
import { PathManager } from "@/src/managers/getPathManager";

// 导入resolveNpmInfo函数，用于解析NPM包信息
import { resolveNpmInfo } from "@/src/utils/resolveNpmInfo";

// 导入fs-extra库，扩展了fs库的功能，提供更多的文件操作API
import fs from "fs-extra";

// 导入path库，用于处理文件路径
import path from "path";

// 导入Rollup的Plugin接口
import { InputPluginOption } from "rollup";

// 定义genRuntimeLib函数，用于生成运行时库的Rollup插件
export function genRuntimeLib({
  pathManager, // 接收一个PathManager实例作为参数
}: {
  pathManager: PathManager;
}): InputPluginOption {
  return {
    name: "gen-assert", // 插件名称
    buildStart() {
      // 插件的buildStart钩子
      // 使用resolveNpmInfo函数获取运行时库的信息
      const wupRuntimeLibNpm = resolveNpmInfo({
        name: "widget-up-runtime", // 包名
        cwd: pathManager.rootPath, // 当前工作目录，设置为根路径
      });

      // 读取模块的入口文件内容
      const content = fs.readFileSync(
        wupRuntimeLibNpm.moduleEntryPath, // 文件路径
        "utf-8" // 指定编码
      );

      // 根据是否存在样式入口路径，读取样式文件内容
      const styleContent = wupRuntimeLibNpm.moduleStyleEntryPath
        ? fs.readFileSync(wupRuntimeLibNpm.moduleStyleEntryPath, "utf-8")
        : "";

      // 设置JavaScript文件的目标路径
      const destJsFile = path.join(
        pathManager.serverPath, // 服务器路径
        `${wupRuntimeLibNpm.packageJson.name}.js` // 文件名
      );

      // 设置CSS文件的目标路径
      const destStyleFile = path.join(
        pathManager.serverPath, // 服务器路径
        `${wupRuntimeLibNpm.packageJson.name}.css` // 文件名
      );

      // 确保目标目录存在，不存在则创建
      fs.ensureDirSync(pathManager.serverPath);

      // 将JavaScript内容写入目标文件
      fs.writeFileSync(destJsFile, content);

      // 如果有样式内容，则将样式内容写入目标样式文件
      if (styleContent) {
        fs.writeFileSync(destStyleFile, styleContent);
      }
    },
  };
}
