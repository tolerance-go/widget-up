#!/usr/bin/env node

import { UMDAliasJSONOptions } from "@/src/modifyUMDScript";
import { parseUMDMeta } from "@/src/parseUMDMeta";
import fs from "fs";
import { glob } from "glob";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// 处理文件，生成 UMD 元数据
function processFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const metaData = parseUMDMeta({ scriptContent: content });

    const umdAliasOptions: UMDAliasJSONOptions = {
      imports: metaData.importGlobals.map((globalVar) => ({
        globalVar,
        scopeVar: globalVar,
      })),
      exports: {
        globalVar: metaData.exportGlobal ?? "",
        scopeVar: metaData.exportGlobal ?? "",
      },
    };

    const outputFilePath = path.join(
      path.parse(filePath).dir,
      `${path.basename(filePath, ".js")}.umd-meta.json`
    );

    // 注意如果已经有了同名文件，就不生成了，而是提示用户，如果要生成，手动删除后再次运行
    if (fs.existsSync(outputFilePath)) {
      console.log(`Metadata already exists: ${outputFilePath}`);
      return;
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(umdAliasOptions, null, 2));
    console.log(`Metadata generated: ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// 使用 Glob 模式匹配并处理文件
async function processFiles(patterns: string[]) {
  try {
    const files = await glob(patterns, {
      ignore: ["**/node_modules/**"],
      nodir: true,
    });
    console.log("files", files);
    files.forEach(processFile);
  } catch (error) {
    console.error("Error matching files:", error);
  }
}

// 设置命令行参数解析
yargs(hideBin(process.argv))
  .command(
    // 需要可以输入多个文件路径
    "$0 [patterns...]",
    "Generate UMD metadata for matched files",
    (yargs) =>
      yargs.positional("patterns", {
        describe: "Glob pattern to match files",
        type: "string",
        demandOption: true,
        array: true,
      }),
    (argv) => {
      console.log("argv.patterns", argv.patterns);
      processFiles(argv.patterns);
    }
  )
  .parse();
