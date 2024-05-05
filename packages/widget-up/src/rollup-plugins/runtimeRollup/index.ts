import path from "path";
import { OutputOptions, Plugin, RollupOptions, rollup } from "rollup";
import chokidar from "chokidar";
import { Logger } from "widget-up-utils";

export interface RuntimeRollupOptions extends RollupOptions {
  output: OutputOptions; // 确保输出配置被正确传递
}

function runtimeRollup(options: RuntimeRollupOptions, name?: string): Plugin {
  const logger = new Logger(
    path.join(
      process.cwd(),
      ".logs/runtime-rollup",
      name || "",
      new Date().toISOString().substring(0, 10)
    )
  );

  // Function to normalize input paths
  function normalizeInput(input: RollupOptions["input"]): string[] {
    if (typeof input === "string") {
      return [input];
    } else if (Array.isArray(input)) {
      return input;
    } else if (typeof input === "object" && input !== null) {
      return Object.values(input);
    } else {
      return []; // Default case, should not happen generally
    }
  }

  return {
    name: "runtime-rollup",

    async buildStart() {
      const { output, ...rollupOptions } = options;
      const inputFiles = normalizeInput(rollupOptions.input);
      logger.log("Starting embedded Rollup build for:", output.file);

      const watcher = chokidar.watch(inputFiles, {
        ignored: /(^|[\/\\])\../, // Ignore dotfiles
        persistent: true,
      });

      watcher.on("change", async (path) => {
        logger.log(`File ${path} has been changed. Rebuilding...`);
        try {
          const bundle = await rollup(rollupOptions);
          await bundle.write(output);
          await bundle.close();
          logger.log("Bundle re-written successfully to:", output.file);
        } catch (error) {
          logger.error(
            "Error during embedded Rollup rebuild for:",
            output.file
          );
          if (error instanceof Error) {
            logger.error("Rollup rebuild failed: " + error.message);
          }
        }
      });

      try {
        const bundle = await rollup(rollupOptions);
        await bundle.write(output);
        await bundle.close();
        logger.log("Initial bundle written successfully to:", output.file);
      } catch (error) {
        logger.error("Error during initial Rollup build for:", output.file);
        if (error instanceof Error) {
          logger.error("Initial Rollup build failed: " + error.message);
        }
      }
    },
  };
}

export default runtimeRollup;
