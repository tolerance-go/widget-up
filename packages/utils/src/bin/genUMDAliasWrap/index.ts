#!/usr/bin/env node
import { UMDAliasJSONOptions, wrapUMDAliasCode } from "@/src/wrapUMDAliasCode";
import fs from "fs";
import { glob } from "glob";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// 处理文件，生成 UMD 元数据
function processFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const metaDataPath = path.join(
      path.parse(filePath).dir,
      `${path.basename(filePath, ".js")}.meta.json`
    );
    // 读取 metaDataPath json 文件
    const umdAliasOptions: UMDAliasJSONOptions = JSON.parse(
      fs.readFileSync(metaDataPath, "utf8")
    );

    const nextContent = wrapUMDAliasCode({
      scriptContent: content,
      imports: umdAliasOptions.imports,
      exports: umdAliasOptions.exports,
    });

    const outputFilePath = path.join(
      path.parse(filePath).dir,
      `${path.basename(filePath, ".js")}.alias-wrap.js`
    );

    fs.writeFileSync(outputFilePath, nextContent);
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
