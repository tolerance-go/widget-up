import { globalEventBus } from "../globalEventBus";

// 类型定义，用于 registerRender 参数
export type RenderCallback = ({
  rootElement,
}: {
  rootElement: HTMLElement;
}) => void;

// 事件监听器存储回调函数
let globalRenderCallback: RenderCallback | null = null;

// registerRender 函数实现
export function registerRender(callback: RenderCallback): void {
  globalRenderCallback = callback;

  globalEventBus.on("globalComponentUpdated", () => {
    if (globalRenderCallback) {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        console.log("start render");
        globalRenderCallback({ rootElement });
      }
    }
  });
}

// 暴露一个函数来触发更新，实际应用中可能不需要
export function triggerGlobalCompUpdate(): void {
  globalEventBus.emit("globalComponentUpdated", {});
}
