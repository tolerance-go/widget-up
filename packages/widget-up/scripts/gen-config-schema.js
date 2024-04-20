import TJS from "typescript-json-schema";
import fs from "fs";
import path from "path";

// TypeScript 编译器选项
const settings = {
  required: true,
};

const compilerOptions = {
  strictNullChecks: true,
  lib: ["es2015", "dom"], // 添加 ES2015 支持，'dom' 可选，取决于你的项目是否需要DOM类型
};

async function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  try {
    await fs.promises.access(dirname);
  } catch (e) {
    // 目录不存在，需要创建
    await fs.promises.mkdir(dirname, { recursive: true });
  }
}

// 加载 TypeScript 文件和生成 Schema
async function generateSchema() {
  const outputPath = path.resolve("./dist/config-schema.json");
  await ensureDirectoryExistence(outputPath);

  const program = TJS.getProgramFromFiles(
    // 执行上下文
    [
      path.resolve(
        "./node_modules/widget-up-utils/dist/types/index.d.ts"
      ),
    ],
    compilerOptions
  );

  const schema = TJS.generateSchema(program, "Config", settings);

  if (schema) {
    await fs.promises.writeFile(outputPath, JSON.stringify(schema, null, 2));
    console.log("Schema generated successfully.");
  } else {
    console.log("Failed to generate schema.");
  }
}

generateSchema();
