// 导入PathManager类，用于路径管理
import { PathManager } from "@/src/managers/PathManager";

// 导入resolveNpmInfo函数，用于解析NPM包信息
import { resolveNpmInfo } from "@/src/utils/resolveNpmInfo";

// 导入fs-extra库，扩展了fs库的功能，提供更多的文件操作API
import fs from "fs-extra";

// 导入path库，用于处理文件路径
import path from "path";

// 导入Rollup的Plugin接口
import { Plugin } from "rollup";

// 定义genRuntimeLib函数，用于生成运行时库的Rollup插件
export function genRuntimeLib({
  pathManager, // 接收一个PathManager实例作为参数
}: {
  pathManager: PathManager;
}): Plugin {
  // 初始化标志以防止重复监听器设置
  let initialized = false;

  return {
    name: "gen-runtime-lib", // 插件名称
    buildStart() {
      // 如果已经初始化过，则直接返回
      if (initialized) {
        return;
      }

      // 标记为已初始化，防止下次构建重复执行
      initialized = true;

      // 使用resolveNpmInfo函数获取运行时库的信息
      const wupRuntimeLibNpm = resolveNpmInfo({
        name: "widget-up-runtime", // 包名
        cwd: pathManager.rootPath, // 当前工作目录，设置为根路径
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
          `${wupRuntimeLibNpm.packageJson.name}.js`
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
          `${wupRuntimeLibNpm.packageJson.name}.css`
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
