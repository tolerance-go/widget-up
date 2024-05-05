import path from "path";
import {
  OutputOptions,
  Plugin,
  RollupOptions,
  RollupWatcher,
  rollup,
  watch,
} from "rollup";
import { Logger } from "widget-up-utils";

export interface RuntimeRollupOptions extends RollupOptions {
  output: OutputOptions; // 确保输出配置被正确传递
}

function runtimeRollup(options: RuntimeRollupOptions, name?: string): Plugin {
  let watcher: RollupWatcher | null = null;

  const logger = new Logger(
    path.join(
      process.cwd(),
      ".logs/runtime-rollup",
      name || "",
      new Date().toISOString().substring(0, 10)
    )
  );

  const { output, ...rollupOptions } = options;
  logger.log("Configured embedded Rollup build for:", output.file);

  const watcherOptions = {
    ...rollupOptions,
    output,
  };

  const build = async () => {
    try {
      const bundle = await rollup(rollupOptions);
      await bundle.write(output);
      await bundle.close();
      logger.log(`Bundle written successfully to:`, output.file);
    } catch (error) {
      logger.error(`Error during embedded Rollup build for:`, output.file);
      if (error instanceof Error) {
        logger.error(`Rollup build failed: ${error.message}`);
      }
    }
  };

  // 确保仅一次初始化监听
  const setupWatcher = () => {
    if (watcherOptions.watch) {
      if (!watcher) {
        watcher = watch(watcherOptions);
        watcher.on("event", (event) => {
          switch (event.code) {
            case "BUNDLE_START":
              console.log(`Bundling...`);
              break;
            case "BUNDLE_END":
              console.log(`Bundle written successfully to:`, output.file);
              break;
            case "ERROR":
              console.error(`Rollup build error:`, event.error);
              break;
          }
        });
      }
    } else {
      build();
    }
  };

  return {
    name: "runtime-rollup",
    buildStart() {
      setupWatcher(); // 在首次构建开始时设置监听
    },
  };
}

export default runtimeRollup;
