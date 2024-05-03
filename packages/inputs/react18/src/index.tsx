import React from "react";
import { Root, createRoot } from "react-dom/client";
import { Component } from "@widget-up-demo/react18";

// 创建 root 实例的全局引用
let root: Root | null = null;

const render = ({ rootElement }: { rootElement: HTMLElement }) => {
  // 确认 rootElement 存在
  if (!rootElement) {
    console.error("Root element not found.");
    return;
  }

  // 使用 createRoot 创建一个 root container
  root = createRoot(rootElement);
  root.render(<Component />);
};

const unmount = () => {
  // 尝试卸载 root 上现有的 React 组件
  if (root) {
    root.unmount();
    console.log("Component unmounted successfully.");
  } else {
    console.log("No component was mounted, or unmount was unsuccessful.");
  }
};

export { render, unmount };
