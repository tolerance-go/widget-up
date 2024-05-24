import { ConfigManager } from "@/src/managers/configManager";
import { EnvManager } from "@/src/managers/envManager";
import { IdentifierManager } from "@/src/managers/identifierManager";
import { PathManager } from "@/src/managers/pathManager";
import { PeerDependTreeManager } from "@/src/managers/peerDependTreeManager";
import { convertUmdConfigToAliasImports } from "@/src/utils/convertUmdConfigToAliasImports";
import fs from "fs";
import path from "path";
import { Plugin } from "rollup";
import {
  PeerDependenciesNode,
  PeerDependenciesTree,
  ResolvedModuleInfo,
  resolveModuleInfo,
  semverToIdentifier,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";
import { plgLogger } from "./logger";

// 插件接收的参数类型定义
export interface ServerLibsPluginOptions {
  extraPeerDependenciesTree?: PeerDependenciesTree;
}

// 主插件函数
function genServerLibs({
  extraPeerDependenciesTree,
}: ServerLibsPluginOptions): Plugin {
  const envManager = EnvManager.getInstance();
  const configManager = ConfigManager.getInstance();
  const peerDependTreeManager = PeerDependTreeManager.getInstance();
  const pathManager = PathManager.getInstance();
  const identifierManager = IdentifierManager.getInstance();

  const config = configManager.getConfig();
  const { umd: umdConfig } = configManager.getConfig();
  plgLogger.log("umdConfig", umdConfig);

  const { BuildEnv } = envManager;

  let once = false;

  const modifyCode = (
    code: string,
    {
      libNpmInfo,
    }: {
      libNpmInfo: ResolvedModuleInfo;
    }
  ) => {
    const externalDependencyConfig =
      config.umd.externalDependencies[libNpmInfo.packageJson.name];

    const aliasCode = wrapUMDAliasCode({
      scriptContent: code,
      imports: convertUmdConfigToAliasImports({
        external: externalDependencyConfig.external,
        globals: externalDependencyConfig.globals,
      }),
      exports: [
        {
          globalVar: `${externalDependencyConfig.name}_${semverToIdentifier(
            libNpmInfo.packageJson.version
          )}`,
          scopeVar: externalDependencyConfig.name,
          scopeName: externalDependencyConfig.exportScopeObjectName,
        },
      ],
    });

    const asyncEventCode = wrapUMDAsyncEventCode({
      eventId: pathManager.getDependsLibServerUrl(
        libNpmInfo.packageJson.name,
        libNpmInfo.packageJson.version
      ),
      eventBusPath: "WidgetUpRuntime.globalEventBus",
      scriptContent: aliasCode,
    });

    return asyncEventCode;
  };

  const writeCore = ({
    lib,
    cwd,
  }: {
    lib: PeerDependenciesNode;
    cwd: string;
  }) => {
    // 确保输出目录存在
    if (!fs.existsSync(pathManager.distServerLibsAbsPath)) {
      fs.mkdirSync(pathManager.distServerLibsAbsPath, { recursive: true });
    }

    // 复制每个需要的库
    const libName = lib.name;
    plgLogger.log("libName", libName);
    const umdFilePath =
      umdConfig.externalDependencies[libName].browser[BuildEnv];
    const destPath = path.join(
      pathManager.distServerLibsAbsPath,
      pathManager.getServerScriptFileName(libName, lib.version.exact)
    );

    plgLogger.log("resolveModuleInfo libName:", libName);

    const libNpmInfo = resolveModuleInfo({ name: libName, cwd });
    const sourcePath = path.join(libNpmInfo.modulePath, umdFilePath);

    plgLogger.log("readFileSync sourcePath", sourcePath);
    let code = fs.readFileSync(sourcePath, "utf8");

    code = modifyCode(code, {
      libNpmInfo,
    });

    fs.writeFileSync(destPath, code, "utf8");
  };

  const write = () => {
    const tree = peerDependTreeManager.getDependenciesTree();
    plgLogger.log("tree", tree);

    Object.entries(tree).forEach(([name, lib]) => {
      writeCore({
        lib,
        cwd: lib.hostModulePath,
      });
    });

    plgLogger.log("extraPeerDependenciesTree", extraPeerDependenciesTree);
    if (extraPeerDependenciesTree) {
      Object.entries(extraPeerDependenciesTree).forEach(([name, lib]) => {
        writeCore({
          lib,
          cwd: lib.hostModulePath,
        });
      });
    }
  };

  configManager.watch(() => {
    write();
  });

  peerDependTreeManager.watch(() => {
    write();
  });

  return {
    name: identifierManager.serverLibsPlgName,
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
