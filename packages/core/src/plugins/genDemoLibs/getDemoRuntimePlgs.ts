import { ConfigManager } from "@/src/managers/configManager";
import { PathManager } from "@/src/managers/pathManager";
import { convertUmdConfigToAliasImports } from "@/src/utils/convertUmdConfigToAliasImports";
import { getEnv } from "@/src/utils/env";
import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { logger } from "@/src/utils/logger";
import runtimeRollup, {
  RuntimeRollupOptions,
} from "@/src/utils/rollupPlugins/runtimeRollup";
import { DemoData } from "@/types";
import path from "path";
import { InputPluginOption } from "rollup";
import {
  normalizePath,
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

    const base: RuntimeRollupOptions = {
      input,
      output: {
        file: normalizePath(
          pathManager.getDemoLibServerRelativePath(inputItem.path)
        ),
        format: "umd",
        name: getGlobalNameWithDemo(
          inputItem,
          config.umd,
          pathManager.demosAbsPath
        ),
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
          const eventId = pathManager.getDemoLibServerUrl(chunk.facadeModuleId);

          logger.info("eventId: ", eventId);

          const aliasCode = wrapUMDAliasCode({
            scriptContent: code,
            imports: [
              ...convertUmdConfigToAliasImports({
                external: config.umd.external,
                globals: config.umd.globals,
              }),
              // 加上对开发组件的依赖
              {
                globalVar: `${config.umd.name}_${semverToIdentifier(
                  packageConfig.version
                )}`,
                scopeVar: config.umd.name,
              },
            ],
            exports: [
              {
                globalVar: `${getGlobalNameWithDemo(
                  inputItem,
                  config.umd,
                  pathManager.demosAbsPath
                )}_${semverToIdentifier(packageConfig.version)}`,
                scopeVar: getGlobalNameWithDemo(
                  inputItem,
                  config.umd,
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
        },
      },
      input
    );
  };

  const runtimeRollupPlgs = demoInputList.map(createRuntimePlg);

  return runtimeRollupPlgs;
};
