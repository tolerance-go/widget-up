import { RollupBuild, RollupOptions, rollup, watch } from "rollup";
import getRollupConfig from "../getRollupConfig";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import packageJson from "@/package.json" assert { type: "json" };

async function processBundle(
  config: RollupOptions,
  isWatch: boolean
): Promise<void> {
  if (isWatch) {
    const watcher = watch(config);
    watcher.on("event", (event) => {
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
    .alias('version', 'v') 
    .help()
    .alias("help", "h")
    .parse();
};
