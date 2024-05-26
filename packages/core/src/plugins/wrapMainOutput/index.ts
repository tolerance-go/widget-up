import { ConfigManager } from "@/src/managers/configManager";
import { PathManager } from "@/src/managers/pathManager";
import { convertUmdConfigToAliasImports } from "@/src/utils/convertUmdConfigToAliasImports";
import MagicString from "magic-string";
import path from "path";
import { NormalizedOutputOptions, Plugin, RenderedChunk } from "rollup";
import {
  normalizePath,
  convertSemverVersionToIdentify,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
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
    const umdConfig = configManager.getMainModuleUMDConfig();
    const packageConfig = configManager.getPackageConfig();

    // 用服务器中的资源路径做为事件 ID
    const eventId = normalizePath(
      path.join("/", path.relative(cwdPath, chunk.facadeModuleId))
    );

    const aliasCode = wrapUMDAliasCode({
      scriptContent: code,
      imports: convertUmdConfigToAliasImports({
        external: umdConfig.external,
        globals: umdConfig.globals,
      }),
      exports: [
        {
          globalVar: `${umdConfig.name}_${convertSemverVersionToIdentify(
            packageConfig.version
          )}`,
          scopeVar: umdConfig.name,
        },
      ],
    });

    return wrapUMDAsyncEventCode({
      eventId: "/index.js",
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
