import { TechStack, TechType } from "@/types";
import nodeFs from "fs";
import nodePath from "path";

// 定义检测技术栈的函数
export function detectTechStack({
  fs = nodeFs,
  path = nodePath,
}: {
  fs?: typeof import("fs");
  path?: typeof import("path");
} = {}): TechStack[] {
  try {
    // 获取项目的根目录路径
    const rootPath = process.cwd();
    // 读取根目录的 package.json 文件
    const packageData = fs.readFileSync(
      path.join(rootPath, "package.json"),
      "utf8"
    );
    const packageJson = JSON.parse(packageData);

    // 获取所有依赖
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // 定义支持的技术栈及其关键依赖项
    const techStacks: { [key in TechType]: string[] } = {
      React: ["react", "react-dom"],
      Vue: ["vue"],
      Angular: ["@angular/core"],
      Svelte: ["svelte"],
      JQuery: ["jquery"],
    };

    // 准备收集使用的技术栈和版本信息
    let usedStacks: TechStack[] = [];

    // 遍历所有技术栈
    for (const [stack, deps] of Object.entries(techStacks)) {
      for (const dep of deps) {
        if (dependencies[dep] && usedStacks.every((s) => s.name !== stack)) {
          // 构造 node_modules 内对应依赖的 package.json 路径
          const depPackagePath = path.join(
            rootPath,
            "node_modules",
            dep,
            "package.json"
          );
          if (fs.existsSync(depPackagePath)) {
            // 读取依赖的 package.json 文件获取实际安装的版本
            const depPackageData = fs.readFileSync(depPackagePath, "utf8");
            const depPackageJson = JSON.parse(depPackageData);
            // 收集技术栈和版本信息
            usedStacks.push({
              name: stack as TechType,
              version: depPackageJson.version,
              versionRange: dependencies[dep],
            });
          }
        }
      }
    }

    // 返回结果或抛出异常
    if (usedStacks.length > 0) {
      return usedStacks;
    } else {
      throw new Error("No known front-end tech stack detected");
    }
  } catch (error) {
    // 处理错误
    console.error("Error detecting tech stack:", error);
    throw new Error("Failed to detect tech stack");
  }
}
