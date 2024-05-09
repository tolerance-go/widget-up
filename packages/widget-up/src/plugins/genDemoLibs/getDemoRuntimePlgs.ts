import { ConfigManager } from "@/src/managers/getConfigManager";
import { PathManager } from "@/src/managers/getPathManager";
import { convertConfigUmdToAliasImports } from "@/src/utils/convertConfigUmdToAliasImports";
import { getEnv } from "@/src/utils/env";
import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { logger } from "@/src/utils/logger";
import { normalizePath } from "@/src/utils/normalizePath";
import runtimeRollup, {
  RuntimeRollupOptions,
} from "@/src/utils/rollup-plugins/runtimeRollup";
import { DemoData } from "@/types";
import path from "path";
import { InputPluginOption } from "rollup";
import {
  semverToIdentifier,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";

export const getDemoRuntimePlgs = ({
  demoInputList,
  devBuildPlugins,
  configManager,
  pathManager,
}: {
  demoInputList: DemoData[];
  devBuildPlugins: InputPluginOption[];
  configManager: ConfigManager;
  pathManager: PathManager;
}) => {
  const config = configManager.getConfig();
  const packageConfig = configManager.getPackageConfig();
  const cwdPath = pathManager.cwdPath;

  const { BuildEnvIsDev } = getEnv();

  const createRuntimePlg = (inputItem: DemoData) => {
    const input = normalizePath(path.relative(cwdPath, inputItem.path));

    const inputData = path.parse(input);

    const base: RuntimeRollupOptions = {
      input,
      output: {
        file: normalizePath(
          path.join("dist/server", inputData.dir, inputData.name, "index.js")
        ),
        format: "umd",
        name: getGlobalNameWithDemo(inputItem, config.umd),
        sourcemap: BuildEnvIsDev,
        globals: {
          /**
           * 注意这里配合 external 是 demo 代码中不引入组件库代码
           */
          [packageConfig.name]: config.umd.name,
        },
      },
    };

    logger.info("runtimeRollupPlgs base: ", base);

    return runtimeRollup(
      {
        ...base,
        plugins: [...devBuildPlugins],
        /**
         * 注意这里的 external 是 demo 代码中不引入组件库代码
         * 而是在运行时从外部引入
         */
        external: [packageConfig.name],
        watch: {
          include: ["src/**", "demos/**"],
        },
        overwriteChunkCode(code, chunk, options) {
          logger.info(
            "overwriteChunkCode chunk: ",
            JSON.stringify(chunk, null, 2)
          );

          if (!chunk.facadeModuleId) {
            throw new Error("chunk.facadeModuleId is required");
          }

          // 用服务器中的资源路径做为事件 ID
          const eventId = normalizePath(
            path.join("/", path.relative(cwdPath, chunk.facadeModuleId))
          );

          logger.info("eventId: ", eventId);

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
        },
      },
      input
    );
  };

  const runtimeRollupPlgs = demoInputList.map(createRuntimePlg);

  return runtimeRollupPlgs;
};
