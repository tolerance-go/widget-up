import { logger } from "./logger";

interface OnOptions {
  immediate?: boolean;
}

export class EventBus<TEvents extends Record<string, any>> {
  private listeners: {
    [K in keyof TEvents]?: ((payload: TEvents[K]) => void)[];
  } = {};

  private eventHistory: {
    [K in keyof TEvents]?: TEvents[K];
  } = {};

  // 在构造函数中接受一个参数来设置是否开启调试模式
  constructor() {}

  // 注册事件监听器
  on<K extends keyof TEvents>(
    eventType: K,
    listener: (payload: TEvents[K]) => void,
    options?: OnOptions
  ): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType]!.push(listener);

    // 如果开启调试模式，打印监听器注册信息
    logger.log(`已注册事件监听器 '${String(eventType)}'。`);

    // 如果选项中 immediate 为 true，并且该事件已触发过，则立即调用监听器
    if (options?.immediate && this.eventHistory[eventType] !== undefined) {
      listener(this.eventHistory[eventType]!);
      logger.log(
        `事件监听器 '${String(eventType)}' 已立即执行，携带数据：`,
        this.eventHistory[eventType]
      );
    }
  }

  // 移除事件监听器
  off<K extends keyof TEvents>(
    eventType: K,
    listener: (payload: TEvents[K]) => void
  ): void {
    const listeners = this.listeners[eventType];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
        // 如果开启调试模式，打印监听器移除信息
        logger.log(`已移除事件监听器 '${String(eventType)}'。`);
      }
    }
  }

  // 触发事件
  emit<K extends keyof TEvents>(eventType: K, payload: TEvents[K]): void {
    const listeners = this.listeners[eventType];
    // 存储已触发的事件及其数据
    this.eventHistory[eventType] = payload;

    if (listeners) {
      // 如果开启调试模式，打印事件触发信息
      logger.log(`事件 '${String(eventType)}' 已触发，携带数据：`, payload);
      listeners.forEach((listener) => listener(payload));
    }
  }
}
