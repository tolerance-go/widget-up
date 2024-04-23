// 定义 EventBus 类，支持通过泛型管理事件类型和负载
class EventBus<TEvents extends Record<string, any>> {
  private listeners: {
    [K in keyof TEvents]?: ((payload: TEvents[K]) => void)[];
  } = {};

  // 注册事件监听器
  on<K extends keyof TEvents>(
    eventType: K,
    listener: (payload: TEvents[K]) => void
  ): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType]!.push(listener);
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
      }
    }
  }

  // 触发事件
  emit<K extends keyof TEvents>(eventType: K, payload: TEvents[K]): void {
    const listeners = this.listeners[eventType];
    if (listeners) {
      listeners.forEach((listener) => listener(payload));
    }
  }
}

export default EventBus;
