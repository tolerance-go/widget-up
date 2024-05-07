import { RollupBuild, RollupOptions, rollup, watch } from "rollup";
import getRollupConfig from "../core/getRollupConfig";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import packageJson from "@/package.json" assert { type: "json" };

async function processBundle(
  config: RollupOptions,
  isWatch: boolean
): Promise<void> {
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
        console.error(event.error);
      }
      // START 事件表示监控开始
      if (event.code === "START") {
        console.log("Watching for changes...");
      }
      // // BUNDLE_START 事件表示构建开始
      // if (event.code === "BUNDLE_START") {
      //   console.log("Building...");
      // }
      // // 输出 BUNDLE_END 事件表示构建结束
      // if (event.code === "BUNDLE_END") {
      //   console.log("BUNDLE_END: Watching for changes...");
      // }
      // 监控到构建结束时，输出提示信息
      if (event.code === "END") {
        console.log("Watching for changes...");
      }
    });
  } else {
    const bundle: RollupBuild = await rollup(config);
    if (Array.isArray(config.output)) {
      for (const output of config.output) {
        await bundle.write(output);
      }
    } else {
      if (!config.output) {
        throw new Error("Output configuration is missing.");
      }
      await bundle.write(config.output);
    }
    await bundle.close();
  }
}

async function buildRollup(
  env: "production" | "development",
  isWatch: boolean = false
): Promise<void> {
  process.env.NODE_ENV = env;

  const options: RollupOptions | RollupOptions[] = await getRollupConfig();

  if (Array.isArray(options)) {
    for (const config of options) {
      if (config) {
        await processBundle(config, isWatch);
      }
    }
  } else {
    if (options) {
      await processBundle(options, isWatch);
    }
  }

  if (!isWatch) {
    console.log(`${env} build complete.`);
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
      () => {
        console.log("Running clean up...");
        console.log("Building...");
        buildRollup("production").catch(console.error);
      }
    )
    .command(
      "dev",
      "Starts the widget in development mode with watch",
      () => {},
      () => {
        console.log("Starting development server...");
        buildRollup("development", true).catch(console.error);
      }
    )
    .version(packageJson.version) // 使用package.json中的版本号
    .alias("version", "v")
    .help()
    .alias("help", "h")
    .parse();
};
