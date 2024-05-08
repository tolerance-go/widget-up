import { RollupBuild, RollupOptions, rollup, watch } from "rollup";
import getRollupConfig from "../getRollupConfig";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import packageJson from "@/package.json" assert { type: "json" };

async function processBundle(
  config: RollupOptions,
  isWatch: boolean
): Promise<boolean> {
  let buildFailed = false;
  if (isWatch) {
    // 如果是 watch 模式，创建一个 watcher 来监控文件变动
    const watcher = watch(config);
    watcher.on("event", (event) => {
      /**
       * 假设你正在开发一个复杂的前端项目，每次源码修改可能只影响部分模块，
       * Rollup 会为这些变更触发一次 BUNDLE_START 和一次 BUNDLE_END。
       * 如果在一个较短的时间内有多次文件修改，每次修改都会对应一次 BUNDLE_END，
       * 而 END 事件只有在所有这些更改都被处理完毕后才会触发。
       * 因此，END 用于确保所有的连续构建任务都已彻底完成，而 BUNDLE_END 更关注单个构建的完成。
       */
      // 输出错误信息
      if (event.code === "ERROR") {
        console.error("Error during build:", event.error);
      }
      // START 事件表示监控开始
      if (event.code === "START") {
        console.log("Watching for changes...");
      }
      // // BUNDLE_START 事件表示构建开始
      // if (event.code === "BUNDLE_START") {
      //   console.log("Building...");
      // }
      // 输出 BUNDLE_END 事件表示构建结束
      if (event.code === "BUNDLE_END") {
        console.log("BUNDLE_END: Watching for changes...");
        event.result.close(); // 关闭上一次的 bundle
      }
      // 监控到构建结束时，输出提示信息
      if (event.code === "END") {
        console.log("Watching for changes...");
      }
    });
  } else {
    let bundle: RollupBuild | undefined;

    if (!config.output) {
      throw new Error("Output configuration is missing.");
    }

    try {
      bundle = await rollup(config);
    } catch (error) {
      console.error("Error during the bundle build:", error);
      buildFailed = true;
      return buildFailed;
    }

    try {
      if (Array.isArray(config.output)) {
        await Promise.all(config.output.map((output) => bundle.write(output)));
      } else {
        await bundle.write(config.output);
      }
      await bundle.close(); // 确保释放资源
    } catch (error) {
      console.error("Error during the bundle write:", error);
      buildFailed = true;
    }
  }
  return buildFailed;
}

async function buildRollup(
  env: "production" | "development",
  isWatch: boolean = false
): Promise<boolean> {
  process.env.NODE_ENV = env;

  const options: RollupOptions | RollupOptions[] = await getRollupConfig();

  if (Array.isArray(options)) {
    const buildFails = await Promise.all(
      options.map((config) => processBundle(config, isWatch))
    );
    return buildFails.some((result) => result);
  } else {
    return await processBundle(options, isWatch);
  }
}

export const bin = () => {
  yargs(hideBin(process.argv))
    .scriptName("wup") // 可以设置脚本名称
    .usage("$0 <cmd> [args]")
    .command(
      "build",
      "Builds the widget for production",
      () => {},
      async () => {
        console.log("Start Building...");
        try {
          const buildFailed = await buildRollup("production");
          process.exit(buildFailed ? 1 : 0);
        } catch (error) {
          console.error("Error during the build:", error);
        }
      }
    )
    .command(
      "dev",
      "Starts the widget in development mode with watch",
      () => {},
      async () => {
        console.log("Starting development server...");
        try {
          const buildFailed = await buildRollup("development", true);
          process.exit(buildFailed ? 1 : 0);
        } catch (error) {
          console.error("Error during the development build:", error);
        }
      }
    )
    .version(packageJson.version) // 使用package.json中的版本号
    .alias("version", "v")
    .help()
    .alias("help", "h")
    .parse();
};
