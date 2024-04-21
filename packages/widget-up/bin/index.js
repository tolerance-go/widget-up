#!/usr/bin/env node

import { Command } from "commander";
import { execSync } from "child_process";
import packageJson from "../package.json" assert { type: "json" };

import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const configFile = path.join(__dirname, "./rollup.config.js");
const localRollup = path.join(__dirname, "../node_modules/.bin/rollup");

const program = new Command();

// Helper function to run scripts
function runScript(command) {
  execSync(command, { stdio: "inherit" });
}

function runRollup(command, env) {
  process.env.NODE_ENV = env; // 设置环境变量
  runScript(`${localRollup} ${command} -c ${configFile}`);
}

program
  .version(packageJson.version)
  .description("CLI to bundle widgets using Rollup");

program
  .command("build")
  .description("Builds the widget for production")
  .action(() => {
    console.log("Running clean up...");
    console.log("Building...");
    runRollup("", "production");
  });

program
  .command("dev")
  .description("Starts the widget in development mode with watch")
  .action(() => {
    console.log("Starting development server...");
    runRollup("-w", "development");
  });

program.parse(process.argv);
