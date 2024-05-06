import { DemoInput } from "@/types";
import { DemoData } from "@/types/demoFileMeta";
import path from "path";

/**
 * 递归构建 demo 入口配置
 * @param menuItems 菜单项数组
 * @param basePath 基础路径（递归过程中会更新这个路径）
 * @returns Rollup入口对象
 */
function buildInputs(menuItems: DemoData[]): DemoInput[] {
  let inputs: DemoInput[] = [];

  for (const item of menuItems) {
    // 将文件路径添加到输入配置

    if (item.type === "file") {
      inputs.push({
        name: path.parse(item.path).name,
        path: item.path,
      });
    }

    // 如果有子菜单，递归处理
    if (item.children) {
      const childInputs = buildInputs(item.children);
      inputs = [...inputs, ...childInputs];
    }
  }

  return inputs;
}

/**
 * 获取 Demo 入口
 * @param demoMenus Demo菜单项数组
 * @returns Rollup入口配置对象
 */
export function getDemoInputList(demoMenus: DemoData[]): DemoInput[] {
  return buildInputs(demoMenus);
}
