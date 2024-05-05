import path from "path";
import { OutputOptions, Plugin, RollupOptions, rollup } from "rollup";
import { Logger } from "widget-up-utils";

// 定义插件接受的参数类型
interface RuntimeRollupOptions extends RollupOptions {
  output: OutputOptions; // 确保输出配置被正确传递
}

// 主插件函数
function runtimeRollup(options: RuntimeRollupOptions, name?: string): Plugin {
  const logger = new Logger(
    path.join(
      process.cwd(),
      ".logs/runtime-rollup",
      name || "",
      new Date().toISOString().substring(0, 10)
    )
  );

  return {
    name: "runtime-rollup",

    // 使用异步的构建开始钩子
    async buildStart() {
      const { output, ...rollupOptions } = options;
      logger.log("Starting embedded Rollup build for:", output.file);

      try {
        const bundle = await rollup(rollupOptions);
        logger.log("Bundle created successfully for:", output.file);
        await bundle.write(output);
        logger.log("Bundle written successfully to:", output.file);
      } catch (error: unknown) {
        logger.error("Error during embedded Rollup build for:", output.file);
        if (error instanceof Error) {
          this.error("Rollup build failed: " + error.message);
        }
      }
    },
  };
}

export default runtimeRollup;
