import { ConfigManager } from "@/src/managers/getConfigManager";
import { convertPathToVariableName } from "@/src/managers/getDemosManager/convertPathToVariableName";
import { PathManager } from "@/src/managers/getPathManager";
import { PeerDependTreeManager } from "@/src/managers/getPeerDependTreeManager";
import { convertConfigUmdToAliasImports } from "@/src/utils/convertConfigUmdToAliasImports";
import { getEnv } from "@/src/utils/env";
import { normalizePath } from "@/src/utils/normalizePath";
import { ResolvedNpmResult, resolveNpmInfo } from "@/src/utils/resolveNpmInfo";
import fs from "fs";
import path from "path";
import { Plugin } from "rollup";
import {
  semverToIdentifier,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";

// 插件接收的参数类型定义
interface ServerLibsPluginOptions {
  configManager: ConfigManager;
  peerDependTreeManager: PeerDependTreeManager;
  pathManager: PathManager;
}

// 主插件函数
function genServerLibs({
  configManager,
  peerDependTreeManager,
  pathManager,
}: ServerLibsPluginOptions): Plugin {
  let once = false;

  const modifyCode = (
    code: string,
    {
      libNpmInfo,
      serverPath,
    }: {
      libNpmInfo: ResolvedNpmResult;
      serverPath: string;
    }
  ) => {
    const config = configManager.getConfig();
    const externalDependencyConfig =
      config.umd.externalDependencies[libNpmInfo.packageJson.name];
    const aliasCode = wrapUMDAliasCode({
      scriptContent: code,
      imports: convertConfigUmdToAliasImports({
        external: externalDependencyConfig.external,
        globals: externalDependencyConfig.globals,
      }),
      exports: [
        {
          globalVar: `${externalDependencyConfig.name}_${semverToIdentifier(
            libNpmInfo.packageJson.version
          )}`,
          scopeVar: externalDependencyConfig.name,
        },
      ],
    });

    const asyncEventCode = wrapUMDAsyncEventCode({
      eventId: pathManager.getServerLibUrl(
        libNpmInfo.packageJson.name,
        libNpmInfo.packageJson.version
      ),
      eventBusPath: "WidgetUpRuntime.globalEventBus",
      scriptContent: aliasCode,
    });

    return asyncEventCode;
  };

  const write = () => {
    const dependenciesList = peerDependTreeManager.getDependenciesList();

    const { umd: umdConfig } = configManager.getConfig();

    const { BuildEnv } = getEnv();
    const outputPath = path.resolve("dist", "server", "libs");

    // 确保输出目录存在
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // 复制每个需要的库
    dependenciesList.forEach((lib) => {
      const libName = lib.name;
      const umdFilePath =
        umdConfig.externalDependencies[libName].browser[BuildEnv];
      const destPath = path.join(
        outputPath,
        `${libName}_${semverToIdentifier(lib.version.exact)}.js`
      );
      const libNpmInfo = resolveNpmInfo({ name: libName });
      const sourcePath = path.join(libNpmInfo.modulePath, umdFilePath);

      try {
        let code = fs.readFileSync(sourcePath, "utf8");

        const serverPath = normalizePath(
          path.join("/", path.relative(pathManager.serverPath, destPath))
        );

        code = modifyCode(code, {
          libNpmInfo,
          serverPath,
        });

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
