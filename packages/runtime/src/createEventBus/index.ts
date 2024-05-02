import { EventBus, TagEvents } from "widget-up-utils";

// 定义事件类型和相关数据
export interface AppEvents extends TagEvents {
  menuClick: { id: string }; // 点击菜单项事件，携带菜单项 ID
  // 可以在此添加更多事件类型和数据结构
}

// 创建并配置 EventBus 的工厂函数
export function createEventBus() {
  const eventBus = new EventBus<AppEvents>(true);

  // 如果需要预先注册一些事件监听器，可以在这里完成
  // 例如：eventBus.on('menuClick', (payload) => console.log('Menu item clicked:', payload.itemId));

  return eventBus;
}
