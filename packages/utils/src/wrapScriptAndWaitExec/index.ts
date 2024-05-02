import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  wrapScriptAndWaitExec,
  WrapScriptOptions,
} from "../wrap-scripts/wrapScriptAndWaitExec";

interface ProcessOptions {
  eventBusPath: string;
  eventName?: string;
  verbose: boolean;
}

function processFile(filePath: string, options: ProcessOptions): void {
  const { eventBusPath, eventName, verbose } = options;
  try {
    const data = fs.readFileSync(filePath, "utf8");
    if (verbose) console.log(`File read successfully: ${filePath}`);

    const finalEventName =
      eventName || path.basename(filePath, path.extname(filePath));
    const wrappedScript = wrapScriptAndWaitExec({
      scriptContent: data,
      eventId: finalEventName,
      eventBusPath: eventBusPath,
    });

    const outputFile = path.join(
      path.dirname(filePath),
      path.basename(filePath, path.extname(filePath)) +
        ".wrap" +
        path.extname(filePath)
    );

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
          eventName: {
            describe: "The event name to use",
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
      const { file, eventBusPath, eventName, verbose } = args;
      const stats = fs.statSync(file);
      const options: ProcessOptions = { eventBusPath, eventName, verbose };

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
