import { Component } from "runtime-component";

const render = ({ rootElement }: { rootElement: HTMLElement }) => {
  // 确认 rootElement 存在
  if (!rootElement) {
    console.error("Root element not found.");
    return;
  }

  const element = Component().get(0);
  if (element) {
    rootElement.appendChild(element);
  }
};

const unmount = ({ rootElement }: { rootElement: HTMLElement }) => {
  // 尝试卸载 rootElement 上现有的 React 组件
  rootElement.innerHTML = "";
};

export { render, unmount };
