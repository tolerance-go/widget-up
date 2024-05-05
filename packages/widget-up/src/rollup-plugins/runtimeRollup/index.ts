import path from "path";
import { OutputOptions, Plugin, RollupOptions, rollup } from "rollup";
import chokidar from "chokidar";
import { Logger } from "widget-up-utils";

export interface RuntimeRollupOptions extends RollupOptions {
  output: OutputOptions; // 确保输出配置被正确传递
}

function runtimeRollup(options: RuntimeRollupOptions, name?: string): Plugin {
  let once = false;

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

  const { output, ...rollupOptions } = options;
  const inputFiles = normalizeInput(rollupOptions.input);
  logger.log("Starting embedded Rollup build for:", output.file);

  const watcher = chokidar.watch(inputFiles, {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true,
  });

  const build = async (init: boolean = false) => {
    try {
      const bundle = await rollup(rollupOptions);
      await bundle.write(output);
      await bundle.close();
      logger.log(
        `Bundle ${init ? "" : "re-"}written successfully to:`,
        output.file
      );
    } catch (error) {
      logger.error(
        `Error during embedded Rollup ${init ? "" : "re"}build for:`,
        output.file
      );
      if (error instanceof Error) {
        logger.error(
          `Rollup ${init ? "" : "re"}build failed: ${error.message}`
        );
      }
    }
  };

  watcher.on("change", async (path) => {
    logger.log(`File ${path} has been changed. Rebuilding...`);
    build();
  });

  return {
    name: "runtime-rollup",
    async buildStart() {
      if (!once) {
        once = true;
        await build(true);
      }
    },
  };
}

export default runtimeRollup;
