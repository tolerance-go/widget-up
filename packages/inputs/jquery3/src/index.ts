import { Component } from "@widget-up-demo/jquery3";

const registerRender = ({ rootElement }: { rootElement: HTMLElement }) => {
  // 确认 rootElement 存在
  if (!rootElement) {
    console.error("Root element not found.");
    return;
  }

  // 尝试卸载 rootElement 上现有的 React 组件
  rootElement.innerHTML = "";
  const element = Component().get(0);
  if (element) {
    rootElement.appendChild(element);
  }
};

export default registerRender;
