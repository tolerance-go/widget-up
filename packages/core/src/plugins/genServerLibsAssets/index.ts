import { ConfigManager } from "@/src/managers/configManager";
import { EnvManager } from "@/src/managers/envManager";
import { IdentifierManager } from "@/src/managers/identifierManager";
import { PathManager } from "@/src/managers/pathManager";
import { PeerDependTreeManager } from "@/src/managers/peerDependTreeManager";
import fs from "fs";
import path from "path";
import { Plugin } from "rollup";
import {
  NormalizedUMDConfig,
  PeerDependenciesNode,
  PeerDependenciesTree,
  convertSemverVersionToIdentify,
  getModuleAliasImports,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";
import { logger, wrapScriptContentLogger } from "./logger";

// 插件接收的参数类型定义
export interface ServerLibsPluginOptions {
  getExtraPeerDependenciesTree?: () => PeerDependenciesTree;
}

// 主插件函数
function generateServerLibraries({
  getExtraPeerDependenciesTree,
}: ServerLibsPluginOptions): Plugin {
  const envManager = EnvManager.getInstance();
  const configManager = ConfigManager.getInstance();
  const peerDependTreeManager = PeerDependTreeManager.getInstance();
  const pathManager = PathManager.getInstance();
  const identifierManager = IdentifierManager.getInstance();

  const config = configManager.getConfig();

  logger.log("build");

  const { BuildEnv } = envManager;

  let once = false;

  /**
   * 对脚本内容进行包装
   *
   * @param code
   * @param param1
   * @returns
   */
  const wrapScriptContent = (
    code: string,
    {
      moduleName,
      version,
      peerDependenciesTree,
      umdConfig,
    }: {
      moduleName: string;
      version: string;
      peerDependenciesTree: PeerDependenciesTree;
      umdConfig: NormalizedUMDConfig;
    }
  ) => {
    wrapScriptContentLogger.log("getModuleAliasImports start");

    wrapScriptContentLogger.info({
      umdConfig,
      peerDependenciesTree,
    });

    const moduleAliasImportParams: Parameters<typeof getModuleAliasImports>[0] =
      {
        external: umdConfig.external,
        globals: umdConfig.globals,
        peerDependenciesTree,
        importScopeObjectName: umdConfig.importScopeObjectName,
      };

    wrapScriptContentLogger.info({ moduleAliasImportParams });

    const imports = getModuleAliasImports(moduleAliasImportParams);

    wrapScriptContentLogger.info({
      imports,
    });

    const aliasCode = wrapUMDAliasCode({
      scriptContent: code,
      imports,
      exports: [
        {
          globalVar: `${umdConfig.name}_${convertSemverVersionToIdentify(
            version
          )}`,
          scopeVar: umdConfig.name,
          scopeName: umdConfig.exportScopeObjectName,
        },
      ],
    });

    wrapScriptContentLogger.log("wrapUMDAliasCode end");

    const asyncEventCode = wrapUMDAsyncEventCode({
      eventId: pathManager.getDependsLibServerUrl(moduleName, version),
      eventBusPath: "WidgetUpRuntime.globalEventBus",
      scriptContent: aliasCode,
    });

    return asyncEventCode;
  };

  // 遍历依赖树
  const traverseDependencies = (
    tree: PeerDependenciesTree,
    handler: (
      item: PeerDependenciesNode,
      parent: PeerDependenciesNode | null
    ) => void,
    parent: PeerDependenciesNode | null = null
  ) => {
    Object.entries(tree).forEach(([name, lib]) => {
      handler(lib, parent); // 处理当前节点
      if (lib.peerDependencies) {
        traverseDependencies(lib.peerDependencies, handler, lib); // 递归处理子节点
      }
    });
  };

  /**
   * 获取模块的 umd 脚本文件路径
   */
  const getModuleBrowserScriptPath = (item: PeerDependenciesNode) => {
    if (item.moduleEntries.moduleBrowserEntryRelPath) {
      return item.moduleEntries.moduleBrowserEntryRelPath;
    }
    const umdConfig = config.umd[item.name];

    if (!umdConfig) {
      throw new Error("浏览器脚本入口没有在模块定义，并且外部依赖也没有定义");
    }

    return umdConfig.browser[BuildEnv];
  };

  const writeOutputFiles = () => {
    const tree = peerDependTreeManager.getDependenciesTree();

    logger.log("writeOutputFiles");
    logger.info({ tree });

    const handler = (
      node: PeerDependenciesNode,
      parent: PeerDependenciesNode | null
    ) => {
      // 确保输出目录存在
      if (!fs.existsSync(pathManager.distServerLibsAbsPath)) {
        fs.mkdirSync(pathManager.distServerLibsAbsPath, { recursive: true });
      }

      /**
       * 找到脚本文件
       */
      const scriptFilePath = path.join(
        node.moduleEntries.modulePath,
        getModuleBrowserScriptPath(node)
      );

      logger.log("readFileSync start");

      let scriptContent = fs.readFileSync(scriptFilePath, "utf8");

      logger.info({
        "config.umd": config.umd,
        "node.name": node.name,
      });

      // 包裹文件内容
      scriptContent = wrapScriptContent(scriptContent, {
        moduleName: node.name,
        version: node.version.exact,
        peerDependenciesTree: node?.peerDependencies ?? {},
        umdConfig: config.umd[node.name],
      });

      logger.log("wrapScriptContent end");

      /**
       * 找到样式文件
       */
      const styleFileRelativePath =
        node.moduleEntries.moduleStyleEntryRelPath;
      const styleFileAbsPath = styleFileRelativePath
        ? path.join(node.moduleEntries.modulePath, styleFileRelativePath)
        : undefined;

      logger.log("styleFileRelativePath done", {
        styleFileRelativePath,
        styleFileAbsPath,
      });

      const styleContent = styleFileAbsPath
        ? fs.readFileSync(styleFileAbsPath, "utf8")
        : "";

      /**
       * 写入文件目标
       */

      // 找到脚本目标地址
      const destScriptPath = path.join(
        pathManager.distServerLibsAbsPath,
        pathManager.getServerScriptFileName(node.name, node.version.exact)
      );

      // 找到样式目标地址
      const destStylePath = path.join(
        pathManager.distServerLibsAbsPath,
        pathManager.getServerStyleFileName(node.name, node.version.exact)
      );

      // 写入脚本文件
      fs.writeFileSync(destScriptPath, scriptContent, "utf8");

      // 当样式文件存在
      if (styleFileAbsPath && fs.existsSync(styleFileAbsPath)) {
        // 写入样式文件
        fs.writeFileSync(destStylePath, styleContent, "utf8");
      }
    };

    traverseDependencies(tree, handler);

    const extraPeerDependenciesTree = getExtraPeerDependenciesTree?.();
    logger.info({ extraPeerDependenciesTree });
    if (extraPeerDependenciesTree) {
      traverseDependencies(extraPeerDependenciesTree, handler);
    }
  };

  configManager.watch(() => {
    writeOutputFiles();
  });

  peerDependTreeManager.watch(() => {
    writeOutputFiles();
  });

  return {
    name: identifierManager.serverLibsPlgName,
    buildStart() {
      // 只执行一次
      if (!once) {
        once = true;
        writeOutputFiles();
      }
    },
  };
}

export default generateServerLibraries;
