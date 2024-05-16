import { globalEventBus } from "../events";

// 类型定义，用于 connectorRender 参数
export type RenderCallback = ({
  rootElement,
}: {
  rootElement: HTMLElement;
}) => void;

export type UnmountCallback = ({
  rootElement,
}: {
  rootElement: HTMLElement;
}) => void;

window.RuntimeComponent = {
  Component: undefined,
};

// 事件监听器存储回调函数
let globalRenderCallback: RenderCallback | null = null;
let globalUnmountCallback: UnmountCallback | null = null;
let globalPrevUnmountCallback: UnmountCallback | null = null;

export function replaceRuntimeComponent(component: any) {
  window.RuntimeComponent.Component = component;
}

// connectorRender 函数实现
export function replaceGlobalConnector(
  render: RenderCallback,
  unmount: UnmountCallback
): void {
  globalRenderCallback = render;
  globalUnmountCallback = unmount;
}

export function replaceGlobalPrevUnmount(unmount: UnmountCallback): void {
  globalPrevUnmountCallback = unmount;
}

export function startRender() {
  globalEventBus.on("globalComponentUpdated", () => {
    if (globalRenderCallback) {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        globalPrevUnmountCallback?.({ rootElement });
        globalRenderCallback({ rootElement });
        if (globalUnmountCallback) {
          replaceGlobalPrevUnmount(globalUnmountCallback);
        }
      }
    }
  });
}

// 暴露一个函数来触发更新，实际应用中可能不需要
export function triggerGlobalCompUpdate(): void {
  globalEventBus.emit("globalComponentUpdated", {});
}
