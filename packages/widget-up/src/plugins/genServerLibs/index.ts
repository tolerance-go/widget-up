import { Plugin } from "rollup";
import fs from "fs";
import path from "path";
import { getEnv } from "@/src/env";
import { ParedUMDConfig } from "widget-up-utils";
import { ResolvedNpmResult, resolvedNpm } from "@/src/utils/resolvedNpm";
import { ConfigManager } from "@/src/getConfigManager";

// 插件接收的参数类型定义
interface ServerLibsPluginOptions {
  modifyCode?: (code: string, lib: ResolvedNpmResult) => string;
  configManager: ConfigManager;
  umdConfig: ParedUMDConfig;
}

// 主插件函数
function genServerLibs({
  umdConfig,
  configManager,
  modifyCode,
}: ServerLibsPluginOptions): Plugin {
  let once = false;

  const write = (umdConfig: ParedUMDConfig) => {
    const { BuildEnvIsDev, BuildEnv } = getEnv();
    const outputPath = path.resolve("dist", "server", "libs");

    // 确保输出目录存在
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // 复制每个需要的库
    for (const [libName, config] of Object.entries(umdConfig.external)) {
      const lib = resolvedNpm({ name: libName });
      const destPath = path.join(outputPath, `${libName}.${BuildEnv}.js`);
      const umdFilePath = path.join(
        lib.modulePath,
        BuildEnvIsDev ? config.path.development : config.path.production
      );

      try {
        let code = fs.readFileSync(umdFilePath, "utf8");

        // 如果提供了代码修改函数，应用它
        if (modifyCode) {
          code = modifyCode(code, lib);
        }

        fs.writeFileSync(destPath, code, "utf8");
      } catch (error) {
        console.error(`Error copying file for ${libName}: ${error}`);
      }
    }
  };

  configManager.watch(({ umd: umdConfig }) => {
    write(umdConfig);
  });

  return {
    name: "server-libs-plugin",
    buildStart() {
      // 只执行一次
      if (!once) {
        once = true;
        write(umdConfig);

        return;
      }
    },
  };
}

export default genServerLibs;
