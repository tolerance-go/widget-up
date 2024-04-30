import * as fs from "fs";
import * as yargs from "yargs";
import { wrapScriptAndWaitExec } from "../wrap-scripts/wrapScriptAndWaitExec";
import * as path from "path";

// 使用 yargs 解析命令行参数
const argv = yargs
  .scriptName("widget-up-utils")
  .usage("$0 <cmd> [args]")
  .command(
    "wrapScriptAndWaitExec <file> --eventBusPath [string] --eventName [string]",
    "Wrap a JavaScript file with script wrapper",
    {
      file: {
        type: "string",
        describe: "The JavaScript file to wrap",
      },
      eventBusPath: {
        alias: "e",
        type: "string",
        description: "The EventBus access path",
        default: "EventBus",
      },
      eventName: {
        alias: "n",
        type: "string",
        description: "The event name to use",
        demandOption: true,
      },
    },
    (args) => {
      const { file, eventBusPath, eventName } = args;

      if (!file) throw new Error("file not defined.");

      // 如果未提供eventName，则从文件名中提取
      const finalEventName =
        eventName || path.basename(file, path.extname(file));

      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          console.error(`Error reading ${file}:`, err);
          return;
        }

        // 调用 wrapScriptAndWaitExec 函数
        const wrappedScript = wrapScriptAndWaitExec({
          scriptContent: data,
          eventName: finalEventName,
          eventBusPath: eventBusPath,
        });

        // 写入新文件
        const outputFile = file + ".wrap";
        fs.writeFile(outputFile, wrappedScript, (err) => {
          if (err) {
            console.error(`Error writing ${outputFile}:`, err);
          } else {
            console.log(`Wrapped script written to ${outputFile}`);
          }
        });
      });
    }
  )
  .help().argv;
