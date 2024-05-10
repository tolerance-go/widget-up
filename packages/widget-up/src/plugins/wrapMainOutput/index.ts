import { ConfigManager } from "@/src/managers/getConfigManager";
import { PathManager } from "@/src/managers/getPathManager";
import { convertConfigUmdToAliasImports } from "@/src/utils/convertConfigUmdToAliasImports";
import { normalizePath } from "@/src/utils/normalizePath";
import MagicString from "magic-string";
import path from "path";
import {
  NormalizedOutputOptions,
  Plugin,
  RenderedChunk
} from "rollup";
import {
  semverToIdentifier,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode
} from "widget-up-utils";

function wrapMainOutput({
  pathManager,
  configManager,
}: {
  pathManager: PathManager;
  configManager: ConfigManager;
}): Plugin {
  const overwriteChunkCode = (
    code: string,
    chunk: RenderedChunk,
    options: NormalizedOutputOptions
  ): string => {
    if (!chunk.facadeModuleId) {
      throw new Error("chunk.facadeModuleId is required");
    }

    const cwdPath = pathManager.cwdPath;
    const config = configManager.getConfig();
    const packageConfig = configManager.getPackageConfig();

    // 用服务器中的资源路径做为事件 ID
    const eventId = normalizePath(
      path.join("/", path.relative(cwdPath, chunk.facadeModuleId))
    );

    const aliasCode = wrapUMDAliasCode({
      scriptContent: code,
      imports: convertConfigUmdToAliasImports({
        external: config.umd.external,
        globals: config.umd.globals,
      }),
      exports: [
        {
          globalVar: `${config.umd.name}_${semverToIdentifier(
            packageConfig.version
          )}`,
          scopeVar: config.umd.name,
        },
      ],
    });

    return wrapUMDAsyncEventCode({
      eventId,
      eventBusPath: "WidgetUpRuntime.globalEventBus",
      scriptContent: aliasCode,
    });
  };

  return {
    name: "wrap-main-output",
    renderChunk(code, chunk, options) {
      const newCode = overwriteChunkCode(code, chunk, options);

      if (options.sourcemap) {
        const magicString = new MagicString(code);

        magicString.overwrite(0, code.length, newCode);

        if (options.sourcemap === "hidden") {
          // 生成 sourcemap 但不在文件中引用
          return {
            code: magicString.toString(),
            map: magicString.generateMap({ hires: true }),
          };
        } else if (options.sourcemap === "inline") {
          // 将 sourcemap 作为数据 URI 嵌入
          const map = magicString.generateMap({
            hires: true,
            includeContent: true,
          });
          const base64 = Buffer.from(JSON.stringify(map)).toString("base64");
          const inlineMap = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64}`;
          return { code: `${magicString.toString()}\n${inlineMap}`, map: null };
        } else if (options.sourcemap) {
          // 生成外部 sourcemap 文件
          return {
            code: magicString.toString(),
            map: magicString.generateMap({ hires: true }),
          };
        }
      }

      return { code: newCode, map: null };
    },
  };
}

export default wrapMainOutput;
