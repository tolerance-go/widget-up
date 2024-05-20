#!/usr/bin/env node

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { bin } from "./bin";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct the path to the Rollup configuration file and binaries
const rollupConfigPath = join(__dirname, "./rollup.config.js");
const rollupBinPath = join(__dirname, "../node_modules/.bin/rollup");
const crossEnvBinPath = join(__dirname, "../node_modules/.bin/cross-env");

bin({
  rollupBinPath,
  rollupConfigPath,
  crossEnvBinPath,
});
