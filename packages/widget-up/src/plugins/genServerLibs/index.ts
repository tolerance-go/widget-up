import { Plugin } from "rollup";
import fs from "fs";
import path, { resolve } from "path";
import { getEnv } from "@/src/utils/env";
import { ParedUMDConfig, semverToIdentifier } from "widget-up-utils";
import { ResolvedNpmResult, resolveNpmInfo } from "@/src/utils/resolveNpmInfo";
import { ConfigManager } from "@/src/getConfigManager";
import { PeerDependTreeManager } from "@/src/getPeerDependTreeManager";

// 插件接收的参数类型定义
interface ServerLibsPluginOptions {
  modifyCode?: (
    code: string,
    options: {
      libNpmInfo: ResolvedNpmResult;
    }
  ) => string;
  configManager: ConfigManager;
  peerDependTreeManager: PeerDependTreeManager;
}

// 主插件函数
function genServerLibs({
  configManager,
  modifyCode,
  peerDependTreeManager,
}: ServerLibsPluginOptions): Plugin {
  let once = false;

  const write = () => {
    const dependenciesList = peerDependTreeManager.getDependenciesList();

    const { umd: umdConfig } = configManager.get();

    const { BuildEnv } = getEnv();
    const outputPath = path.resolve("dist", "server", "libs");

    // 确保输出目录存在
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // 复制每个需要的库
    dependenciesList.forEach((lib) => {
      const libName = lib.name;
      const umdFilePath = umdConfig.dependenciesEntries[libName][BuildEnv];
      const destPath = path.join(
        outputPath,
        `${libName}_${semverToIdentifier(lib.version.exact)}.js`
      );
      const libNpmInfo = resolveNpmInfo({ name: libName });
      const sourcePath = path.join(libNpmInfo.modulePath, umdFilePath);

      try {
        let code = fs.readFileSync(sourcePath, "utf8");

        // 如果提供了代码修改函数，应用它
        if (modifyCode) {
          code = modifyCode(code, {
            libNpmInfo,
          });
        }

        fs.writeFileSync(destPath, code, "utf8");
      } catch (error) {
        console.error(`Error copying file for ${libName}: ${error}`);
      }
    });
  };

  configManager.watch(() => {
    write();
  });

  peerDependTreeManager.watch(() => {
    write();
  });

  return {
    name: "server-libs-plugin",
    buildStart() {
      // 只执行一次
      if (!once) {
        once = true;
        write();
      }
    },
  };
}

export default genServerLibs;
