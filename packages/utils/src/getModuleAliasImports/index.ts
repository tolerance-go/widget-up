import { PeerDependenciesTree } from "@/types";
import { convertSemverVersionToIdentify } from "../convertSemverVersionToIdentify";
import { ensure } from "../ensure";
import { UMDAliasOptions } from "../wrapUMDAliasCode";
import { logger } from "./logger";

export const getModuleAliasImports = ({
  external,
  globals,
  peerDependenciesTree,
  ignorePeerDependencyCheck = [],
}: {
  external: string[];
  globals: Record<string, string>;
  peerDependenciesTree: PeerDependenciesTree;
  ignorePeerDependencyCheck?: string[];
}): UMDAliasOptions["imports"] => {
  logger.log("getModuleAliasImports start");

  const imports: UMDAliasOptions["imports"] = [];

  /**
   * 根据 external 进行循环
   */
  external.forEach((moduleName) => {
    // globalName 从 globals 中根据 external 找到对应
    const globalName = globals[moduleName];
    ensure(!!globalName, "external 定义的外部依赖，在 globals 中没有找到");

    if (ignorePeerDependencyCheck.includes(moduleName)) {
      // If the module name is in the ignore list, use globalName directly for both globalVar and scopeVar
      imports.push({
        globalVar: globalName,
        scopeVar: globalName,
      });
    } else {
      // 从 node 的前置依赖中找到对应模块
      const peerDependency = peerDependenciesTree[moduleName];

      ensure(
        !!peerDependency,
        `external 所定义的外部依赖 ${moduleName} 没有找到对应的 peerDependency 信息。`,
        "info:",
        {
          globals,
          external,
          moduleName,
          peerDependenciesTree,
        }
      );

      // 提取版本号，来格式化
      const version = peerDependency.packageConfig.version;

      // 格式化模板为 globalName_versionId
      const id = `${globalName}_${convertSemverVersionToIdentify(version)}`;

      imports.push({
        globalVar: id,
        scopeVar: globalName,
      });
    }
  });

  return imports;
};
