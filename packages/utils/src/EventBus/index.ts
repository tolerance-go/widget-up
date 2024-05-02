export class EventBus<TEvents extends Record<string, any>> {
  private listeners: {
    [K in keyof TEvents]?: ((payload: TEvents[K]) => void)[];
  } = {};

  // 新增属性来控制是否开启调试模式
  private debug: boolean;

  // 在构造函数中接受一个参数来设置是否开启调试模式
  constructor(debug: boolean = false) {
    this.debug = debug;
  }

  // 注册事件监听器
  on<K extends keyof TEvents>(
    eventType: K,
    listener: (payload: TEvents[K]) => void
  ): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType]!.push(listener);

    // 如果开启调试模式，打印监听器注册信息
    if (this.debug) {
      console.log(`Listener registered for event '${String(eventType)}'.`);
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
        if (this.debug) {
          console.log(`Listener removed for event '${String(eventType)}'.`);
        }
      }
    }
  }

  // 触发事件
  emit<K extends keyof TEvents>(eventType: K, payload: TEvents[K]): void {
    const listeners = this.listeners[eventType];
    if (listeners) {
      // 如果开启调试模式，打印事件触发信息
      if (this.debug) {
        console.log(
          `Event '${String(eventType)}' emitted with payload:`,
          payload
        );
      }
      listeners.forEach((listener) => listener(payload));
    }
  }
}
