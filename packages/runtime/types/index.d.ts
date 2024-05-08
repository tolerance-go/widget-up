import type { DemoMenuItem, TagEvents } from "widget-up-utils";

// 定义事件类型和相关数据
export interface AppEvents extends TagEvents {
  menuClick: Pick<DemoMenuItem, "globals" | "name">; // 点击菜单项事件，携带菜单项 ID
  // 可以在此添加更多事件类型和数据结构
  globalComponentUpdated: {};
}
