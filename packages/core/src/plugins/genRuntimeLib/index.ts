import { PathManager } from "@/src/managers/pathManager";
import { resolveModuleInfo } from "widget-up-utils";
import fs from "fs-extra";
import path from "path";
import { Plugin } from "rollup";

// 定义genRuntimeLib函数，用于生成运行时库的Rollup插件
export function genRuntimeLib(): Plugin {
  // 初始化标志以防止重复监听器设置
  let initialized = false;

  const pathManager = PathManager.getInstance();

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
      const wupRuntimeLibNpm = resolveModuleInfo({
        name: "widget-up-runtime", // 包名
        cwd: pathManager.modulePath, // 当前工作目录，设置为根路径
      });

      const copyJS = () => {
        // 读取模块的入口文件内容
        const content = fs.readFileSync(
          wupRuntimeLibNpm.moduleEntryPath,
          "utf-8"
        );

        // 设置JavaScript文件和CSS文件的目标路径
        const destJsFile = path.join(
          pathManager.distServerScriptsAbsPath,
          `${pathManager.widgetUpRuntimeName}.js`
        );

        // 确保目标目录存在，不存在则创建
        fs.ensureDirSync(path.dirname(destJsFile));

        // 将JavaScript内容和样式内容写入目标文件
        fs.writeFileSync(destJsFile, content);
      };

      const copyStyle = () => {
        if (!wupRuntimeLibNpm.moduleStyleEntryPath) return;

        // 根据是否存在样式入口路径，读取样式文件内容
        const styleContent = fs.readFileSync(
          wupRuntimeLibNpm.moduleStyleEntryPath,
          "utf-8"
        );

        const destStyleFile = path.join(
          pathManager.distServerScriptsAbsPath,
          `${pathManager.widgetUpRuntimeName}.css`
        );

        fs.ensureDirSync(path.dirname(destStyleFile));
        fs.writeFileSync(destStyleFile, styleContent);
      };

      // 监听JavaScript文件和CSS文件的变化
      fs.watch(wupRuntimeLibNpm.moduleEntryPath, (eventType, filename) => {
        if (eventType === "change") {
          console.log(`${filename} has been changed, copying...`);
          copyJS();
        }
      });

      if (wupRuntimeLibNpm.moduleStyleEntryPath) {
        fs.watch(
          wupRuntimeLibNpm.moduleStyleEntryPath,
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
