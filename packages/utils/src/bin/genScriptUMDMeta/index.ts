import fs from "fs";
import path from "path";
import { glob } from "glob";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { parseUMDMeta } from "@/src/parseUMDMeta";

// 处理文件，生成 UMD 元数据
function processFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const metaData = parseUMDMeta({ scriptContent: content });

    const outputFilePath = `${path.basename(filePath, ".js")}.umd-meta.json`;

    // 注意如果已经有了同名文件，就不生成了，而是提示用户，如果要生成，手动删除后再次运行
    if (fs.existsSync(outputFilePath)) {
      console.log(`Metadata already exists: ${outputFilePath}`);
      return;
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(metaData, null, 2));
    console.log(`Metadata generated: ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// 使用 Glob 模式匹配并处理文件
async function processFiles(pattern: string) {
  try {
    const files = glob.sync(pattern);
    files.forEach(processFile);
  } catch (error) {
    console.error("Error matching files:", error);
  }
}

// 设置命令行参数解析
yargs(hideBin(process.argv))
  .command(
    "$0 <pattern>",
    "Generate UMD metadata for matched files",
    (yargs) =>
      yargs.positional("pattern", {
        describe: "Glob pattern to match files",
        type: "string",
        demandOption: true,
      }),
    (argv) => {
      processFiles(argv.pattern);
    }
  )
  .parse();
