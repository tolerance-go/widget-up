import nodeFs from "fs";
import { join } from "path";

// 定义检测技术栈的函数
export function detectTechStack({
  fs = nodeFs,
}: {
  fs?: typeof import("fs");
} = {}) {
  try {
    // 构造 package.json 的路径
    const path = join(process.cwd(), "package.json");
    // 同步读取 package.json 文件
    const data = fs.readFileSync(path, "utf8");
    // 解析 JSON 数据
    const packageJson = JSON.parse(data);
    // 获取依赖
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // 定义技术栈关键字，并添加索引签名
    const techStacks: { [key: string]: string[] } = {
      React: ["react", "react-dom"],
      Vue: ["vue"],
      Angular: ["@angular/core"],
      Svelte: ["svelte"],
      JQuery: ["jquery"],
    };

    // 检查使用的技术栈
    const usedStacks = Object.keys(techStacks).filter((stack) =>
      techStacks[stack].some((dependency: string) =>
        dependencies.hasOwnProperty(dependency)
      )
    );

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
