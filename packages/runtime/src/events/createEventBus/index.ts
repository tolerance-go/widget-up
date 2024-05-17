import { AppEvents } from "@/types";
import { EventBus } from "widget-up-utils";

// 创建并配置 EventBus 的工厂函数
export function createEventBus() {
  const eventBus = new EventBus<AppEvents>();
  return eventBus;
}
