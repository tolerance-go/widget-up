#!/usr/bin/env node

// Import necessary modules
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import packageJson from "@/package.json" assert { type: "json" };

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct the path to the Rollup configuration file and binaries
const rollupConfigPath = join(__dirname, "./rollup.config.js");
const rollupBinPath = join(__dirname, "../node_modules/.bin/rollup");
const crossEnvBinPath = join(__dirname, "../node_modules/.bin/cross-env");

// Function to run a command
function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve(true);
    });

    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });
}

// Configure yargs for command-line arguments and commands
yargs(hideBin(process.argv))
  .scriptName("wup")
  .usage("$0 <cmd> [args]")
  .command(
    "build",
    "Builds the widget for production",
    (yargs) => {
      yargs.option("tsconfigPath", {
        type: "string",
        describe: "Path to the TypeScript configuration file",
        demandOption: true,
      });
    },
    async (argv) => {
      console.log("Start Building...");
      try {
        await runCommand(
          `${crossEnvBinPath} NODE_ENV=production TSCONFIG_PATH=${argv.tsconfigPath} ${rollupBinPath} -c ${rollupConfigPath}`
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
        await runCommand(
          `${crossEnvBinPath} NODE_ENV=development ${rollupBinPath} -c ${rollupConfigPath} --watch`
        );
      } catch (error) {
        console.error("Error during the development build:", error);
        process.exit(1);
      }
    }
  )
  .version(packageJson.version)
  .alias("version", "v")
  .help()
  .alias("help", "h")
  .parse();
