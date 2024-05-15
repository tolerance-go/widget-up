import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 获取当前模块的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义源包名和目标路径
const packageName = "widget-up-schema-form";

// 获取当前工作目录
const cwd = process.cwd();
const targetDir = path.resolve(cwd, "server/libs");

// 定义源包路径
const packageDir = path.join(cwd, "node_modules", packageName);
const packageJsonPath = path.join(packageDir, "package.json");

// 读取 package.json 文件
async function readPackageJson(filePath: string) {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

// 复制文件函数
async function copyFile(src: string, dest: string) {
  await fs.copyFile(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
}

async function main() {
  try {
    const packageJson = await readPackageJson(packageJsonPath);

    // 解析 browser 和 style 字段
    const browserEntry = packageJson.browser;
    const styleEntry = packageJson.style;

    if (!browserEntry || !styleEntry) {
      console.error(
        `Error: ${packageName} package.json does not contain browser and/or style fields.`
      );
      process.exit(1);
    }

    // 定义源文件路径
    const browserEntryPath = path.join(packageDir, browserEntry);
    const styleEntryPath = path.join(packageDir, styleEntry);

    // 定义目标文件路径
    const targetBrowserPath = path.join(targetDir, path.basename(browserEntry));
    const targetStylePath = path.join(targetDir, path.basename(styleEntry));

    // 创建目标目录（如果不存在）
    await fs.mkdir(targetDir, { recursive: true });

    // 复制 UMD 入口文件和 CSS 样式文件到目标目录
    await copyFile(browserEntryPath, targetBrowserPath);
    await copyFile(styleEntryPath, targetStylePath);

    console.log("All files have been copied successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
