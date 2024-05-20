#!/usr/bin/env node

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { bin } from "widget-up-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodeModulesPath = join(__dirname, "../node_modules");

const rollupConfigPath = join(__dirname, "rollup.config.js");
const rollupBinPath = join(nodeModulesPath, ".bin/rollup");
const crossEnvBinPath = join(nodeModulesPath, ".bin/cross-env");

bin({
  rollupBinPath,
  rollupConfigPath,
  crossEnvBinPath,
});
