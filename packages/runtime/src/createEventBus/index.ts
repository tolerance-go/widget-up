import { AppEvents } from "@/types";
import { EventBus } from "widget-up-utils";

// 创建并配置 EventBus 的工厂函数
export function createEventBus() {
  const eventBus = new EventBus<AppEvents>(true);

  // 如果需要预先注册一些事件监听器，可以在这里完成
  // 例如：eventBus.on('menuClick', (payload) => console.log('Menu item clicked:', payload.itemId));

  return eventBus;
}
