export type WrapScriptOptions = {
  scriptContent: string;
  eventId: string;
  eventBusPath?: string; // 可选参数，提供EventBus在window对象上的自定义路径
  globalObjectVarName?: string; // 新增参数，表示环境对象，如 window 或 global
};

export function wrapScriptAndWaitExec(options: WrapScriptOptions): string {
  const {
    scriptContent,
    eventId,
    eventBusPath = "EventBus",
    globalObjectVarName = "window",
  } = options;

  const loadedEvent = "loaded";
  const execEvent = "execute";
  const executedEvent = "executed";

  // 动态生成EventBus的全局访问路径
  const eventBusAccessor = `global${eventBusPath
    .split(".")
    .map((part) => `['${part}']`)
    .join("")}`;

  return `
  (function(global) {
      // 使用提供的路径或默认路径来访问EventBus
      const eventBus = ${eventBusAccessor} || { on: () => {}, emit: () => {} };
  
      // 监听执行事件
      eventBus.on('${execEvent}', function({ id }) {
        if (id !== '${eventId}') return;
        (function(eventBus) {
          // 'this' is explicitly set to 'null' or 'global' to avoid any unintended scope issues
          ${scriptContent}

          eventBus.emit('${executedEvent}', { id: '${eventId}' });
        }).call(global, eventBus);
      });
  
      // 脚本加载完毕，发送就绪事件
      eventBus.emit('${loadedEvent}', { id: '${eventId}' });
  
  })(${globalObjectVarName});
  `;
}
