#!/usr/bin/env node

import fs from "fs";
import { glob } from "glob";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { wrapUMDAsyncEventCode } from "../../wrapUMDAsyncEventCode";

interface ProcessOptions {
  eventBusPath: string;
  eventId?: string;
  verbose: boolean;
  serverBase?: string;
}

function processFile(filePath: string, options: ProcessOptions): void {
  const { eventBusPath, eventId, verbose, serverBase = "" } = options;
  try {
    const data = fs.readFileSync(filePath, "utf8");
    if (verbose) console.log(`File read successfully: ${filePath}`);

    const outputFile = path.join(
      path.dirname(filePath),
      path.basename(filePath, path.extname(filePath)) +
        ".async-wrap" +
        path.extname(filePath)
    );

    let relativePath = outputFile;
    if (outputFile.startsWith(serverBase)) {
      relativePath = outputFile.substring(serverBase.length);
      relativePath = path.normalize(relativePath).replace(/\\/g, "/");
    }

    const finalEventId = eventId || relativePath;
    const wrappedScript = wrapUMDAsyncEventCode({
      scriptContent: data,
      eventId: finalEventId,
      eventBusPath: eventBusPath,
    });

    fs.writeFileSync(outputFile, wrappedScript);
    if (verbose) console.log(`Wrapped script written to ${outputFile}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

yargs(hideBin(process.argv))
  .command(
    "$0 [patterns...]",
    "Wrap a JavaScript file or all files in a directory with script wrapper",
    (yargs) =>
      yargs
        .positional("patterns", {
          describe: "The JavaScript file or directory to wrap",
          type: "string",
          demandOption: true,
          array: true,
        })
        .options({
          eventId: {
            describe: "The event name to use",
            type: "string",
          },
          serverBase: {
            describe: "服务器根路径",
            type: "string",
          },
          eventBusPath: {
            alias: "e",
            describe: "The EventBus access path",
            default: "EventBus",
            type: "string",
          },
          verbose: {
            alias: "v",
            describe: "Run with verbose logging",
            default: false,
            type: "boolean",
          },
        }),
    async (args) => {
      const { patterns, eventBusPath, eventId, verbose, serverBase } = args;

      const files = await glob(patterns, {
        ignore: ["**/node_modules/**"],
        nodir: true,
      });
      const options: ProcessOptions = {
        eventBusPath,
        eventId,
        verbose,
        serverBase,
      };
      files.forEach((file) => {
        processFile(file, options);
      });
    }
  )
  .parse();
