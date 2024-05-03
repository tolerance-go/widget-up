import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  wrapScriptAndWaitExec,
  WrapScriptOptions,
} from "../../scripts/wrapScriptAndWaitExec";

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
        ".wrap" +
        path.extname(filePath)
    );

    let relativePath = outputFile;
    if (outputFile.startsWith(serverBase)) {
      relativePath = outputFile.substring(serverBase.length);
      relativePath = path.normalize(relativePath).replace(/\\/g, "/");
    }

    const finalEventId = eventId || relativePath;
    const wrappedScript = wrapScriptAndWaitExec({
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

function processDirectory(
  directoryPath: string,
  options: ProcessOptions
): void {
  fs.readdirSync(directoryPath).forEach((file) => {
    const fullPath = path.join(directoryPath, file);
    const stats = fs.statSync(fullPath);
    // Skip files that have already been wrapped (contain ".wrap.")
    if (path.basename(fullPath).includes(".wrap.")) {
      if (options.verbose) console.log(`Skipping wrapped file: ${fullPath}`);
      return;
    }
    if (stats.isDirectory()) {
      processDirectory(fullPath, options); // Recursively process subdirectories
    } else if (stats.isFile()) {
      processFile(fullPath, options);
    }
  });
}

yargs(hideBin(process.argv))
  .command(
    "exec <file>",
    "Wrap a JavaScript file or all files in a directory with script wrapper",
    (yargs) =>
      yargs
        .positional("file", {
          describe: "The JavaScript file or directory to wrap",
          type: "string",
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
    (args: any) => {
      const { file, eventBusPath, eventId, verbose, serverBase } = args;
      const stats = fs.statSync(file);
      const options: ProcessOptions = {
        eventBusPath,
        eventId,
        verbose,
        serverBase,
      };

      if (stats.isDirectory()) {
        processDirectory(file, options);
      } else if (stats.isFile()) {
        processFile(file, options);
      } else {
        throw new Error("Provided path is neither a file nor a directory.");
      }
    }
  )
  .parse();
