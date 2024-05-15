import type { DemoMenuItem, TagEvents } from "widget-up-utils";

// 定义事件类型和相关数据
export interface AppEvents extends TagEvents {
  menuClick: Pick<DemoMenuItem, "globals" | "name">; // 点击菜单项事件，携带菜单项 ID
  /** 中间舞台的组件全局变量更新后 */
  globalComponentUpdated: {};
  // 右侧栏渲染完成
  rightPanelMounted: {
    rightPanel: HTMLElement;
  };
}
