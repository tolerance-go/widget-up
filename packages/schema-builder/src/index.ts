import { Command } from "commander";
import TJS from "typescript-json-schema";
import chokidar from "chokidar";
import fs from "fs-extra";
import { resolve } from "path";
import ts from "typescript";
import debounce from "lodash.debounce";

const program = new Command();
// 读取配置文件
const config = JSON.parse(
  fs.readFileSync(resolve("schema-builder.json"), "utf8"),
);
// 定义 TypeScript 文件的目录
const typesDirectory = resolve(config.typesDirectory ?? "types");
// 定义输出目录
const outputDirectory = resolve("dist-schema");

// TypeScript JSON Schema 设置
const settings: TJS.PartialArgs = {
  required: true,
};

const generateSchema = (watch: boolean) => {
  // 定义 generate 函数
  const generate = () => {
    const tsconfigPath = resolve("tsconfig.json");
    const parsedTsconfig = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

    if (parsedTsconfig.error) {
      console.error("Error reading tsconfig.json:", parsedTsconfig.error);
      return;
    }

    const { options, errors } = ts.parseJsonConfigFileContent(
      parsedTsconfig.config,
      ts.sys,
      resolve("."),
      {},
      tsconfigPath,
    );

    if (errors && errors.length > 0) {
      console.error("Error parsing tsconfig.json:", errors);
      return;
    }

    const program = TJS.getProgramFromFiles(
      [resolve(typesDirectory, "index.d.ts")],
      options,
    );

    const schema = TJS.generateSchema(program, config.fullTypeName, settings);
    fs.ensureDirSync(outputDirectory);
    fs.writeJsonSync(resolve(outputDirectory, config.outputFileName), schema, {
      spaces: 2,
    });
    console.log(
      `Schema generated at ${resolve(outputDirectory, config.outputFileName)}`,
    );
  };

  // 如果是监听模式，使用防抖函数
  const debouncedGenerate = debounce(generate, 300);

  if (watch) {
    chokidar
      .watch(typesDirectory, {
        ignored: /(^|[\/\\])\../, // 忽略以点开头的文件或文件夹
      })
      .on("all", (event, path) => {
        if (event === "add" || event === "change") {
          console.log(`${event} detected in ${path}`);
          debouncedGenerate();
        }
      });
  } else {
    // 不是监听模式时，直接执行 generate 函数
    generate();
  }
};

program
  .command("dev")
  .description("Watch type files and generate JSON schema on changes.")
  .action(() => generateSchema(true));

program
  .command("build")
  .description("Generate JSON schema from type files.")
  .action(() => generateSchema(false));

program.parse(process.argv);
