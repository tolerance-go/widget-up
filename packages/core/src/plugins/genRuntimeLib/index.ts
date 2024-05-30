import { PathManager } from "@/src/managers/pathManager";
import { resolveModuleInfo } from "widget-up-utils";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";
import { IdentifierManager } from "@/src/managers/identifierManager";

// 定义genRuntimeLib函数，用于生成运行时库的Rollup插件
export function genRuntimeLib(): Plugin {
  // 初始化标志以防止重复监听器设置
  let initialized = false;

  const pathManager = PathManager.getInstance();
  const identifierManager = IdentifierManager.getInstance();

  return {
    name: "gen-runtime-lib", // 插件名称
    buildStart() {
      // 如果已经初始化过，则直接返回
      if (initialized) {
        return;
      }

      // 标记为已初始化，防止下次构建重复执行
      initialized = true;

      // 使用resolveModuleInfo函数获取运行时库的信息
      const wupRuntimeModuleInfo = resolveModuleInfo({
        name: "widget-up-runtime", // 包名
        cwd: pathManager.modulePath, // 当前工作目录，设置为根路径
      });

      const copyJS = () => {
        // 读取模块的入口文件内容
        const content = fs.readFileSync(
          wupRuntimeModuleInfo.moduleEntries.moduleEntryAbsPath,
          "utf-8"
        );

        // 设置JavaScript文件和CSS文件的目标路径
        const destJsFile = path.join(
          pathManager.distServerScriptsAbsPath,
          `${identifierManager.widgetUpRuntimeName}.js`
        );

        // 确保目标目录存在，不存在则创建
        fs.ensureDirSync(path.dirname(destJsFile));

        // 将JavaScript内容和样式内容写入目标文件
        fs.writeFileSync(destJsFile, content);
      };

      const copyStyle = () => {
        if (!wupRuntimeModuleInfo.moduleEntries.moduleStyleEntryAbsPath) return;

        // 根据是否存在样式入口路径，读取样式文件内容
        const styleContent = fs.readFileSync(
          wupRuntimeModuleInfo.moduleEntries.moduleStyleEntryAbsPath,
          "utf-8"
        );

        const destStyleFile = path.join(
          pathManager.distServerScriptsAbsPath,
          `${identifierManager.widgetUpRuntimeName}.css`
        );

        fs.ensureDirSync(path.dirname(destStyleFile));
        fs.writeFileSync(destStyleFile, styleContent);
      };

      // 监听JavaScript文件和CSS文件的变化
      fs.watch(
        wupRuntimeModuleInfo.moduleEntries.moduleEntryAbsPath,
        (eventType, filename) => {
          if (eventType === "change") {
            console.log(`${filename} has been changed, copying...`);
            copyJS();
          }
        }
      );

      if (wupRuntimeModuleInfo.moduleEntries.moduleStyleEntryAbsPath) {
        fs.watch(
          wupRuntimeModuleInfo.moduleEntries.moduleStyleEntryAbsPath,
          (eventType, filename) => {
            if (eventType === "change") {
              console.log(`${filename} has been changed, copying...`);
              copyStyle();
            }
          }
        );
      }

      // 首次执行拷贝
      copyJS();
      copyStyle();
    },
  };
}
