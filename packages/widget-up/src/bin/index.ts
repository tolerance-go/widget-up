import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import packageJson from "@/package.json" assert { type: "json" };

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct the path to the Rollup configuration file
const rollupConfigPath = join(__dirname, "./rollup.config.js");
const rollupBinPath = join(__dirname, "../node_modules/.bin/rollup");


function runRollupCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve();
    });

    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });
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
          await runRollupCommand(
             `${rollupBinPath} -c ${rollupConfigPath} --environment NODE_ENV:production`
          );
          process.exit(0);
        } catch (error) {
          console.error("Error during the build:", error);
          process.exit(1);
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
          await runRollupCommand(
             `${rollupBinPath} -c ${rollupConfigPath} --watch --environment NODE_ENV:development`
          );
        } catch (error) {
          console.error("Error during the development build:", error);
          process.exit(1);
        }
      }
    )
    .version(packageJson.version) // 使用package.json中的版本号
    .alias("version", "v")
    .help()
    .alias("help", "h")
    .parse();
};
