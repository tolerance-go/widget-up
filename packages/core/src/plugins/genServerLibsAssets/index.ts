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

  /**
   * 对脚本内容进行包装
   *
   * @param code
   * @param param1
   * @returns
   */
  const wrapScriptCode = (
    code: string,
    {
      moduleName,
      version,
    }: {
      moduleName: string;
      version: string;
    }
  ) => {
    const externalDependencyConfig =
      config.umd.externalDependencies[moduleName];

    const aliasCode = wrapUMDAliasCode({
      scriptContent: code,
      imports: convertUmdConfigToAliasImports({
        external: externalDependencyConfig.external,
        globals: externalDependencyConfig.globals,
      }),
      exports: [
        {
          globalVar: `${externalDependencyConfig.name}_${semverToIdentifier(
            version
          )}`,
          scopeVar: externalDependencyConfig.name,
          scopeName: externalDependencyConfig.exportScopeObjectName,
        },
      ],
    });

    const asyncEventCode = wrapUMDAsyncEventCode({
      eventId: pathManager.getDependsLibServerUrl(moduleName, version),
      eventBusPath: "WidgetUpRuntime.globalEventBus",
      scriptContent: aliasCode,
    });

    return asyncEventCode;
  };

  // 遍历依赖树
  const traverseDependencyTree = (
    tree: PeerDependenciesTree,
    handler: (item: PeerDependenciesNode) => void
  ) => {
    Object.entries(tree).forEach(([name, lib]) => {
      if (lib.peerDependencies) {
        traverseDependencyTree(lib.peerDependencies, handler);
      }
    });
  };

  /**
   * 获取模块的 umd 脚本文件路径
   */
  const getBrowserScriptPath = (item: PeerDependenciesNode) => {
    if (item.moduleEntries.moduleBrowserEntryPath) {
      return item.moduleEntries.moduleBrowserEntryPath;
    }
    const a = config.umd.externalDependencies[item.name];

    if (!a) {
      throw new Error("浏览器脚本入口没有在模块定义，并且外部依赖也没有定义");
    }

    return a.browser[BuildEnv];
  };

  const write = () => {
    const tree = peerDependTreeManager.getDependenciesTree();
    plgLogger.log("tree", tree);

    const handler = (item: PeerDependenciesNode) => {
      // 确保输出目录存在
      if (!fs.existsSync(pathManager.distServerLibsAbsPath)) {
        fs.mkdirSync(pathManager.distServerLibsAbsPath, { recursive: true });
      }

      /**
       * 找到脚本文件
       */
      const scriptFilePath = getBrowserScriptPath(item);

      let scriptContent = fs.readFileSync(scriptFilePath, "utf8");

      // 包裹文件内容
      scriptContent = wrapScriptCode(scriptContent, {
        moduleName: item.name,
        version: item.version.exact,
      });

      /**
       * 找到样式文件
       */
      const styleFilePath = item.moduleEntries.moduleStyleEntryPath;

      const styleContent = styleFilePath
        ? fs.readFileSync(styleFilePath, "utf8")
        : "";

      /**
       * 写入文件目标
       */

      // 找到脚本目标地址
      const destScriptPath = path.join(
        pathManager.distServerLibsAbsPath,
        pathManager.getServerScriptFileName(item.name, item.version.exact)
      );

      // 找到样式目标地址
      const destStylePath = path.join(
        pathManager.distServerLibsAbsPath,
        pathManager.getServerStyleFileName(item.name, item.version.exact)
      );

      // 写入脚本文件
      fs.writeFileSync(destScriptPath, scriptContent, "utf8");

      // 写入样式文件
      fs.writeFileSync(destStylePath, styleContent, "utf8");
    };

    traverseDependencyTree(tree, handler);

    plgLogger.log("extraPeerDependenciesTree", extraPeerDependenciesTree);
    if (extraPeerDependenciesTree) {
      traverseDependencyTree(extraPeerDependenciesTree, handler);
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
