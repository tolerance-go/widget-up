/**
 * 是什么
 *
 * - 根据 demoMenus 数组生成 rollup 的入口配置
 *
 * 解决什么需求
 *
 * - 开发的时候，把 demo 里面的文件作为入口，构建到 dist/demos 里面
 *
 * 怎么用
 *
 * ```ts
 * import { getDemoInputs } from "widget-up";
 *
 * const demoInputs = getDemoInputs({...});
 */

import { DemoMenuMeta } from "@/types/demoFileMeta";

/**
 * 递归构建 demo 入口配置
 * @param menuItems 菜单项数组
 * @param basePath 基础路径（递归过程中会更新这个路径）
 * @returns Rollup入口对象
 */
function buildInputs(menuItems: DemoMenuMeta[]): Record<string, string> {
  let inputs: Record<string, string> = {};

  for (const item of menuItems) {
    // 将文件路径添加到输入配置
    inputs[item.name] = item.path;

    // 如果有子菜单，递归处理
    if (item.children) {
      const childInputs = buildInputs(item.children);
      inputs = { ...inputs, ...childInputs };
    }
  }

  return inputs;
}

/**
 * 获取 Demo 入口
 * @param demoMenus Demo菜单项数组
 * @returns Rollup入口配置对象
 */
export function getDemoInputs(
  demoMenus: DemoMenuMeta[]
): Record<string, string> {
  return buildInputs(demoMenus);
}
