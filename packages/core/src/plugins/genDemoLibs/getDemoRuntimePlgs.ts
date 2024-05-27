import { ConfigManager } from "@/src/managers/configManager";
import { PathManager } from "@/src/managers/pathManager";
import { convertUmdConfigToAliasImports } from "@/src/utils/convertUmdConfigToAliasImports";
import { getEnv } from "@/src/utils/env";
import { getGlobalNameWithDemo } from "@/src/utils/getGlobalNameWithDemo";
import { coreLogger } from "@/src/utils/logger";
import runtimeRollup, {
  RuntimeRollupOptions,
} from "@/src/utils/rollupPlugins/runtimeRollup";
import { DemoData } from "@/types";
import path from "path";
import { InputPluginOption } from "rollup";
import {
  normalizePath,
  convertSemverVersionToIdentify,
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
  const umdConfig = configManager.getMainModuleUMDConfig();
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
          umdConfig,
          pathManager.demosAbsPath
        ),
        // sourcemap: BuildEnvIsDev,
        globals: {
          /**
           * 注意这里配合 external 是 demo 代码中不引入组件库代码
           */
          [packageConfig.name]: umdConfig.name,
        },
      },
    };

    coreLogger.info("runtimeRollupPlgs base: ", base);

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
                  inputItem,
                  umdConfig,
                  pathManager.demosAbsPath
                )}_${convertSemverVersionToIdentify(packageConfig.version)}`,
                scopeVar: getGlobalNameWithDemo(
                  inputItem,
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
        },
      },
      input
    );
  };

  const runtimeRollupPlgs = demoInputList.map(createRuntimePlg);

  return runtimeRollupPlgs;
};
