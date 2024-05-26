import { DemoMenuItem } from "widget-up-utils";

export function findMenuItemByName(
  items: DemoMenuItem[],
  name: string
): DemoMenuItem | undefined {
  // 遍历每个项目
  for (const item of items) {
    // 检查当前项目的名字是否匹配
    if (item.name === name) {
      return item;
    }
    // 如果有子项目，递归地在子项目中查找
    if (item.children) {
      const found = findMenuItemByName(item.children, name);
      if (found) {
        return found;
      }
    }
  }
  // 如果没有找到，返回 undefined
  return undefined;
}
