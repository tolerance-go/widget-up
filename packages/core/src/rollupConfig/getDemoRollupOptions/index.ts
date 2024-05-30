import { ConfigManager } from "@/src/managers/configManager";
import { DemoManager } from "@/src/managers/demoManager";
import { PathManager } from "@/src/managers/pathManager";
import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { coreLogger } from "@/src/utils/logger";
import MagicString from "magic-string";
import path from "path";
import {
  InputPluginOption,
  NormalizedOutputOptions,
  Plugin,
  RenderedChunk,
  RollupOptions,
} from "rollup";
import {
  convertSemverVersionToIdentify,
  normalizePath,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";
import { convertUmdConfigToAliasImports } from "@/src/utils/convertUmdConfigToAliasImports";
import { DemoFileData } from "@/types";

export const getDemoRollupOptions = ({
  devBuildPlugins,
}: {
  devBuildPlugins: InputPluginOption[];
}): RollupOptions[] => {
  const configManager = ConfigManager.getInstance();
  const demoManager = DemoManager.getInstance();
  const pathManager = PathManager.getInstance();
  const umdConfig = configManager.getMainModuleUMDConfig();
  const packageConfig = configManager.getPackageConfig();

  const demoList = demoManager.getDemoList();

  const overwriteChunkCode = ({
    code,
    chunk,
    options,
    demo,
  }: {
    code: string;
    chunk: RenderedChunk;
    options: NormalizedOutputOptions;
    demo: DemoFileData;
  }) => {
    coreLogger.info(
      "overwriteChunkCode chunk: ",
      JSON.stringify(chunk, null, 2)
    );

    if (!chunk.facadeModuleId) {
      throw new Error("chunk.facadeModuleId is required");
    }

    // 用服务器中的资源路径做为事件 ID
    const eventId = pathManager.getDemoLibServerUrl(chunk.facadeModuleId);

    coreLogger.info("eventId: ", eventId);

    const aliasCode = wrapUMDAliasCode({
      scriptContent: code,
      imports: [
        ...convertUmdConfigToAliasImports({
          external: umdConfig.external,
          globals: umdConfig.globals,
          importScopeObjectName: umdConfig.importScopeObjectName,
        }),
        // 加上对开发组件的依赖
        {
          globalVar: `${umdConfig.name}_${convertSemverVersionToIdentify(
            packageConfig.version
          )}`,
          scopeVar: umdConfig.name,
        },
      ],
      exports: [
        {
          globalVar: `${getGlobalNameWithDemo(
            demo,
            umdConfig,
            pathManager.demosAbsPath
          )}_${convertSemverVersionToIdentify(packageConfig.version)}`,
          scopeVar: getGlobalNameWithDemo(
            demo,
            umdConfig,
            pathManager.demosAbsPath
          ),
        },
      ],
    });

    return wrapUMDAsyncEventCode({
      eventId,
      eventBusPath: "WidgetUpRuntime.globalEventBus",
      scriptContent: aliasCode,
    });
  };

  // 创建一个内部插件，用于包含 renderChunk 逻辑
  const internalPlugin: (options: { demo: DemoFileData }) => Plugin = ({
    demo,
  }) => {
    return {
      name: "runtime-rollup-internal",
      renderChunk(code, chunk, options) {
        const newCode = overwriteChunkCode({ code, chunk, options, demo });

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
            return {
              code: `${magicString.toString()}\n${inlineMap}`,
              map: null,
            };
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
  };

  return demoList.map((demo) => {
    const input = normalizePath(
      path.join(pathManager.demosRelPath, demo.relPath)
    );
    return {
      input,
      output: {
        file: normalizePath(
          pathManager.convertDemoAbsPathToDemoLibServerRelativePath(demo.path)
        ),
        format: "umd",
        name: getGlobalNameWithDemo(demo, umdConfig, pathManager.demosAbsPath),
        globals: {
          /**
           * 注意这里配合 external 是 demo 代码中不引入组件库代码
           */
          [packageConfig.name]: umdConfig.name,
        },
      },
      /**
       * 注意这里的 external 是 demo 代码中不引入组件库代码
       * 而是在运行时从外部引入
       */
      external: [packageConfig.name],
      plugins: [...devBuildPlugins, internalPlugin({ demo })],
      watch: {
        include: ["src/**", input],
      },
    };
  });
};
