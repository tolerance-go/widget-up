import { convertConfigUmdToAliasImports } from "@/src/getPlugins/getDevPlugins/convertConfigUmdToAliasImports";
import { getEnv } from "@/src/utils/env";
import { logger } from "@/src/utils/logger";
import { normalizePath } from "@/src/utils/normalizePath";
import runtimeRollup, {
  RuntimeRollupOptions,
} from "@/src/utils/rollup-plugins/runtimeRollup";
import { DemoInput } from "@/types";
import path from "path";
import { InputPluginOption } from "rollup";
import {
  PackageJson,
  ParseConfig,
  semverToIdentifier,
  wrapUMDAliasCode,
  wrapUMDAsyncEventCode,
} from "widget-up-utils";

export const getDemoRuntimePlgs = ({
  config,
  packageConfig,
  cwdPath,
  demoInputList,
  devBuildPlugins,
}: {
  demoInputList: DemoInput[];
  cwdPath: string;
  config: ParseConfig;
  packageConfig: PackageJson;
  devBuildPlugins: InputPluginOption[];
}) => {
  const { BuildEnvIsDev } = getEnv();
  const runtimeRollupPlgs = demoInputList.map((inputItem) => {
    const input = normalizePath(path.relative(cwdPath, inputItem.path));

    const inputData = path.parse(input);

    const base: RuntimeRollupOptions = {
      input,
      output: {
        file: normalizePath(
          path.join("dist/server", inputData.dir, inputData.name, "index.js")
        ),
        format: "umd",
        name: config.umd.name,
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
              umdConfig: config.umd,
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
  });

  return runtimeRollupPlgs;
};
