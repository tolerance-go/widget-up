import MagicString from "magic-string";
import path from "path";
import {
  NormalizedOutputOptions,
  OutputOptions,
  Plugin,
  RenderedChunk,
  RollupOptions,
  RollupWatcher,
  rollup,
  watch,
} from "rollup";
import { FileLogger } from "widget-up-utils";

export interface RuntimeRollupOptions extends RollupOptions {
  output: OutputOptions; // 确保输出配置被正确传递
  overwriteChunkCode?: (
    code: string,
    chunk: RenderedChunk,
    options: NormalizedOutputOptions
  ) => string; // 可选的代码替换函数
}

function runtimeRollup(options: RuntimeRollupOptions, name?: string): Plugin {
  let watcher: RollupWatcher | null = null;

  const logger = new FileLogger(
    path.join(
      process.cwd(),
      ".logs/runtime-rollup",
      name || "",
      new Date().toISOString().substring(0, 10)
    )
  );

  const { output, overwriteChunkCode, ...restRollupOptions } = options;
  logger.log("Configured embedded Rollup build for:", output.file);

  // 创建一个内部插件，用于包含 renderChunk 逻辑
  const internalPlugin: Plugin = {
    name: "runtime-rollup-internal",
    renderChunk(code, chunk, options) {
      if (!overwriteChunkCode) return null;

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

  const build = async () => {
    try {
      const buildOptions: RollupOptions = {
        ...restRollupOptions,
        output,
        plugins: [restRollupOptions.plugins, internalPlugin],
      };

      const bundle = await rollup(buildOptions);
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
  const setup = () => {
    const watcherOptions: RollupOptions = {
      ...restRollupOptions,
      output,
      plugins: [restRollupOptions.plugins, internalPlugin],
    };

    if (watcherOptions.watch) {
      if (!watcher) {
        console.log(`Setting up watcher for:`, output.file);
        watcher = watch(watcherOptions);
        watcher.on("event", (event) => {
          switch (event.code) {
            case "BUNDLE_START":
              console.log(`Bundling...`);
              break;
            case "BUNDLE_END":
              console.log(`Bundle written successfully to:`, output.file);
              event.result.close(); // 关闭上一次的 bundle
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
      setup(); // 在首次构建开始时设置监听
    },
  };
}

export default runtimeRollup;
